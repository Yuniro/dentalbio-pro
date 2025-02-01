import { NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";
import { createClient } from '@/utils/supabase/server';

const resolveTxt = promisify(dns.resolveTxt);

export async function POST(request: Request) {
  const { domain, userId } = await request.json();

  try {
    const supabase = createClient();

    const records = await resolveTxt(`_verify.${domain}`);

    const txtRecords = records.flat();

    if (txtRecords.includes(userId.verification_code)) {
      // await supabase
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}