"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import AdminComponent from "./AdminComponent";

const Admin = () => {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuthorization = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("email", authData?.user?.email);

      if (userError || !userData) {
        router.push("/login");
        return;
      }

      if (userData[0]?.role !== "admin") {
        router.push("/login");
        return;
      }
    };

    checkAuthorization();
  }, [router, supabase]);

  return <AdminComponent />;
};

export default Admin;
