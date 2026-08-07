import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4001;
const BASE = `http://localhost:${PORT}`;
const DATA_FILE = path.join(__dirname, "..", "runnable", "data.json");
let serverInstance;

before(async () => {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);
  const srv = require(path.join(__dirname, "..", "runnable", "server.js"));
  if (srv && typeof srv.startServer === "function") {
    serverInstance = await srv.startServer({ port: PORT, host: "127.0.0.1" });
    return;
  }
  throw new Error("runnable/server.js does not export startServer in this environment");
});

after(() => {
  if (serverInstance && typeof serverInstance.close === "function") {
    try {
      serverInstance.close();
    } catch (e) {
      /* ignore */
    }
  }
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
});

describe("runnable/server.js inproc — basic checks", () => {
  it("GET / returns 200", async () => {
    const res = await fetch(BASE + "/");
    assert.equal(res.status, 200);
  });
});
