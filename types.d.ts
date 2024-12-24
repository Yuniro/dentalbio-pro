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