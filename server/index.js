import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(__dirname, "data");
const recordsFile = path.join(dataDir, "records.json");
const sessionsFile = path.join(dataDir, "sessions.json");
const port = Number(process.env.PORT || 3001);
const sessionCookie = "verity_session";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));

function ensureDataFiles() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(recordsFile)) fs.writeFileSync(recordsFile, "[]\n");
  if (!fs.existsSync(sessionsFile)) fs.writeFileSync(sessionsFile, "{}\n");
}

function readJson(file, fallback) {
  ensureDataFiles();
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDataFiles();
  const temporaryFile = `${file}.tmp`;
  fs.writeFileSync(temporaryFile, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporaryFile, file);
}

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };
}

function parseCookies(request) {
  const header = request.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .filter(Boolean)
      .map((pair) => {
        const separator = pair.indexOf("=");
        return [pair.slice(0, separator).trim(), decodeURIComponent(pair.slice(separator + 1).trim())];
      }),
  );
}

function setSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secure}`);
}

function clearSessionCookie(response) {
  response.setHeader("Set-Cookie", `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

function isAuthenticated(request) {
  const token = parseCookies(request)[sessionCookie];
  if (!token) return false;
  const sessions = readJson(sessionsFile, {});
  const session = sessions[token];
  if (!session || session.expiresAt < Date.now()) return false;
  return true;
}

function requireAuth(request, response, next) {
  if (!isAuthenticated(request)) {
    return response.status(401).json({ error: "Authentication required" });
  }
  return next();
}

function normalizeRecordInput(body) {
  const values = {
    holderName: String(body.holderName || "").trim(),
    referenceNo: String(body.referenceNo || "").trim(),
    amount: String(body.amount || "").trim(),
    issueDate: String(body.issueDate || "").trim(),
  };
  if (Object.values(values).some((value) => !value)) return null;
  return values;
}

function createSlug(holderName, referenceNo) {
  const base = `${holderName}-${referenceNo}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56) || "record";
  return `${base}-${crypto.randomBytes(4).toString("hex")}`;
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/auth/login", (request, response) => {
  const { username, password } = request.body || {};
  const credentials = getCredentials();
  if (!credentials.username || !credentials.password || username !== credentials.username || password !== credentials.password) {
    return response.status(401).json({ error: "Invalid username or password" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const sessions = readJson(sessionsFile, {});
  sessions[token] = { createdAt: Date.now(), expiresAt: Date.now() + 86_400_000 };
  writeJson(sessionsFile, sessions);
  setSessionCookie(response, token);
  return response.json({ authenticated: true });
});

app.get("/api/auth/me", (request, response) => {
  response.json({ authenticated: isAuthenticated(request) });
});

app.post("/api/auth/logout", (request, response) => {
  const token = parseCookies(request)[sessionCookie];
  const sessions = readJson(sessionsFile, {});
  if (token) delete sessions[token];
  writeJson(sessionsFile, sessions);
  clearSessionCookie(response);
  response.json({ success: true });
});

app.get("/api/records", requireAuth, (_request, response) => {
  const records = readJson(recordsFile, []);
  response.json(records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

app.post("/api/records", requireAuth, (request, response) => {
  const values = normalizeRecordInput(request.body || {});
  if (!values) return response.status(400).json({ error: "All record fields are required" });
  const record = { ...values, slug: createSlug(values.holderName, values.referenceNo), createdAt: new Date().toISOString() };
  const records = readJson(recordsFile, []);
  records.push(record);
  writeJson(recordsFile, records);
  return response.status(201).json(record);
});

app.get("/api/records/:slug", (request, response) => {
  const record = readJson(recordsFile, []).find((entry) => entry.slug === request.params.slug);
  if (!record) return response.status(404).json({ error: "Record not found" });
  return response.json(record);
});

app.delete("/api/records/:slug", requireAuth, (request, response) => {
  const records = readJson(recordsFile, []);
  const nextRecords = records.filter((record) => record.slug !== request.params.slug);
  if (nextRecords.length === records.length) return response.status(404).json({ error: "Record not found" });
  writeJson(recordsFile, nextRecords);
  return response.status(204).end();
});

const staticDirectory = path.join(rootDir, "dist");
if (fs.existsSync(staticDirectory)) {
  app.use(express.static(staticDirectory));
  app.get(/^(?!\/api).*/, (_request, response) => {
    response.sendFile(path.join(staticDirectory, "index.html"));
  });
}

ensureDataFiles();
app.listen(port, () => {
  console.log(`Verity server running on http://localhost:${port}`);
});
