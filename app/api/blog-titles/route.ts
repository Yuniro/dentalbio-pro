import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const providedUserId = searchParams.get('userId');

    // Get the logged-in user's data if no user ID is provided
    const userData = providedUserId ? null : await getUserInfo({ supabase });
    const userId = providedUserId || userData?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blog_titles')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    const { data: existingData, error: readError } = await supabase
      .from('blog_titles')
      .select('*')
      .eq('user_id', userData.id)
      .single()

    if (existingData) {
      const { data, error } = await supabase
        .from('blog_titles')
        .update({ title })
        .eq('user_id', userData.id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ data });

    } else {

      const { data, error } = await supabase
        .from('blog_titles')
        .insert([{ title, user_id: userData.id }])
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
