import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';
import { getMaxRank } from '@/utils/getMaxOrder';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const providedUserId = searchParams.get('userId');

    // Get the logged-in user's data if no user ID is provided
    const userData = providedUserId ? null : await getUserInfo({ supabase });
    const userId = providedUserId || userData?.id;
    const enabledField = providedUserId ? [true] : [true, false];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const { data: groups, error: groupsError } = await supabase
      .from('blog_groups')
      .select('*')
      .eq('user_id', userId)
      .in('enabled', enabledField)
      .order('rank', { ascending: true });

    if (groupsError) {
      return NextResponse.json({ error: groupsError.message }, { status: 400 });
    }

    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .in('enabled', enabledField)
      .order('rank', { ascending: true });

      if (blogsError) {
        return NextResponse.json({ error: blogsError.message }, { status: 400 });
      }

    const groupedBlogs = groups.map(group => ({
      ...group,
      blogs: blogs.filter(blog => blog.group_id === group.id),
    }));

    return NextResponse.json(groupedBlogs);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    if (!(userData.subscription_status === "PRO" && userData.subscription_status === "PREMIUM PRO" && userData.subscription_status === "trialing"))
      return NextResponse.json({ error: "Please upgrade membership!" });

    const maxRank = await getMaxRank({ supabase, table: "blog-groups", field: "user_id", value: userData.id }) + 1;

    const { data, error } = await supabase
      .from('blog_groups')
      .insert([{ name, user_id: userData.id, rank: maxRank, enabled: true }])
      .select('*, blogs(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const updated_data = await request.json();

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('blog_groups')
      .update(updated_data)
      .eq('id', updated_data.id)
      .select('*, blogs(*)')
      .single();

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
      .from('blog_groups')
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
