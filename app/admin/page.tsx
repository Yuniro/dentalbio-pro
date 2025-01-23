import { createClient } from "@/utils/supabase/client";
import { AdminServer } from "@/utils/functions/useAdminServer";
import { getEffectiveUserId } from "@/utils/user/getEffectiveUserId";
import { redirect } from "next/navigation";
import AdminComponent from "./AdminComponent";

const Admin = async () => {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    redirect("/login");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, role")
    .eq("email", authData.user.email)
    .single();

  if (!(userData?.role === "admin"))
    return redirect("/dashboard");

  return (
    <>
      {userData && <AdminComponent />}
    </>);
};

export default Admin;
