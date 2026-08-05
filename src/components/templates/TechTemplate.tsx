import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { ResumePageBreak } from '../ResumePageBreak';
import { LanguageProficiency } from './LanguageProficiency';

export const TechTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-gray-800 p-10 w-full aspect-[210/297] text-[10pt] leading-normal shadow-2xl rounded-lg">
      {/* Header — clean single column */}
      <header className="mb-8">
        {personalInfo.showPhoto && personalInfo.photo && (
          <div className="mb-4">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={72}
              height={72}
              className="object-cover w-16 h-16 rounded-md border border-gray-200"
            />
          </div>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{personalInfo.name}</h1>
        <h2 className="text-lg font-medium text-gray-600 mt-1" style={{ color: `hsl(${themeColor})` }}>{personalInfo.jobTitle}</h2>
        <div className="flex items-center gap-x-3 gap-y-0.5 text-xs text-gray-600 mt-3 flex-wrap">
          {personalInfo.address && <p>{personalInfo.address}</p>}
          {personalInfo.phone && <p className="flex items-center"><span className="text-gray-300 mx-2" aria-hidden="true">|</span>{personalInfo.phone}</p>}
          {personalInfo.email && <p className="flex items-center"><span className="text-gray-300 mx-2" aria-hidden="true">|</span>{personalInfo.email}</p>}
        </div>
      </header>

      <main className="space-y-7">
        {summary && (
          <section>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-2" style={{ color: `hsl(${themeColor})` }}>{'//'} {t('summary')}</h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>
        )}

        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-4" style={{ color: `hsl(${themeColor})` }}>{'//'} {t('experience')}</h3>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-x-4">
                  <h4 className="font-bold text-sm text-gray-900">{exp.title}</h4>
                  <p className="font-mono text-[9pt] text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 font-medium mt-0.5">{exp.company}{exp.city ? `, ${exp.city}` : ''}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc ltr:pl-4 rtl:pr-4 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-4" style={{ color: `hsl(${themeColor})` }}>{'//'} {t('education')}</h3>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-x-4">
                  <h4 className="font-bold text-sm text-gray-900">{edu.degree}</h4>
                  <p className="font-mono text-[9pt] text-gray-500 whitespace-nowrap">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
              </div>
            ))}
          </div>
        </section>

        <ResumePageBreak />

        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `hsl(${themeColor})` }}>{'//'} {t('skills')}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {skills.map(skill => skill.name && (
              <li
                key={skill.id}
                className="text-[9pt] font-medium text-gray-800 bg-gray-100 border border-gray-200 rounded px-2 py-0.5 break-inside-avoid"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `hsl(${themeColor})` }}>{'//'} {t('languages')}</h3>
          <ul className="text-sm text-gray-700 space-y-1">
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
