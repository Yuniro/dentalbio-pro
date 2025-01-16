import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';
import { deleteFileFromSupabase } from '@/utils/removeFromBucket';
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

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
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
  const { group_id, name, link, platform, image_url, price, currency } = await request.json();

  try {
    const supabase = createClient();

    const maxRank = await getMaxRank({ supabase, table: "products", field: "group_id", value: group_id }) + 1;

    const { data, error } = await supabase
      .from('products')
      .insert([{ group_id, name, link, platform, image_url, price, currency, rank: maxRank }])
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

  console.log(updated_data);

  try {
    const supabase = createClient();

    if (updated_data.image_url) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', updated_data.id)
        .single();

      if (updated_data.image_url !== product.image_url && product.image_url.length > 0)
        await deleteFileFromSupabase({ supabase, bucketName: 'product-images', fileUrl: product.image_url });
    }

    const { data, error } = await supabase
      .from('products')
      .update(updated_data)
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

    const { data: product, error: getError } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single()

    if (product?.image_url)
      await deleteFileFromSupabase({ supabase, bucketName: 'product-images', fileUrl: product.image_url });

    const { data, error } = await supabase
      .from('products')
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
