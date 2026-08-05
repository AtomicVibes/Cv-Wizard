import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { ResumePageBreak } from '../ResumePageBreak';
import { LanguageProficiency } from './LanguageProficiency';

export const ExecutiveTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-black p-8 w-full aspect-[210/297] text-[10pt] leading-normal shadow-2xl rounded-lg">
      {/* Header — borderless, minimal */}
      <header className="mb-5">
        <div className="flex items-center gap-8 rtl:gap-8">
          {personalInfo.showPhoto && personalInfo.photo && (
            <div className="shrink-0">
              <Image
                src={personalInfo.photo}
                alt={personalInfo.name}
                width={96}
                height={96}
                className="object-cover w-24 h-24 rounded-full border border-gray-200"
              />
            </div>
          )}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold tracking-tight text-black">{personalInfo.name}</h1>
            <h2 className="text-lg font-medium text-gray-500 mt-1">{personalInfo.jobTitle}</h2>
          </div>
        </div>
        <div className="flex items-center gap-x-3 gap-y-0.5 text-xs text-gray-600 mt-3 flex-wrap">
          {personalInfo.address && <p>{personalInfo.address}</p>}
          {personalInfo.phone && <p className="flex items-center"><span className="text-gray-300 mx-2" aria-hidden="true">·</span>{personalInfo.phone}</p>}
          {personalInfo.email && <p className="flex items-center"><span className="text-gray-300 mx-2" aria-hidden="true">·</span>{personalInfo.email}</p>}
        </div>
      </header>

      <main className="space-y-4">
        {summary && (
          <section className="pb-4 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-2">{t('summary')}</h3>
            <p className="text-sm text-black">{summary}</p>
          </section>
        )}

        <section className="pb-4 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">{t('experience')}</h3>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
                  <h4 className="font-bold text-sm text-black">{exp.title}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 font-medium mt-0.5">{exp.company}{exp.city ? `, ${exp.city}` : ''}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc ltr:pl-4 rtl:pr-4 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-4 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">{t('education')}</h3>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
                  <h4 className="font-bold text-sm text-black">{edu.degree}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium whitespace-nowrap">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
              </div>
            ))}
          </div>
        </section>

        <ResumePageBreak />

        <section className="pb-4 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">{t('skills')}</h3>
          <ul className="columns-2 text-sm text-black list-disc ltr:pl-4 rtl:pr-4">
            {skills.map(skill => skill.name && (
              <li key={skill.id} className="mb-1 break-inside-avoid">{skill.name}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">{t('languages')}</h3>
          <ul className="text-sm text-black space-y-1">
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
