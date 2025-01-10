import { NextResponse } from 'next/server';

const VERIFF_API_URL = 'https://stationapi.veriff.com/v1/sessions';
const API_KEY = process.env.VERIFF_API_KEY!; // Veriff API Key

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    const response = await fetch(VERIFF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        verification: {
          callback: 'https://yourapp.com/api/veriff/callback',
          person: { idNumber: userId },
          document: { type: 'ID_CARD' },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Veriff session:', error);
    return NextResponse.json(
      { error: 'Failed to create Veriff session' },
      { status: 500 }
    );
  }
}
