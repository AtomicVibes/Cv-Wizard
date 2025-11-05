export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  photo?: string | null;
  showPhoto: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  city: string;
}

export interface Experience {
  id:string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface ResumeData {
  $id?: string;
  documentId?: string;
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
}

export type LanguageOption = 'en' | 'fr' | 'ar';

export type TemplateOption = 'modern' | 'classic' | 'canadian' | 'golf' | 'modern-2' | 'classic-2' | 'canadian-2' | 'golf-2' | 'misc' | 'misc-2';

export type FontOption =
  | 'lato'
  | 'montserrat'
  | 'roboto'
  | 'open-sans'
  | 'source-sans-pro'
  | 'playfair-display'
  | 'merriweather'
  | 'lora'
  | 'pt-serif'
  | 'cormorant-garamond'
  | 'tajawal'
  | 'cairo'
  | 'almarai'
  | 'scheherazade-new'
  | 'ibm-plex-sans-arabic';


export type Section = 'personalInfo' | 'summary' | 'experience' | 'education' | 'skills' | 'languages';
