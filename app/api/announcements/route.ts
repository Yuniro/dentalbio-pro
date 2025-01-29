import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    const { data: titleData, error: titleError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'announcement_title')
      .single();

    if (titleError) {
      return NextResponse.json({ error: titleError.message }, { status: 400 });
    }

    const { data: contentData, error: contentError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'announcement_content')
      .single();

    if (contentError) {
      return NextResponse.json({ error: contentError.message }, { status: 400 });
    }

    return NextResponse.json({ title: titleData.value, content: contentData.value });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, content } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    if (!(userData.role === 'admin'))
      return NextResponse.json({ error: "You have no permission for this action!" });

    const { data, error } = await supabase
      .from('settings')
      .insert([{ 'key': 'announcement_title', 'value': title }, { 'key': 'announcement_content', 'value': content }])
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { title, content } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    if (!(userData.role === 'admin'))
      return NextResponse.json({ error: "You have no permission for this action!" });

    const { data: titleData, error: titleError } = await supabase
      .from('settings')
      .update({ value: title })
      .eq('key', 'announcement_title')
      .select("value")
      .single();

    if (titleError) {
      return NextResponse.json({ error: titleError.message }, { status: 400 });
    }

    const { data: contentData, error: contentError } = await supabase
      .from('settings')
      .update({ value: content })
      .eq('key', 'announcement_content')
      .select("value")
      .single();

    if (contentError) {
      return NextResponse.json({ error: contentError.message }, { status: 400 });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
