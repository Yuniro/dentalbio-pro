import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateUniqueSlug } from '@/utils/slugGenerator';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const providedUserId = searchParams.get('userId');

    // Get the logged-in user's data if no user ID is provided
    const userData = providedUserId ? null : await getUser();
    const userId = providedUserId || userData?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('writer_id', userId)
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
  const { title, content, meta_title, meta_description, image_url } = await request.json();

  try {
    const supabase = createClient();

    const slug = await generateUniqueSlug(supabase, title);

    const userData = await getUser();

    if (!(userData.subscription_status === "pro"))
      return NextResponse.json({ error: "Please upgrade membership!" });

    const maxRank = await getMaxRank() + 1;

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, meta_title, meta_description, image_url, writer_id: userData.id, rank: maxRank, slug }])
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
  const { id, title, content, meta_title, meta_description, image_url, order } = await request.json();

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blogs')
      .update({ title, content, meta_title, meta_description, image_url, order })
      .eq('id', id)
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

    console.log(blog?.image_url);

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

async function getUser() {
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

async function getMaxRank() {
  try {
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

const deleteFileFromSupabase = async ({ supabase, bucketName, fileUrl }: { supabase: any, bucketName: string, fileUrl: string }) => {
  try {
    // Extract the bucket name and file path from the URL
    const urlParts = new URL(fileUrl);
    const filePath = urlParts.pathname.split(`/${bucketName}/`)[1];

    if (!filePath) {
      throw new Error("Invalid file URL or bucket name mismatch.");
    }

    console.log(filePath);

    // Remove the file from the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    console.log("File successfully deleted:", data);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};