'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useReducer, useState, useEffect, useMemo } from 'react';
import type { ResumeData, LanguageOption, TemplateOption, Section, FontOption, Experience } from '@/lib/types';
import { translations } from '@/lib/translations';
import { fontOptions } from '@/lib/fonts';
import { createAppwriteInstances, saveResumeData, loadResumeData, transformAppwriteDataToUI } from '@/lib/appwrite';

// Define Rich Placeholder Data for initial load/preview UX
const PLACEHOLDER_EXPERIENCE_ITEM = {
  id: 'exp1',
  title: 'Senior Software Engineer',
  company: 'Tech Solutions Inc.',
  city: 'San Francisco, CA',
  startDate: '2021-01',
  endDate: 'Present',
  description: 'Led a team of 5 engineers in developing a new cloud-based SaaS platform.\n• Improved application performance by 30% through code optimization.\n• Mentored junior developers.',
};

const PLACEHOLDER_EDUCATION_ITEM = {
  id: 'edu1',
  institution: 'University of California, Berkeley',
  degree: 'M.S. in Computer Science',
  city: 'Berkeley, CA',
  startDate: '2019',
  endDate: '2021',
};

// --- INITIAL STATE ---
const DEFAULT_UI_DATA: ResumeData = {
  personalInfo: {
    name: 'Jane Doe',
    jobTitle: 'Full-Stack Developer',
    email: 'placeholder@example.com',
    phone: '123-456-7890',
    address: 'San Francisco, CA',
    photo: null,
    showPhoto: true,
  },
  summary: 'Innovative and deadline-driven Software Engineer with 5+ years of experience developing and deploying user-centered digital products from initial concept to final, polished deliverables.',
  experience: [PLACEHOLDER_EXPERIENCE_ITEM],
  education: [PLACEHOLDER_EDUCATION_ITEM],
  skills: [{ id: 's1', name: 'React' }, { id: 's2', name: 'Node.js' }, { id: 's3', name: 'Appwrite' }],
  languages: [{ id: 'l1', name: 'English', proficiency: 'Native' as const }],
};

const createExperienceItem = (previousExperience?: any) => {
  const experienceItem: any = {
    id: crypto.randomUUID(),
    title: '',
    company: '',
    city: '',
    description: '',
    endDate: 'Present',
    startDate: '',
  };

  if (previousExperience && typeof previousExperience.endDate === 'string' && previousExperience.endDate && previousExperience.endDate !== 'Present') {
    experienceItem.startDate = previousExperience.endDate;
  }

  return experienceItem;
};

// --- CHRONOLOGICAL DATE CASCADING (Experience) ---
// The list is ordered newest-first (index 0 = most recent).
// - The top entry's end date is always "Present".
// - Every entry below it has its end date chained to the start date of the
//   entry immediately above it, producing a seamless, gap-free timeline.
const cascadeExperienceDates = (items: Experience[]): Experience[] => {
  if (items.length === 0) return items;
  return items.map((item, index) => {
    if (index === 0) {
      return item.endDate === 'Present' ? item : { ...item, endDate: 'Present' };
    }
    const previous = items[index - 1];
    if (previous.startDate && previous.startDate !== item.endDate) {
      return { ...item, endDate: previous.startDate };
    }
    return item;
  });
};

// --- ACTION TYPES ---
type Action =
  | { type: 'UPDATE_FIELD'; section: 'personalInfo' | 'summary'; payload: { field: string; value: any } }
  | { type: 'UPDATE_ITEM'; section: 'experience' | 'education' | 'skills' | 'languages'; payload: { id: string; field: string; value: any } }
  | { type: 'ADD_ITEM'; section: 'experience' | 'education' | 'skills' | 'languages' }
  | { type: 'REMOVE_ITEM'; section: 'experience' | 'education' | 'skills' | 'languages'; payload: { id: string } }
  | { type: 'SET_PHOTO'; payload: { photo: string | null } }
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'SET_ACTIVE_RESUME'; payload: { resume: ResumeData; documentId: string } };



