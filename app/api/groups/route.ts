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
    const providedType = searchParams.get('type');
    const isAdmin = searchParams.get('isAdmin');

    // Get the logged-in user's data if no user ID is provided
    const userData = providedUserId ? null : await getUserInfo({ supabase });
    const userId = providedUserId || userData?.id;
    const enabledField = (providedUserId && !isAdmin) ? [true] : [true, false];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!providedType) {
      return NextResponse.json({ error: 'Group type is required' }, { status: 400 });
    }

    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .eq('user_id', userId)
      .eq('type', providedType)
      .in('enabled', enabledField)
      .order('rank', { ascending: true });

    if (groupsError) {
      return NextResponse.json({ error: groupsError.message }, { status: 400 });
    }

    const { data: dataList, error: blogsError } = await supabase
      .from(providedType)
      .select('*')
      .in('enabled', enabledField)
      .order('rank', { ascending: true });

    if (blogsError) {
      return NextResponse.json({ error: blogsError.message }, { status: 400 });
    }

    const groupedDatas = groups.map(group => ({
      ...group,
      datas: dataList.filter(data => data.group_id === group.id),
    }));

    return NextResponse.json(groupedDatas);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, type, targetUserId } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    if (!((userData.subscription_status === "PRO") || (userData.subscription_status === "PREMIUM PRO") || (new Date(userData.trial_end) > new Date())))
      return NextResponse.json({ error: "Please upgrade membership!" });

    if (targetUserId && userData.role !== "admin")
      return NextResponse.json({ error: "Not authorized" });
    const insert_user_id  = targetUserId || userData.id;

    const maxRank = await getMaxRank({ supabase, table: "blog-groups", field: "user_id", value: insert_user_id }) + 1;

    const { data, error } = await supabase
      .from('groups')
      .insert([{ name, user_id: insert_user_id, rank: maxRank, enabled: true, type }])
      .select(`*, ${type}(*)`)
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

    const { data: groupData, error: groupsError } = await supabase
      .from('groups')
      .update(updated_data)
      .eq('id', updated_data.id)
      .select('*')
      .single();

      if (groupsError) {
        return NextResponse.json({ error: groupsError.message }, { status: 400 });
      }
  
      const { data: dataList, error: blogsError } = await supabase
        .from(groupData.type)
        .select('*')
        .order('rank', { ascending: true });
  
      if (blogsError) {
        return NextResponse.json({ error: blogsError.message }, { status: 400 });
      }
  
      const groupedData = {
        ...groupData,
        datas: dataList.filter(data => data.group_id === groupData.id),
      };

    return NextResponse.json(groupedData);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('groups')
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
