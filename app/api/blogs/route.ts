import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateUniqueSlug } from '@/utils/slugGenerator';
import { getUserInfo } from '@/utils/userInfo';
import { deleteFileFromSupabase } from '@/utils/removeFromBucket';
import { getMaxRankFromBlog } from '@/utils/getMasOrder';

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

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('writer_id', userId)
      .in('enabled', enabledField)
      .order('rank', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, content, meta_title, meta_description, image_url, slug } = await request.json();

  try {
    const supabase = createClient();

    const uniqueSlug = await generateUniqueSlug(supabase, slug);

    const userData = await getUserInfo({ supabase });

    if (!(userData.subscription_status === "pro"))
      return NextResponse.json({ error: "Please upgrade membership!" });

    const maxRank = await getMaxRankFromBlog({ supabase }) + 1;

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, meta_title, meta_description, image_url, writer_id: userData.id, rank: maxRank, slug: uniqueSlug }])
      .select("*")
      .single();;

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
    const finalData = updated_data.slug ? { ...updated_data, slug: await generateUniqueSlug(supabase, updated_data.slug, updated_data.id) } : updated_data;

    if (updated_data?.image_url) {
      const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', updated_data.id)
        .single();

      if (updated_data.image_url !== blog.image_url && blog.image_url.length > 0)
        await deleteFileFromSupabase({ supabase, bucketName: 'blog-images', fileUrl: blog.image_url });
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(finalData)
      .eq('id', updated_data.id)
      .select('*')
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

    const { data: blog, error: getError } = await supabase
      .from('blogs')
      .select('image_url')
      .eq('id', id)
      .single()

    if (blog?.image_url)
      await deleteFileFromSupabase({ supabase, bucketName: 'blog-images', fileUrl: blog.image_url });

    const { data, error } = await supabase
      .from('blogs')
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
