import { createClient } from "contentful";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { PreviewProvider } from "./components/PreviewContext";

// Define the type for your content type fields
interface LandingPageFields {
  title: string;
  description: string;
}

const inter = Inter({ subsets: ["latin"] });

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

async function fetchLandingPage(): Promise<LandingPageFields | null> {
  const entryId = process.env.CONTENTFUL_ENTRY_ID;

  if (!entryId) {
    console.error("Entry ID not provided");
    return null;
  }

  try {
    const entry = await client.getEntry(entryId);

    const fields = entry.fields as { title: string; description: string };

    return {
      title:
        fields.title ||
        "Your FREE personalised dental website | Dentalbio - Your dental identity, simplified",
      description:
        fields.description ||
        "Build and personalise your Dentalbio website in minutes...",
    };
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await fetchLandingPage();

  if (!landingPage) {
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }

  return {
    title: landingPage.title,
    description: landingPage.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
