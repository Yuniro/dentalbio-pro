import { createClient } from "@/utils/supabase/client";
import AdminComponent from "./AdminComponent";
import { isAdminMiddleware } from "@/utils/user/isAdmin";

const Admin = async () => {
  const supabase = createClient();

  const isAdmin: boolean = await isAdminMiddleware({ supabase }) || false;

  return (
    <>
      {isAdmin && <AdminComponent />}
    </>);
};

export default Admin;
