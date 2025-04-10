import { createClient } from "contentful";
import { createClient as supabaseClient } from "@/utils/supabase/server";
import Navbar from "./components/Navbar";
import Hero from "./components/home-page/Hero";
import Section from "./components/home-page/section/Section";
import Section1 from "./components/home-page/section-1/Section1";
import Section2 from "./components/home-page/section-2/Section2";
import Section3 from "./components/home-page/section-3/Section3";
import Features from "./components/home-page/features/Features";
import PricingTable from "./components/home-page/pricing/PricingTable";
import FooterCta from "./components/home-page/FooterCta/FooterCta";
import Footer from "./components/Footer";
import PromoBanner from "./components/PromoBanner";
import { checkSession } from "@/utils/supabase/checkSession";
import { redirect } from "next/navigation";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});


const insertUser = async () => {
  const supabase = supabaseClient();

  // Fetch the authenticated user
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    console.log('authError', authError)
    redirect("/login");
  }

  const email = userData.user.email ?? "";
  const { username, first_name, last_name, birthday, offer_code, title, country, position, trial_end, subscription_status, inviteUserName, location } =
    userData.user.user_metadata;

  // Fetch the user's data including subscription status and username
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, first_name, role")
    .eq("email", email)
    .single();

  if (userError && userError.code !== "PGRST116") {
    return redirect("/error");
  }

  const convertToISO = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };
  
  // If no userRecord, insert the user into the database
  if (!userRecord) {
    const { data: user, error: insertError } = await supabase.from("users").insert({
      username,
      email,
      first_name,
      last_name,
      birthday: convertToISO(birthday),
      offer_code,
      title,
      trial_end,
      subscription_status,
      country,
      position,
    })
      .select('*')
      .single();

    if (insertError) {
      return redirect("/error?message=insert_failed");
    }
    
    const getRemainingMonths = (trialEnd: string) => {
      const now: Date = new Date();
      const trialEndDate: Date = new Date(trialEnd); // Convert string to Date object

      const yearsDiff: number = trialEndDate.getFullYear() - now.getFullYear();
      const monthsDiff: number = trialEndDate.getMonth() - now.getMonth();

      return yearsDiff * 12 + monthsDiff;
    }

    const trialMonths = getRemainingMonths(trial_end)

    // Function to send the confirmation email
    const sendConfirmationEmail = async() => {
      // Get user time
      const now = new Date();
      const userTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone: "Europe/London",
      });

      // Send the confirmation email with time and location
      const emailData = {
        email,
        first_name,
        username,
        last_name,
        birthday,
        offer_code,
        title,
        country,
        position,
        time: userTime,
        location: location || "Unknown",
        trialMonths,
        inviteUserName,
      };

      const emailResponse = await fetch(`${process.env.APP_URL}/api/send`, {
        method: "POST",
        body: JSON.stringify(emailData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!emailResponse.ok) {
        console.error("Error sending confirmation email");
      }
    }
    // Call the email sending function on mount
    await sendConfirmationEmail();
  }
}

export default async function HomePage() {

  const user = await checkSession();
  if (user) {
    await insertUser();
    return redirect('/dashboard')
  }

  const entryId = process.env.CONTENTFUL_ENTRY_ID;

  if (!entryId) {
    console.error("Entry ID not provided");
    return <p>Error: Entry ID is missing.</p>;
  }

  // Fetch the landing page entry
  const landingPage = await client.getEntry(entryId);
  const {
    heroSection,
    sectionOne,
    sectionTwo,
    sectionThree,
    featuresSection,
    footerCta,
  } = landingPage.fields;

  let heroData = null;
  let sectionData = null;
  let sectionOneData = null;
  let sectionTwoData = null;
  let sectionThreeData = null;
  let featuresData = null;
  let footerCtaData = null;

  // Fetch hero section if it exists
  if (heroSection) {
    // @ts-ignore
    const heroEntry = await client.getEntry(heroSection.sys.id);
    heroData = {
      hero_title: heroEntry.fields.heroTitle,
      hero_subtitle_bold: heroEntry.fields.heroBoldSubtitle,
      hero_subtitle_regular: heroEntry.fields.heroRegularSubtitle,
    };

    // If Section data exists inside the hero section, fetch it
    sectionData = {
      section_title: heroEntry.fields.sectionTitle || "",
      section_text_items: heroEntry.fields.sectionTextItems
        ? // @ts-ignore
        heroEntry.fields.sectionTextItems.map(
          (item: string, index: number) => ({
            id: index,
            section_text_item: item,
          })
        )
        : [],
    };
  }

  // Fetch features section if it exists
  if (featuresSection) {
    // @ts-ignore
    const featuresEntry = await client.getEntry(featuresSection.sys.id);
    featuresData = {
      section_title: featuresEntry.fields.sectionTitle || "",
      section_text_items: featuresEntry.fields.sectionTextItems
        ? // @ts-ignore
        featuresEntry.fields.sectionTextItems.map(
          (item: string, index: number) => ({
            id: index,
            section_text_item: item,
          })
        )
        : [],
    };
  }

  // Fetch features section if it exists
  if (footerCta) {
    // @ts-ignore
    const footerCtaEntry = await client.getEntry(footerCta.sys.id);
    footerCtaData = {
      title: footerCtaEntry.fields.title || "",
    };
  }

  // Fetch Section One if it exists
  if (sectionOne) {
    // @ts-ignore
    const sectionOneEntry = await client.getEntry(sectionOne.sys.id);
    sectionOneData = {
      title: sectionOneEntry.fields.title || "",
      description: sectionOneEntry.fields.description || "",
    };
  }

  // Fetch Section Two if it exists
  if (sectionTwo) {
    // @ts-ignore
    const sectionTwoEntry = await client.getEntry(sectionTwo.sys.id);
    sectionTwoData = {
      title: sectionTwoEntry.fields.title || "",
      description: sectionTwoEntry.fields.description || "",
    };
  }

  // Fetch Section Three if it exists
  if (sectionThree) {
    // @ts-ignore
    const sectionThreeEntry = await client.getEntry(sectionThree.sys.id);
    sectionThreeData = {
      title: sectionThreeEntry.fields.title || "",
      description: sectionThreeEntry.fields.description || "",
    };
  }

  return (
    <>
      <PromoBanner />
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full w-full overflow-x-clip">
        {/* Render Hero component */}
        {heroData && <Hero heroData={heroData} />}

        {/* Render Section component */}
        {sectionData && <Section section={sectionData} />}

        {/* Render Section1, Section2, and Section3 components */}
        {sectionOneData && <Section1 sectionOneData={sectionOneData} />}
        {sectionTwoData && <Section2 sectionTwoData={sectionTwoData} />}
        {sectionThreeData && <Section3 sectionThreeData={sectionThreeData} />}

        {/* Render Features component */}
        {featuresData && <Features featuresData={featuresData} />}
        <PricingTable />
        {footerCtaData && <FooterCta footerCtaData={footerCtaData} />}
      </div>
      <Footer />
    </>
  );
}
