"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { useAdmin } from "@/utils/functions/useAdmin";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // const { setTargetUserId } = useAdmin();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Instead of redirecting, return the error message
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}