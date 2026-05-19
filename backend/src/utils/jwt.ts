import { createHmac, timingSafeEqual } from "crypto";

type TokenPayload = {
  sub: number;
  email: string;
  role: string;
  name: string;
  region?: string;
  exp?: number;
  iat?: number;
};

const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60 * 24;

function getSecret() {
  return process.env.JWT_SECRET || "development-only-krishimitra-secret";
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sign(input: string) {
  return base64UrlEncode(createHmac("sha256", getSecret()).update(input).digest());
}

export function createToken(payload: TokenPayload, expiresInSeconds = DEFAULT_EXPIRES_IN_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    }),
  );
  const unsignedToken = `${header}.${body}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
}

export function verifyToken(token: string): TokenPayload {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    throw new Error("Malformed token");
  }

  const expectedSignature = sign(`${header}.${body}`);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(body)) as TokenPayload;

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}
