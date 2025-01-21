import React from "react"
import ManageGalleries from "./ManageGalleries"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Gallery = async () => {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("email", authData?.user?.email)
    .single();

  if (!(userData?.subscription_status === "PRO" || userData?.subscription_status === "PREMIUM PRO"))
    return redirect("/dashboard");

  return (
    <div className='px-10 pt-10'>
      <ManageGalleries />
    </div>
  )
}

export default Gallery