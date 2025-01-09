import GoogleAnalytics from "@/app/components/GoogleAnalytics";
import { PreviewProvider } from "@/app/components/PreviewContext";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { Author } from "next/dist/lib/metadata/types/metadata-types";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

// Function to fetch blog data based on the slug
async function fetchBlog(slug: string) {
  const supabase = createClient();

  // Fetch the blog by slug
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !blog) {
    throw new Error("Blog not found");
  }

  return {
    meta_title: blog.meta_title,
    meta_description: blog.meta_description,
    meta_image: blog.meta_image,  // Assuming there's a `meta_image` column
    content: blog.content,
  };
}

export async function generateMetadata({
  params: { username, slug },
}: {
  params: { username: string, slug: string };
}): Promise<Metadata> {
  const { username: fetchedUsername, dentistry } = await fetchUserAndDentistry(
    username
  );

  const { meta_title, meta_description, meta_image, content } = await fetchBlog(slug);

  // Set default values for the title and description
  const title = meta_title || dentistry?.about_title || username;
  const authors = [username] as Author[];
  const description = meta_description || content.slice(0, 200);

  // Set Open Graph and Twitter metadata
  const imageUrl = meta_image || "https://yourdefaultimage.com/default.jpg"; // Default image if no meta_image is provided

  return {
    title,
    authors,
    description,
    openGraph: {
      title,
      description,
      url: `https://yourwebsite.com/${slug}`,
      images: [{ url: imageUrl }],
      type: "article",  // Assuming it's a blog post, change as needed
    },
    twitter: {
      card: "summary_large_image",  // Large image card
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: any;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="Pw4B8ek0e6LOZZqGHufiTdEs-IXcGHD3hFS1U8q9478"
        />
      </head>
      <body className={`${inter.className} `}>
        {" "}
        <GoogleAnalytics ga_id={"G-987STTWJ02"} />
        <PreviewProvider>{children}</PreviewProvider>
      </body>
    </html>
  );
}
