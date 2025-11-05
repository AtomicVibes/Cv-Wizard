import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText } from 'lucide-react';
import { Progress } from '../ui/progress';

const proficiencyToValue = (proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native') => {
  switch (proficiency) {
    case 'Beginner': return 25;
    case 'Intermediate': return 50;
    case 'Advanced': return 75;
    case 'Native': return 100;
    default: return 0;
  }
}

const renderLanguageProficiency = (proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native') => {
  const dots = proficiency === 'Beginner' ? 1 :
               proficiency === 'Intermediate' ? 2 :
               proficiency === 'Advanced' ? 3 : 5; // Native

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < dots ? 'bg-gray-800' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}

export const ClassicTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-gray-900 p-10 w-full aspect-[210/297] text-[10.5pt] leading-relaxed shadow-2xl rounded-lg">
      <header className="text-center mb-8 pb-4" style={{ borderBottom: `4px solid hsl(${themeColor})` }}>
        {personalInfo.showPhoto && personalInfo.photo && (
          <div className="flex justify-center mb-4">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={128}
              height={128}
              className="object-cover w-32 h-32 rounded-md"
            />
          </div>
        )}
        <h1 className="text-5xl font-bold tracking-widest uppercase text-gray-900">{personalInfo.name}</h1>
        <h2 className="text-xl font-light tracking-wider text-gray-700 mt-2">{personalInfo.jobTitle}</h2>
        <div className="flex justify-center items-center gap-x-6 gap-y-1 text-xs mt-4 text-gray-600 flex-wrap">
          <p className="flex items-center gap-2"><Mail className="w-3 h-3"/>{personalInfo.email}</p>
          <p className="flex items-center gap-2"><Phone className="w-3 h-3"/>{personalInfo.phone}</p>
          <p className="flex items-center gap-2"><MapPin className="w-3 h-3"/>{personalInfo.address}</p>
        </div>
      </header>

      <main className="space-y-8">
        {summary && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/>{t('summary')}</h3>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        <section>
          <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4"/>{t('experience')}</h3>
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-base font-bold">{exp.title}</h4>
                  <p className="text-xs text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm italic text-gray-700">{exp.company}, {exp.city}</p>
                <ul className="mt-2 text-sm text-gray-700 list-disc ltr:pl-5 rtl:pr-5 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4"/>{t('education')}</h3>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="text-base font-bold">{edu.degree}</h4>
                   <p className="text-xs text-gray-600 font-medium">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-sm italic text-gray-700">{edu.institution}, {edu.city}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4"/>{t('skills')}</h3>
          <ul className="text-sm columns-3 gap-x-8">
            {skills.map(skill => skill.name && (
              <li key={skill.id} className="mb-1">{skill.name}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-3 flex items-center gap-2"><LanguagesIcon className="w-4 h-4"/>{t('languages')}</h3>
          <ul className="text-sm space-y-3">
            {languages.map(lang => (
              <li key={lang.id}>
                <div className="flex justify-between items-center mb-1">
                  <span>{lang.name}</span>
                  <span className="text-gray-600 text-xs">{t(lang.proficiency.toLowerCase())}</span>
                </div>
                {renderLanguageProficiency(lang.proficiency)}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
