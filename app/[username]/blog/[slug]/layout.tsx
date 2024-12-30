import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { Author } from "next/dist/lib/metadata/types/metadata-types";

// Function to fetch user and dentistry data based on the username
async function fetchBlog(slug: string) {
  const supabase = createClient();

  // Fetch the user by username

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  return { meta_title: blog.meta_title, meta_description: blog.meta_description, content: blog.content };
}

export async function generateMetadata({
  params: { username, slug },
}: {
  params: { username: string, slug: string };
}): Promise<Metadata> {
  const { meta_title, meta_description, content } = await fetchBlog(slug);

  const title = meta_title || username;
  const authors = [username] as Author[];
  const description = meta_description || content.slice(0, 200);

  return {
    title,
    authors,
    description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: any;
}>) {
  return <>{children}</>;
}
