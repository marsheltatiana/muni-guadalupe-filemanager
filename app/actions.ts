"use server";

import { signIn } from "@/lib/auth";

export async function signWithGoogle() {
  await signIn("google");
}
