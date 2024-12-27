import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    // console.log(request);
    const supabase = createClient();
    const userData = await getUser();

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('writer_id', userData.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, content, meta_title, meta_description, image_url } = await request.json();

  try {
    const supabase = createClient();
    const userData = await getUser();

    const maxRank = await getMaxRank() + 1;

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, meta_title, meta_description, image_url, writer_id: userData.id, rank: maxRank }])
      .select("*")
      .single();;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, title, content, meta_title, meta_description, image_url, order } = await request.json();

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blogs')
      .update({ title, content, meta_title, meta_description, image_url, order })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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
    const { data, error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function getUser() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (userError) {
      return null;
    }

    return userData
  } catch (error) {
    return null;
  }
}

export async function getMaxRank() {
  try {
    // console.log(request);
    const supabase = createClient();
    const userData = await getUser();

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('writer_id', userData.id);

    if (error) {
      return 0;
    }

    const maxRank = data.reduce((max, item) => (item.rank > max ? item.rank : max), 0);
    return maxRank;
  } catch (error) {
    return 0;
  }
}