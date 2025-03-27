import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import "./bootstrap.min.css";

// Function to fetch user and dentistry data based on the username
async function fetchUserAndDentistry(username: string) {
  const supabase = createClient();

  // Fetch the user by username
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, username")
    .eq("username", username)
    .single();

  if (userError || !userData) {
    return { username, dentistry: null };
  }

  // Fetch the dentistry data by user ID
  const { data: dentistryData, error: dentistryError } = await supabase
    .from("dentistries")
    .select("about_title, about_text")
    .eq("user_id", userData.id)
    .single();

  if (dentistryError || !dentistryData) {
    return { username: userData.username, dentistry: null };
  }

  return { username: userData.username, dentistry: dentistryData };
}

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}): Promise<Metadata> {
  const { username: fetchedUsername, dentistry } = await fetchUserAndDentistry(
    username
  );

  // Default title and description if dentistry doesn't exist or has null values
  const title = dentistry?.about_title || fetchedUsername;
  const description =
    dentistry?.about_text || "Learn more about this user and their expertise.";

  return {
    title,
    description,
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
