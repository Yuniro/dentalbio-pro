// app/api/veriff/session-status/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const sharedSecret = process.env.VERIFF_SHARED_SECRET!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const apiKey = process.env.VERIFF_API_KEY;
  const apiUrl = `${process.env.VERIFF_API_URL}/${sessionId}/decision`;

  if (!apiKey || !apiUrl) {
    return NextResponse.json({ error: 'API key or URL is not set in the environment variables' }, { status: 500 });
  }

  const hmac = crypto.createHmac('sha256', sharedSecret);
  hmac.update(sessionId);
  const signature = hmac.digest('hex');

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
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
