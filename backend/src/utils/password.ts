import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const HASH_ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");

  return `${HASH_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [iterations, salt, hash] = storedHash.split(":");

  if (!iterations || !salt || !hash) {
    return false;
  }

  const candidate = pbkdf2Sync(
    password,
    salt,
    Number(iterations),
    KEY_LENGTH,
    DIGEST,
  );
  const original = Buffer.from(hash, "hex");

  return original.length === candidate.length && timingSafeEqual(original, candidate);
}
