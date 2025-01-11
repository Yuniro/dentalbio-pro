import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const body = await req.json();
    const { status, id: userId } = body; // Adjust fields based on Veriff's callback payload

    if (status === 'approved') {
      const { error } = await supabase
        .from('users') // Your Supabase table
        .update({ isVerified: true })
        .eq('id', userId);

      console.log(body);

      if (error) {
        throw new Error(`Supabase update error: ${error.message}`);
      }
    }

    return NextResponse.json({ message: 'Callback handled successfully' });
  } catch (error) {
    console.error('Error handling Veriff callback:', error);
    return NextResponse.json(
      { error: 'Failed to handle callback' },
      { status: 500 }
    );
  }
}
