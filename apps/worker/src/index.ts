import "dotenv/config";
import { validateWorkerEnv } from "./config/env";

validateWorkerEnv(process.env);

console.log("[worker] EMR Despachante worker bootstrap up — no consumers registered yet.");
