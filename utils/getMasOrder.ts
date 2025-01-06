import { getUserInfo } from "./userInfo";

export async function getMaxRankFromGallery({ supabase }: { supabase: any }) {
  try {
    const userData = await getUserInfo({ supabase });

    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('user_id', userData?.id);

    if (error) {
      return 0;
    }

    const maxRank = data.reduce((max: number, item: any) => (item.rank > max ? item.rank : max), 0);
    return maxRank;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function getMaxRankFromBlog({ supabase }: { supabase: any }) {
  try {
    const userData = await getUserInfo({ supabase });

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('writer_id', userData.id);

    if (error) {
      return 0;
    }

    const maxRank = data.reduce((max: number, item: any) => (item.rank > max ? item.rank : max), 0);
    return maxRank;
  } catch (error) {
    return 0;
  }
}

export async function getMaxRankFromReview({ supabase }: { supabase: any }) {
  try {
    const userData = await getUserInfo({ supabase });

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userData?.id);

    if (error) {
      return 0;
    }

    const maxRank = data.reduce((max: number, item: any) => (item.rank > max ? item.rank : max), 0);
    return maxRank;
  } catch (error) {
    console.log(error);
    return 0;
  }
}