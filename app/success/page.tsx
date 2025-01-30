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

  if (userError && userError.code !== "PGRST116") {
    return redirect("/error");
  }

  // If no userRecord, insert the user into the database
  if (!userRecord) {
    const { data: user, error: insertError } = await supabase.from("users").insert({
      username,
      email,
      first_name,
      last_name,
      title,
      country,
      position,
    })
      .select('*')
      .single();

    if (insertError) {
      return redirect("/error?message=insert_failed");
    }

    // After inserting the data, trigger the email confirmation process
    return (
      <>
        <SendEmailConfirmation
          email={email}
          firstName={first_name}
          lastName={last_name}
          username={username}
          title={title}
          country={country}
          position={position}
        />
        <div className="px-3 py-3 h-screen w-full flex flex-col items-center justify-between">
          <div className="flex flex-col items-start w-full justify-center">
            <div className="w-full flex justify-end items-center px-3">
              <SignOutForm /> {/* Use the client-side sign-out component */}
            </div>
            {user.role === "admin" && (
              <div className="w-full flex justify-end items-center px-3">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 hover:bg-gray-200 text-dark px-3 py-2 rounded-lg text-sm font-light transition-all"
                >
                  <User className="h-5 w-5" />
                  Admin
                </Link>
              </div>)}
            <div className="max-w-screen-2xl w-full mt-5 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-primary-orange-1 pb-6">
                Welcome, {first_name}!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
                dental.bio/{user.username} is yours!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-4">
                Upgrade now and enjoy 3 months free!
                {/* <span className="font-medium">is yours!</span> */}
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark pb-2">
                No payments until after our official launch!
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark">
                Exclusive pre-launch offer, don't miss out!
              </span>
              <div className="my-3">
                <GotoDashboard />
              </div>
              <PricingTable email={email} /> {/* Show pricing table */}
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

  const subscriptionStatus = userRecord?.subscription_status;

  // **Key Logic**: Show the pricing table for users who are **not** subscribed
  if (subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
    return (
      <>
        <div className="px-3 py-3 h-screen w-full flex flex-col items-center justify-between">
          <div className="flex flex-col items-start w-full justify-center">
            <div className="w-full flex justify-end items-center px-3">
              <SignOutForm /> {/* Use the client-side sign-out component */}
            </div>
            {userRecord.role === "admin" && (
              <div className="w-full flex justify-end items-center px-3">
                <Link
                  href="/admin"
                  className="flex no-underline items-center gap-2 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  <User size={20} weight="bold" />
                  Admin Panel
                </Link>
              </div>
            )}
            <div className="max-w-screen-2xl w-full mt-5 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-primary-orange-1 pb-6">
                Welcome, {first_name}!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
                dental.bio/{userRecord.username} is yours!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-4">
                Upgrade now and enjoy 3 months free!
                {/* <span className="font-medium">is yours!</span> */}
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark pb-2">
                No payments until after our official launch!
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark">
                Exclusive pre-launch offer, don't miss out!
              </span>
              <div className="my-3">
                <GotoDashboard />
              </div>
              <PricingTable email={email} /> {/* Show pricing table */}
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

  // For subscribed users, show the dashboard with the Manage Subscription button
  return (
    <>
      <div className="px-3 py-3 h-screen flex flex-col items-center justify-between">
        <div className="flex flex-col items-start justify-center">
          <div className="w-full flex justify-end items-center px-3">
            {/* Show the Manage Subscription button for subscribed users */}
            {/* <form action="" method="POST"> */}
            {/* <button
                onClick={handleManageSubscription}
                className="hover:bg-gray-200 text-dark px-3 py-2 rounded-lg text-sm font-light transition-all"
              >
                Manage Subscription
              </button> */}
            {/* </form> */}
            <SignOutForm /> {/* Use the client-side sign-out component */}
          </div>
          {userRecord.role === "admin" && (
            <div className="w-full flex justify-end items-center px-3">
              <Link
                href="/admin"
                className="flex no-underline items-center gap-2 hover:bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium transition-all"
              >
                <User size={20} weight="bold" />
                Admin Panel
              </Link>
            </div>
          )}
          <div className="max-w-screen-2xl w-full mt-5 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-primary-orange-1 pb-6">
              Welcome, {first_name}!
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
              dental.bio/{userRecord.username} is yours!
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-4">
              Upgrade now and enjoy 3 months free!
              {/* <span className="font-medium">is yours!</span> */}
            </span>
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark pb-2">
              No payments until after our official launch!
            </span>
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark">
              Exclusive pre-launch offer, don't miss out!
            </span>
            <PricingTable email={email} /> {/* Show pricing table */}
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
