import assert from "node:assert/strict";
import test from "node:test";
import { fetchVehicleLookup, parseLookupBody } from "./client";

const BASE_URL = "https://api.example.test";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const completedBody = {
  status: "completed",
  consultationId: "lookup-1",
  vehicle: { plate: "ABC1D23", model: "Honda HR-V", year: 2022, overallStatus: "IRREGULAR" },
  pendings: [{ id: "fine-1", kind: "fine", label: "Multa", amountCents: 1000, status: "OPEN" }],
  lastUpdatedAt: "2026-10-10T12:00:00.000Z",
};

async function withStubbedFetch<T>(
  stub: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  run: () => Promise<T>,
): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = stub as typeof globalThis.fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

test("maps a completed response and derives the total from the listed items", async () => {
  const outcome = await withStubbedFetch(
    async () => jsonResponse(completedBody),
    () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
  );

  assert.equal(outcome.status, "completed");
  assert.ok(outcome.status === "completed");
  assert.equal(outcome.consultationId, "lookup-1");
  assert.equal(outcome.totalCents, 1000);
  assert.equal(outcome.vehicle.model, "Honda HR-V");
  assert.equal(outcome.lastUpdatedAt.toISOString(), "2026-10-10T12:00:00.000Z");
});

test("treats renavam_required as a flow step, not an error", async () => {
  const outcome = await withStubbedFetch(
    async () => jsonResponse({ status: "renavam_required" }),
    () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
  );

  assert.deepEqual(outcome, { status: "renavam_required" });
});

test("maps the domain error code to the outcome", async () => {
  const cases: Array<[string, string]> = [
    ["VEHICLE_NOT_FOUND", "not_found"],
    ["VEHICLE_LOOKUP_RATE_LIMITED", "rate_limited"],
    ["VEHICLE_LOOKUP_INVALID_PLATE", "unavailable"],
    ["VEHICLE_LOOKUP_UNAVAILABLE", "unavailable"],
  ];

  for (const [code, expected] of cases) {
    const outcome = await withStubbedFetch(
      // Status propositalmente "errado" para provar que o código manda.
      async () => jsonResponse({ code }, 500),
      () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
    );
    assert.equal(outcome.status, expected, code);
  }
});

test("falls back to the HTTP status when no known code is in the body", async () => {
  const cases: Array<[number, string]> = [
    [404, "not_found"],
    [429, "rate_limited"],
    [422, "unavailable"],
    [500, "unavailable"],
    [503, "unavailable"],
  ];

  for (const [status, expected] of cases) {
    const outcome = await withStubbedFetch(
      async () => jsonResponse({ code: "WHATEVER" }, status),
      () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
    );
    assert.equal(outcome.status, expected, `HTTP ${status}`);
  }
});

test("a gateway error with no JSON body is still unavailable", async () => {
  const outcome = await withStubbedFetch(
    async () => new Response("<html>502 Bad Gateway</html>", { status: 502 }),
    () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
  );

  assert.deepEqual(outcome, { status: "unavailable" });
});

test("a network failure becomes unavailable instead of throwing", async () => {
  const outcome = await withStubbedFetch(
    async () => {
      throw new TypeError("fetch failed");
    },
    () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
  );

  assert.deepEqual(outcome, { status: "unavailable" });
});

test("a timeout becomes unavailable instead of throwing", async () => {
  const outcome = await withStubbedFetch(
    (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
      }),
    () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL, timeoutMs: 5 }),
  );

  assert.deepEqual(outcome, { status: "unavailable" });
});

test("an abort from the caller propagates, so a stale response cannot win", async () => {
  const controller = new AbortController();
  await assert.rejects(() =>
    withStubbedFetch(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
          controller.abort();
        }),
      () =>
        fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL, signal: controller.signal }),
    ),
  );
});

test("omits renavam from the payload when it was not requested", async () => {
  let sentBody = "";
  await withStubbedFetch(
    async (_input, init) => {
      sentBody = String(init?.body);
      return jsonResponse(completedBody);
    },
    () => fetchVehicleLookup({ plate: "ABC1D23" }, { baseUrl: BASE_URL }),
  );

  assert.deepEqual(JSON.parse(sentBody), { plate: "ABC1D23" });
  assert.ok(!sentBody.includes("renavam"));
});

test("sends renavam in the body — never in the URL", async () => {
  let requestedUrl = "";
  let sentBody = "";
  await withStubbedFetch(
    async (input, init) => {
      requestedUrl = String(input);
      sentBody = String(init?.body);
      return jsonResponse(completedBody);
    },
    () => fetchVehicleLookup({ plate: "ABC1D23", renavam: "12345678901" }, { baseUrl: BASE_URL }),
  );

  assert.deepEqual(JSON.parse(sentBody), { plate: "ABC1D23", renavam: "12345678901" });
  assert.ok(!requestedUrl.includes("12345678901"));
  assert.equal(requestedUrl, "https://api.example.test/public/vehicle-lookups");
});

test("a 200 with a body outside the contract is unavailable, never fabricated data", () => {
  assert.deepEqual(parseLookupBody(null), { status: "unavailable" });
  assert.deepEqual(parseLookupBody({ status: "completed" }), { status: "unavailable" });
  assert.deepEqual(parseLookupBody({ ...completedBody, vehicle: { plate: "ABC1D23" } }), {
    status: "unavailable",
  });
  assert.deepEqual(
    parseLookupBody({
      ...completedBody,
      vehicle: { ...completedBody.vehicle, overallStatus: "SOMETHING" },
    }),
    { status: "unavailable" },
  );
  assert.deepEqual(parseLookupBody({ ...completedBody, lastUpdatedAt: "not-a-date" }), {
    status: "unavailable",
  });
  assert.deepEqual(parseLookupBody({ ...completedBody, pendings: [{ id: "x" }] }), {
    status: "unavailable",
  });
});

test("a completed response with no pendings is valid — absence of debt is a result", () => {
  const outcome = parseLookupBody({ ...completedBody, pendings: [] });
  assert.ok(outcome.status === "completed");
  assert.deepEqual(outcome.pendings, []);
  assert.equal(outcome.totalCents, 0);
});
