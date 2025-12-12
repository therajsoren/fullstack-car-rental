import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionCookie, verifySession } from "./auth";

type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function getSession(): Promise<SessionUser | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const user = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return user[0] || null;
}

export async function getUserById(userId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user[0] || null;
}

export async function getUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return user[0] || null;
}
