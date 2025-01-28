import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    redirect("/login");
  }

  const email = userData.user.email;

  // Fetch the username from the database
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("email", email)
    .single();

  if (userError || !userRecord) {
    redirect("/login");
  }

  const username = userRecord.username;


  return (
    <>
      <div className="hero-section text-center mt-32 md:mt-48">
        <div className="max-w-screen-xl px-5 lg:px-32 mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
            Congratulations!
          </h1>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-2">
            dental.bio/{username}
            <span className="font-normal">
              <br />
              is yours forever!
            </span>
          </h2>
          <p className="md:text-xl px-7 md:px-0 text-dark mt-8">
            Thank you so much for taking the time to claim your Dentalbio!
          </p>
          <p className="md:text-xl px-7 md:px-0 text-dark mt-2">
            We will let you know as soon as Dentalbio is online at {email}
          </p>
        </div>
      </div>
    </>
  );
}
