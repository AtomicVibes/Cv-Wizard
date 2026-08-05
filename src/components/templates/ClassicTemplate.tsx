import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText } from 'lucide-react';
import { LanguageProficiency } from './LanguageProficiency';

export const ClassicTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-black p-10 w-full aspect-[210/297] text-[10.5pt] leading-relaxed shadow-2xl rounded-lg">
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
        <h1 className="text-5xl font-bold tracking-widest uppercase text-black">{personalInfo.name}</h1>
        <h2 className="text-xl font-light tracking-wider text-black mt-2">{personalInfo.jobTitle}</h2>
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
                <p className="text-sm italic text-black">{exp.company}, {exp.city}</p>
                <ul className="mt-2 text-sm text-black list-disc ltr:pl-5 rtl:pr-5 space-y-1">
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
                <p className="text-sm italic text-black">{edu.institution}, {edu.city}</p>
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
                <span className="font-medium">{lang.name}</span>
                <LanguageProficiency proficiency={lang.proficiency} themeColor={themeColor} className="mt-1" />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
