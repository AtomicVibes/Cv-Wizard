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
          className={`w-2 h-2 rounded-full ${i < dots ? 'bg-gray-600' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}

export const MiscTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-gray-900 p-8 w-full aspect-[210/297] text-[11pt] leading-relaxed shadow-2xl rounded-lg">
      <header className="text-center mb-6 pb-4 border-b border-gray-200">
        {personalInfo.showPhoto && personalInfo.photo && (
          <div className="flex justify-center mb-4">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={120}
              height={120}
              className="object-cover w-28 h-28 rounded-full border-4 border-gray-100"
            />
          </div>
        )}
        <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-1">{personalInfo.name}</h1>
        <h2 className="text-lg font-normal text-gray-600 mb-3">{personalInfo.jobTitle}</h2>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-500 flex-wrap">
          <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5"/>{personalInfo.email}</p>
          <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5"/>{personalInfo.phone}</p>
          <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{personalInfo.address}</p>
        </div>
      </header>

      <main className="space-y-6">
        {summary && (
          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-2 uppercase tracking-wider">{t('summary')}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        <section>
          <h3 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wider">{t('experience')}</h3>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">{exp.company}, {exp.city}</p>
                <ul className="text-sm text-gray-700 list-disc ltr:pl-4 rtl:pr-4 space-y-0.5">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wider">{t('education')}</h3>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}, {edu.city}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6">
          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wider">{t('skills')}</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {skills.map(skill => skill.name && (
                <li key={skill.id} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-3 uppercase tracking-wider">{t('languages')}</h3>
            <ul className="text-sm space-y-2">
              {languages.map(lang => (
                <li key={lang.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-900">{lang.name}</span>
                    <span className="text-gray-500 text-xs">{t(lang.proficiency.toLowerCase())}</span>
                  </div>
                  {renderLanguageProficiency(lang.proficiency)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};