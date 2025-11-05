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

export const ClassicTemplate2 = ({ data, t, fontFamily, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily }} className="bg-white text-gray-800 p-10 w-full aspect-[210/297] text-[10.5pt] leading-relaxed shadow-2xl rounded-lg">
      <header className="text-center mb-8">
        {personalInfo.showPhoto && personalInfo.photo && (
          <div className="flex justify-center mb-4">
              <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={120}
              height={120}
              className="object-cover w-32 h-32 rounded-md"
              />
          </div>
        )}
        <h1 className="text-5xl font-bold tracking-widest uppercase text-gray-900">{personalInfo.name}</h1>
        <h2 className="text-xl font-light tracking-wider text-gray-700 mt-2">{personalInfo.jobTitle}</h2>
      </header>

      <main className="space-y-8">
          <section>
              <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4">Contact</h3>
              <div className="flex justify-center items-center gap-x-6 gap-y-1 text-sm mt-4 text-gray-600 flex-wrap">
                <p className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0"/><span>{personalInfo.email}</span></p>
                <p className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0"/><span>{personalInfo.phone}</span></p>
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0"/><span>{personalInfo.address}</span></p>
              </div>
          </section>

          {summary && (
          <section>
              <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-3"><FileText className="w-4 h-4 inline-block ltr:mr-2 rtl:ml-2"/>{t('summary')}</h3>
              <p className="text-sm">{summary}</p>
          </section>
          )}

          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4"><Briefcase className="w-4 h-4 inline-block ltr:mr-2 rtl:ml-2"/>{t('experience')}</h3>
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
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4"><GraduationCap className="w-4 h-4 inline-block ltr:mr-2 rtl:ml-2"/>{t('education')}</h3>
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
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4"><Sparkles className="w-4 h-4 inline-block ltr:mr-2 rtl:ml-2"/>{t('skills')}</h3>
            <ul className="text-sm space-y-1.5 list-disc ltr:pl-5 rtl:pr-5 columns-3">
            {skills.map(skill => skill.name && (
                <li key={skill.id}>{skill.name}</li>
            ))}
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4"><LanguagesIcon className="w-4 h-4 inline-block ltr:mr-2 rtl:ml-2"/>{t('languages')}</h3>
            <ul className="text-sm space-y-3">
            {languages.map(lang => (
                <li key={lang.id}>
                    <div className="flex justify-between items-center mb-1">
                        <span>{lang.name}</span>
                        <span className="text-gray-600 text-xs">{t(lang.proficiency.toLowerCase())}</span>
                    </div>
                    <Progress value={proficiencyToValue(lang.proficiency)} className="h-1.5 bg-gray-200 [&>div]:bg-gray-800" />
                </li>
            ))}
            </ul>
          </section>
      </main>
    </div>
  );
};
