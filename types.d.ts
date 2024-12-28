interface HeroData {
  hero_title: string;
  hero_subtitle_bold: string;
  hero_subtitle_regular: string;
}

interface HomePageData {
  hero_section: HeroData[];
}

type LocationType = {
  full_address: string;
  city: string;
  latitude: number;
  longitude: number;
}

type BlogType = {
  id: string;
  writer_id: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  image_url: string;
  created_at: datetime;
  rank: number;
}