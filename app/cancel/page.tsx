import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import PricingTable from "./PricingTable";
import Image from "next/image";
import Link from "next/link";
import SignOutForm from "./SignOutForm"; // Import the SignOutForm component
import ErrorMessage from "../components/ErrorMessage";

export default async function DashboardPage() {
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    redirect("/login");
  }

  const email = userData.user.email ?? "";

  // Fetch the user's data including subscription status and username
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, first_name")
    .eq("email", email)
    .single();

  if (userError || !userRecord) {
    redirect("/login");
  }

  const username = userRecord.username as string;
  const subscriptionStatus = userRecord.subscription_status;
  const first_name = userRecord.first_name;

  // Check if the subscription is active or trialing
  if (subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
    // If not subscribed, show the pricing table
    return (
      <>
        {/* Your dashboard content for subscribed users */}
        <div className="px-3 py-3 h-screen w-full flex flex-col items-center justify-between">
          <div className="flex flex-col items-start w-full justify-center">
            <div className="w-full flex justify-end items-center px-3">
              <SignOutForm /> {/* Use the client-side sign-out component */}
            </div>
            <div className="max-w-screen-2xl w-full mt-20 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
              <span className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-snug text-primary-orange-1 pb-10">
                Welcome, {first_name}!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
                dental.bio/{username} <br />{" "}
                <span className=" font-medium">is yours, forever</span>
              </span>

              <ErrorMessage errorMessage="Did not finish checkout process." />

              <PricingTable email={email} />
            </div>
          </div>
          <Link href={"/"}>
            <Image
              src="/logo.svg"
              width={150}
              height={40}
              alt="Footer logo"
              className="mb-10 mt-20"
            />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Your dashboard content for subscribed users */}
      <div className="px-3 py-3 h-screen flex flex-col items-center justify-between">
        <div className="flex flex-col items-start justify-center">
          <div className="w-full flex justify-between items-center px-3">
            <form action="/api/create-portal-session" method="post">
              <button
                type="submit"
                className="hover:bg-gray-200 text-dark px-3 py-2 rounded-lg text-sm font-light transition-all"
              >
                Manage Subscription
              </button>
            </form>
            <SignOutForm /> {/* Use the client-side sign-out component */}
          </div>
          <div className="max-w-screen-xl mt-20 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
            <span className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-snug text-primary-orange-1 pb-10">
              Welcome, {first_name}!
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
              dental.bio/{username} <br />{" "}
              <span className=" font-medium">is yours, forever</span>
            </span>
            <p>We'll notify you once the platform goes live!</p>
          </div>
        </div>
        <Link href={"/"} >
          <Image
            src="/logo.svg"
            width={150}
            height={40}
            alt="Footer logo"
            className="mb-10 mt-20"
          />
        </Link>
      </div>
    </>
  );
}
