import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function verifyPassword(password: string, hashStr: string) {
  return compare(password, hashStr);
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function createSessionToken(...args: any[]): Promise<string> {
  return crypto.randomBytes(32).toString("hex");
}

export async function checkLoginRateLimit(identifier: string) {
  return { allowed: true, waitMinutes: 5 };
}

export async function recordFailedLogin(identifier: string) {}
export async function resetFailedLogins(identifier: string) {}

export async function verifySessionToken(token: string) {
  if (!token) return null;
  try {
    const session = await db.session.findUnique({
      where: { token },
    });
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    return session;
  } catch (err) {
    return null;
  }
}
