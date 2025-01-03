import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./link-page-responsive.css";
import "./bootstrap.min.css";
import "./link-page.css";

import Header from "./components/Header";
import ProfileDetail from "./components/ProfileDetail";
import Treatments from "./components/Treatments";
import WorkLocation from "./components/WorkLocation";
import Footer from "./components/Footer";
import supabase from "../lib/supabaseClient";
import Links from "./components/Links";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore } from "next/cache"; // Import noStore to prevent caching
import BlogList from "./components/BlogList";
import Gallery from "./components/Gallery";

type PageProps = {
  params: { username: string };
};

export default async function HomePage({ params }: PageProps) {
  const username = params.username;

  unstable_noStore();

  // Fetch the user from Supabase based on the username slug
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, position, first_name, last_name, title, gdc_no, qualification")
    .eq("username", username)
    .single();

  // Handle error or no user case
  if (!user || userError) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen gap-10 text-center mx-auto px-10`}>
        <span className="bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
          <span className="flex items-center mb-4 justify-center flex-col text-6xl md:text-8xl font-bold">
            dental.bio/<span className="font-bold">{username}</span>
          </span>
          <span className="text-3xl font-bold max-w-screen-md w-full mx-auto bg-clip-text text-transparent">
            is available!
          </span>
        </span>

        <Link
          href={"/"}
          className="w-full text-2xl whitespace-nowrap mx-auto py-2 font-semibold bg-gradient-to-r from-[#d47e8b] via-[#d47e8b] to-[#e09f7e] text-white rounded-[40px] border-[0.6px] shadow-sm bg-opacity-90 backdrop-blur-lg border-transparent max-w-80 no-underline px-4 transition-all duration-300 ease-in-out hover:bg-opacity-80 focus:outline-none"
        >
          Claim
        </Link>

        <p className="text-md font-bold text-2xl md:text-3xl leading-normal md:leading-normal md:mt-[50px] max-w-screen-md w-full text-center text-[#8866e9]">
          Grab it before its taken!
        </p>

        <Link href={"/"}>
          <Image
            src={"/logo.svg"}
            width={200}
            height={25}
            alt="Dental.bio navigation bar logo"
            className="px-4 py-3 pt-5"
          />
        </Link>
      </div>
    );
  }

  // Fetch the dentistry data using the user's ID
  const { data: dentistry, error: dentistryError } = await supabase
    .from("dentistries")
    .select("dentistry_id, about_title, about_text, phone, booking_link, contact_email")
    .eq("user_id", user.id)
    .single();

  // Handle error or no dentistry case
  if (!dentistry || dentistryError) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen gap-10 text-center mx-auto px-10`}>
        <span className="bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
          <span className="flex items-center mb-4 justify-center flex-col text-6xl md:text-8xl font-bold">
            dental.bio/<span className="font-bold">{username}</span>
          </span>
          <span className="text-3xl font-bold max-w-screen-md w-full mx-auto bg-clip-text text-transparent">
            is reserved!
          </span>
        </span>

        <Link
          href={"/"}
          className="w-full text-2xl whitespace-nowrap mx-auto py-2 font-semibold bg-gradient-to-r from-[#d47e8b] via-[#d47e8b] to-[#e09f7e] text-white rounded-[40px] border-[0.6px] shadow-sm bg-opacity-90 backdrop-blur-lg border-transparent max-w-md no-underline px-4 transition-all duration-300 ease-in-out hover:bg-opacity-80 focus:outline-none"
        >
          Claim your own
        </Link>

        <p className="text-md font-bold text-2xl md:text-3xl leading-normal md:leading-normal md:mt-[50px] max-w-screen-md w-full text-center text-[#8866e9]">
          Grab one before it’s taken!
        </p>

        <Link href={"/"}>
          <Image
            src={"/logo.svg"}
            width={200}
            height={25}
            alt="Dental.bio navigation bar logo"
            className="px-4 py-3 pt-5"
          />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper">
        <div className="profile-wrapper">
          <Header
            username={username}
            dentistry_id={dentistry.dentistry_id}
            contact_email={dentistry.contact_email}
          />

          {dentistry.about_title && (
            <ProfileDetail
              username={username}
              position={user.position}
              gdc_no={user.gdc_no}
              qualification={user.qualification}
              title={dentistry.about_title}
              description={dentistry.about_text}
              dentistry_id={dentistry.dentistry_id}
            />
          )}
          <Treatments dentistryId={dentistry.dentistry_id} />
          <Links dentistryId={dentistry.dentistry_id} />
          <BlogList
            userId={user.id}
            username={username}
            userFirstName={user.first_name}
            userTitle={user.title}
          />
          <Gallery
            userId={user.id}
          />
          <WorkLocation dentistry={dentistry} />
          <Footer
            dentistryId={dentistry.dentistry_id}
            bookingLink={dentistry.booking_link}
            contact_email={dentistry.contact_email}
            userTitle={user.title}
            username={username}
            userFirstName={user.first_name}
            userLastName={user.last_name}
          />
        </div>
      </div>
    </>
  );
}
