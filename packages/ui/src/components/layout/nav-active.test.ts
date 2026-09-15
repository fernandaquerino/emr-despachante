import { describe, expect, it } from "vitest";
import { resolveActiveHref, scopeActivePathToGroup } from "./nav-active";

describe("resolveActiveHref", () => {
  it("returns undefined when there is no activePath", () => {
    expect(resolveActiveHref(["/admin"], undefined)).toBeUndefined();
  });

  it("matches an exact href", () => {
    expect(resolveActiveHref(["/admin", "/admin/solicitacoes"], "/admin")).toBe("/admin");
  });

  it("matches a nested subroute of a deeper href", () => {
    expect(resolveActiveHref(["/admin", "/admin/solicitacoes"], "/admin/solicitacoes/123")).toBe(
      "/admin/solicitacoes",
    );
  });

  it("picks the most specific (longest) href when more than one matches", () => {
    expect(
      resolveActiveHref(
        ["/admin", "/admin/financeiro", "/admin/financeiro/pedidos"],
        "/admin/financeiro/pedidos/1",
      ),
    ).toBe("/admin/financeiro/pedidos");
  });

  it("does not match a sibling that only shares a string prefix", () => {
    expect(resolveActiveHref(["/admin/veiculo"], "/admin/veiculos")).toBeUndefined();
  });

  it("returns undefined when nothing matches", () => {
    expect(resolveActiveHref(["/admin/solicitacoes"], "/partner")).toBeUndefined();
  });
});

describe("scopeActivePathToGroup", () => {
  const groups = [["/admin"], ["/admin/solicitacoes", "/admin/casos"]];

  it("passes activePath through for the group containing the winning href", () => {
    expect(scopeActivePathToGroup(groups, 1, "/admin/solicitacoes/123")).toBe(
      "/admin/solicitacoes/123",
    );
  });

  it("suppresses activePath for a sibling group that does not contain the winner", () => {
    expect(scopeActivePathToGroup(groups, 0, "/admin/solicitacoes/123")).toBeUndefined();
  });

  it("suppresses activePath for every group when nothing matches", () => {
    expect(scopeActivePathToGroup(groups, 0, "/partner")).toBeUndefined();
    expect(scopeActivePathToGroup(groups, 1, "/partner")).toBeUndefined();
  });
});
