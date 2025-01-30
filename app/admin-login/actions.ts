"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { getAuthorizedUser } from "@/utils/user/getAuthorizedUser";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Instead of redirecting, return the error message
    return { error: error.message };
  }

  const { isAdmin } = await getAuthorizedUser();

  console.log(isAdmin);

  // if (isAdmin) {
    revalidatePath("/", "layout");
    redirect("/admin");
  // } else {
  //   const { error } = await supabase.auth.signOut();

  //   return { error: "Access is restricted to admin users only."}
  // }
}