// --- REDUCER ---
const resumeReducer = (state: ResumeData, action: Action): ResumeData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      if (action.section === 'summary') {
        return { ...state, summary: action.payload.value };
      }
      return {
        ...state,
        personalInfo: { ...state.personalInfo, [action.payload.field]: action.payload.value },
      };
    case 'UPDATE_ITEM': {
      const updatedItems = state[action.section].map((item: any) =>
        item.id === action.payload.id ? { ...item, [action.payload.field]: action.payload.value } : item
      );
      return {
        ...state,
        [action.section]:
          action.section === 'experience'
            ? cascadeExperienceDates(updatedItems)
            : updatedItems,
      };
    }
    case 'ADD_ITEM': {
      let newItem: any = { id: crypto.randomUUID() };
      switch (action.section) {
        case 'experience':
          newItem = createExperienceItem(state.experience[0]);
          break;
        case 'education':
          newItem = { id: crypto.randomUUID(), institution: '', degree: '', city: '', startDate: '', endDate: '' };
          break;
        case 'skills':
          newItem = { id: crypto.randomUUID(), name: '' };
          break;
        case 'languages':
          newItem = { id: crypto.randomUUID(), name: '', proficiency: 'Intermediate' };
          break;
      }
      return {
        ...state,
        [action.section]:
          action.section === 'experience'
            ? cascadeExperienceDates([newItem, ...state.experience])
            : [...state[action.section], newItem],
      };
    }
case 'REMOVE_ITEM': {
      const remainingItems = state[action.section].filter((item: any) => item.id !== action.payload.id);
      return {
        ...state,
        [action.section]:
          action.section === 'experience'
            ? cascadeExperienceDates(remainingItems as Experience[])
            : remainingItems,
      };
    }
case 'SET_PHOTO':
        return {
            ...state,
            personalInfo: { ...state.personalInfo, photo: action.payload.photo }
        }
case 'SET_RESUME_DATA':
      return {
        ...action.payload,
        experience: cascadeExperienceDates(action.payload.experience ?? []),
      };
    case 'SET_ACTIVE_RESUME':
      return {
        ...action.payload.resume,
        experience: cascadeExperienceDates(action.payload.resume.experience ?? []),
      };
    default:
      return state;
  }
};


// --- CONTEXT ---
interface ResumeContextType {
  resumeData: ResumeData;
  activeDocumentId: string | null;
  dispatch: React.Dispatch<Action>;
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  template: TemplateOption;
  setTemplate: (template: TemplateOption) => void;
  font: FontOption;
  setFont: (font: FontOption) => void;
  availableFonts: typeof fontOptions;
  t: (key: string) => string;
  themeColor: string;
  setThemeColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  userId: string | null;
  setActiveResume: (resume: ResumeData, documentId: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// --- PROVIDER ---
export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, dispatch] = useReducer(resumeReducer, DEFAULT_UI_DATA);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageOption>('en');
  const [template, setTemplate] = useState<TemplateOption>('modern');
  const [font, setFont] = useState<FontOption>('playfair-display');
  const [themeColor, setThemeColor] = useState('217 91% 60%'); // Default blue
  const [fontSize, setFontSize] = useState(100); // Default 100%
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Create Appwrite instances in useMemo to ensure they are stable
  const appwriteInstances = useMemo(() => createAppwriteInstances(), []);

  // Set client-side flag and load user data
  useEffect(() => {
    setIsClient(true);

    const loadUserData = async () => {
      if (!isClient) return;

      try {
        const user = await appwriteInstances.account.get();
        setUserId(user.$id);

        // Load the single user resume
        const resume = await loadResumeData(user.$id);

        if (resume) {
          // Set the resume as active
          dispatch({ type: 'SET_RESUME_DATA', payload: resume });
          setActiveDocumentId(resume.documentId || null);
          console.log('Successfully loaded user resume.');
        } else {
          console.log('No existing resume found. Starting with fresh state.');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      loadUserData();
    }
  }, [isClient]);

  // Auto-save functionality - only on client side
  useEffect(() => {
    if (userId && !isLoading && isClient) {
      const timeoutId = setTimeout(async () => {
        try {
          const savedDocId = await saveResumeData(resumeData, userId, activeDocumentId, appwriteInstances.databases, appwriteInstances.account);
          if (savedDocId && !activeDocumentId) {
            setActiveDocumentId(savedDocId);
          }
          console.log('Resume data saved automatically');
        } catch (error) {
          console.error('Error auto-saving resume data:', error);
        }
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [resumeData, userId, isLoading, isClient, appwriteInstances, activeDocumentId]);

  const setActiveResume = (resume: ResumeData, documentId: string) => {
    dispatch({ type: 'SET_RESUME_DATA', payload: resume });
    setActiveDocumentId(documentId);
  };

  const t = (key: string) => translations[language][key] || key;

  const value = {
    resumeData,
    activeDocumentId,
    dispatch,
    language,
    setLanguage,
    template,
    setTemplate,
    font,
    setFont,
    availableFonts: fontOptions,
    t,
    themeColor,
    setThemeColor,
    fontSize,
    setFontSize,
    userId,
    setActiveResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};


// --- HOOK ---
export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
