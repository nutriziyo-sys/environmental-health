export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  image_url: string;
}

export interface ResearchArea {
  id: number;
  title: string;
  description: string;
  full_content: string;
  image_url: string;
  icon_name?: string;
  icon_color?: string;
  box_color?: string;
  box_shape?: string;
}

export interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  link: string;
  journal_image_url: string;
  impact_factor?: string;
}

export interface Professor {
  id: number;
  name: string;
  bio: string;
  photo_url: string;
  linkedin_url: string;
  email: string;
  logo_url?: string;
  hero_image_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_bg_color?: string;
  hero_gradient_start?: string;
  hero_gradient_end?: string;
  secondary_bg_color?: string;
  address?: string;
  phone?: string;
}

export interface Specialization {
  id: number;
  cluster: string;
  label: string;
}

export interface AcademicJourney {
  id: number;
  year: string;
  title: string;
  organization: string;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}
