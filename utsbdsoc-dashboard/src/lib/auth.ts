import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Member } from "@/generated/prisma";

export interface AuthContext {
  member: Member;
}

/**
 * Resolves Supabase session to a Member record.
 * In development, set DEV_BYPASS_AUTH=true and DEV_USER_EMAIL to skip Supabase auth.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  // Dev bypass for local development without Supabase
  if (process.env.DEV_BYPASS_AUTH === "true") {
    const email = process.env.DEV_USER_EMAIL ?? "admin@utsbdsoc.org";
    const member = await prisma.member.findUnique({ where: { email } });
    if (!member) return null;
    return { member };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return null;

    const member = await prisma.member.findUnique({
      where: { email: user.email },
    });

    if (!member) return null;

    return { member };
  } catch {
    return null;
  }
}

/**
 * Require auth — throws if not authenticated. Use in API routes.
 */
export async function requireAuth(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx) {
    throw new Error("UNAUTHORIZED");
  }
  return ctx;
}
