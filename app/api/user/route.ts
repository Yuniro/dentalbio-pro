import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getEffectiveUserId } from '@/utils/user/getEffectiveUserId';

export async function POST(request: Request) {
  const { targetUserId } = await request.json();

  try {
    const supabase = createClient();

    const userId = await getEffectiveUserId({ targetUserId, supabase });

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
