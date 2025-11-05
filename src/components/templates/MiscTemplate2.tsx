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
          className={`w-2 h-2 rounded-full ${i < dots ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}

export const MiscTemplate2 = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900 p-8 w-full aspect-[210/297] text-[10.5pt] leading-relaxed shadow-2xl rounded-lg">
      <header className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg -z-10 opacity-10"></div>
        <div className="flex items-center space-x-6 rtl:space-x-reverse p-4">
          {personalInfo.showPhoto && personalInfo.photo && (
            <div className="shrink-0">
              <Image
                src={personalInfo.photo}
                alt={personalInfo.name}
                width={100}
                height={100}
                className="object-cover w-24 h-24 rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{personalInfo.name}</h1>
            <h2 className="text-lg font-medium text-gray-700 mt-1">{personalInfo.jobTitle}</h2>
            <div className="flex items-center gap-x-4 gap-y-1 text-sm mt-3 text-gray-600 flex-wrap">
              {personalInfo.address && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-500"/>{personalInfo.address}</p>}
              {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-500"/>{personalInfo.phone}</p>}
              {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-500"/>{personalInfo.email}</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {summary && (
          <section className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-base font-bold text-blue-700 mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/>{t('summary')}</h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>
        )}

        <section className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-base font-bold text-blue-700 mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4"/>{t('experience')}</h3>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id} className="border-l-4 border-blue-200 pl-4 bg-white/40 rounded-r-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{exp.title}</h4>
                  <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2 font-medium">{exp.company}, {exp.city}</p>
                <ul className="text-sm text-gray-700 list-disc ltr:pl-4 rtl:pr-4 space-y-0.5">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-base font-bold text-blue-700 mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4"/>{t('education')}</h3>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="border-l-4 border-purple-200 pl-4 bg-white/40 rounded-r-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{edu.degree}</h4>
                  <p className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 font-medium">{edu.institution}, {edu.city}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4"/>{t('skills')}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => skill.name && (
                <span key={skill.id} className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2"><LanguagesIcon className="w-4 h-4"/>{t('languages')}</h3>
            <ul className="text-sm space-y-3">
              {languages.map(lang => (
                <li key={lang.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{lang.name}</span>
                    <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded">{t(lang.proficiency.toLowerCase())}</span>
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