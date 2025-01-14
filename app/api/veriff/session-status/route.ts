// app/api/veriff/session-status/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import { getUserInfo } from '@/utils/userInfo';

const sharedSecret = process.env.VERIFF_SHARED_SECRET!;

export async function GET(request: Request) {
  const supabase = createClient();

  const userData = await getUserInfo({ supabase });

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  // const sessionId = "c47042c3-baa7-4c57-9b98-32c510e913d8";

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const apiKey = process.env.VERIFF_API_KEY;
  const apiUrl = `${process.env.VERIFF_API_URL}/${sessionId}/attempts`;

  if (!apiKey || !apiUrl) {
    return NextResponse.json({ error: 'API key or URL is not set in the environment variables' }, { status: 500 });
  }

  const hmac = crypto.createHmac('sha256', sharedSecret);
  hmac.update(sessionId);
  const signature = hmac.digest('hex');

  console.log(apiKey);
  console.log(signature);
  console.log(apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-AUTH-CLIENT': apiKey,
        'X-HMAC-SIGNATURE': signature,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session status: ${response.statusText}`);
    }

    const data = await response.json();

    // console.log(data);

    const verifications = data.verifications;
    let status = "declined";

    verifications.forEach((verification: any) => {
      if (verification.status === "pending") {
        status = "pending";
      }
    });

    verifications.forEach((verification: any) => {
      if (verification.status === "approved") {
        status = "approved";
      }
    });

    if (status === "approved") {
      const { error } = await supabase
        .from('users')
        .update({ isVerified: true })
        .eq("id", userData.id)
    }

    return NextResponse.json({ status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
