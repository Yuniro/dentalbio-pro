import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';
import { deleteFileFromSupabase } from '@/utils/removeFromBucket';
import { getMaxRank } from '@/utils/getMaxOrder';

// export async function GET(request: Request) {
//   try {
//     const supabase = createClient();

//     // Parse query parameters
//     const { searchParams } = new URL(request.url);
//     const providedUserId = searchParams.get('userId');

//     // Get the logged-in user's data if no user ID is provided
//     const userData = providedUserId ? null : await getUserInfo({ supabase });
//     const userId = providedUserId || userData?.id;
//     const enabledField = providedUserId ? [true] : [true, false];

//     if (!userId) {
//       return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from('videos')
//       .select('*')
//       .eq('user_id', userId)
//       .in('enabled', enabledField)
//       .order('rank', { ascending: true });

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }

//     return NextResponse.json({ data });
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//   }
// }

export async function POST(request: Request) {
  const { group_id, title, link } = await request.json();

  try {
    const supabase = createClient();
    
    const maxRank = await getMaxRank({ supabase, table: "videos", field: "group_id", value: group_id }) + 1;

    const { data, error } = await supabase
      .from('videos')
      .insert([{ group_id, title, link, rank: maxRank }])
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

    const { data, error } = await supabase
      .from('videos')
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

    const { error } = await supabase
      .from('videos')
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
