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
  country: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
}

type BlogType = {
  id: string;
  writer_id?: string;
  title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  created_at?: datetime;
  rank?: number;
  enabled?: boolean;
  slug?: string;
}

type GalleryType = {
  id: string;
  user_id?: string;
  title?: string;
  before_image_url?: string;
  after_image_url?: string;
  before_image_label?: string;
  after_image_label?: string;
  rank?: number;
  created_at?: datetime;
  enabled?: boolean;
}