import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { status, id: userId } = body; // Adjust fields based on Veriff's callback payload

    if (status === 'approved') {
      const { error } = await supabase
        .from('users') // Your Supabase table
        .update({ isVerified: true })
        .eq('id', userId);

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
