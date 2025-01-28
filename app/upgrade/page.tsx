import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import PricingTable from "./PricingTable";
import Image from "next/image";
import Link from "next/link";
import SignOutForm from "./SignOutForm"; // Import the SignOutForm component
import SendEmailConfirmation from "./SendEmailConfirmation"; // Import the client-side component
import { revalidatePath } from "next/cache";
import { User } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import GotoDashboard from "../components/Button/GotoDashboard";

export default async function DashboardPage() {
  const supabase = createClient();

  // const handleManageSubscription = async () => {
  //   "use server"
  //   const response = await fetch('/api/create-portal-session', {
  //     method: 'POST'
  //   })
  // }

  // Fetch the authenticated user
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    redirect("/login");
  }

  const email = userData.user.email ?? "";
  const { username, first_name, last_name, title, country, position } =
    userData.user.user_metadata;

  // Fetch the user's data including subscription status and username
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, first_name, role")
    .eq("email", email)
    .single();

  if ((!userRecord) || (userError)) {
    return redirect("/error");
  }

  const subscriptionStatus = userRecord?.subscription_status;

  // // **Key Logic**: Show the pricing table for users who are **not** subscribed
  // if (subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
  //   return (
  //     <>
  //       <PricingTable email={email} /> {/* Show pricing table */}
  //       <Link href={"/"}>
  //         <Image
  //           src="/logo.svg"
  //           width={150}
  //           height={40}
  //           alt="Footer logo"
  //           className="mb-10 mt-20"
  //         />
  //       </Link>
  //     </>
  //   );
  // }

  // For subscribed users, show the dashboard with the Manage Subscription button
  return (
    <>
      <div className="min-h-[100vh]">
        <PricingTable email={email} /> {/* Show pricing table */}
      </div>
      <div className="flex justify-center">
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
