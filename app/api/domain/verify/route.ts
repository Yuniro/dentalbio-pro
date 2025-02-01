import { NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from "@/utils/userInfo";

const resolveCname = promisify(dns.resolveCname);

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const supabase = createClient();

    const { targetUserId, domain, verificationCode } = body;
    const userData = await getUserInfo({ supabase });

    if (userData.subscription_status !== "PREMIUM PRO")
      return NextResponse.json({ error: "Please upgrade membership!" });

    if (targetUserId && userData.role !== "admin")
      return NextResponse.json({ error: "You are not authorized to this action!" });


    const records = await resolveCname(`_verify.${domain}`);
    const recordsTxt = records.flat();

    const expectedRecord = `verify.dental.bio`;

    if (recordsTxt.includes(expectedRecord)) {
      const { data, error } = await supabase
        .from("users")
        .update({ domain })
        .eq("id", userData.id);

      if (error) {
        return NextResponse.json({ error: "Failed to update user record" }, { status: 500 });
      }

      return NextResponse.json({ message: "Domain verified successfully!" });
    }

    return NextResponse.json({ message: "Domain verified failed!" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}