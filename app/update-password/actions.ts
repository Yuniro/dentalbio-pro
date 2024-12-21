"use server"
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePasswordAction(formData: FormData) {
  const supabase = createClient();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      console.log('Password recovery process started');
    }
  })

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  // console.log(email, password, confirmPassword)
  // Ensure all fields are filled and passwords match
  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // Update user's password
  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    return {
      error: `Error updating password: ${updateError.message}`,
    };
  }

  // Automatically sign in the user after password update
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      error: `Error signing in: ${signInError.message}`,
    };
  }

  // Redirect to the dashboard after successful login
  revalidatePath("/");
  redirect("/dashboard");
}
