import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { ResumePageBreak } from '../ResumePageBreak';
import { LanguageProficiency } from './LanguageProficiency';

export const CompactTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-black p-8 w-full aspect-[210/297] text-[9.5pt] leading-snug shadow-2xl rounded-lg">
      {/* Header — dense single row */}
      <header className="mb-4 pb-3 border-b-2 border-black">
        <div className="flex items-center justify-between gap-x-6">
          <div className="flex items-center gap-4 rtl:gap-4 min-w-0">
            {personalInfo.showPhoto && personalInfo.photo && (
              <div className="shrink-0">
                <Image
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  width={56}
                  height={56}
                  className="object-cover w-14 h-14 rounded-full border border-gray-300"
                />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-black leading-tight">{personalInfo.name}</h1>
              <h2 className="text-sm font-medium text-gray-600">{personalInfo.jobTitle}</h2>
            </div>
          </div>
          <ul className="text-right rtl:text-left text-[8.5pt] text-gray-600 space-y-0.5 shrink-0">
            {personalInfo.address && <li>{personalInfo.address}</li>}
            {personalInfo.phone && <li>{personalInfo.phone}</li>}
            {personalInfo.email && <li className="break-all">{personalInfo.email}</li>}
          </ul>
        </div>
      </header>

      <main className="space-y-3">
        {summary && (
          <section>
            <h3 className="text-[10pt] font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-1 mb-2">{t('summary')}</h3>
            <p className="text-[9.5pt] text-black">{summary}</p>
          </section>
        )}

        <section>
          <h3 className="text-[10pt] font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-1 mb-2">{t('experience')}</h3>
          <div className="divide-y divide-gray-200">
            {experience.map(exp => (
              <div key={exp.id} className="py-1.5 first:pt-0 last:pb-0">
                <div className="flex justify-between items-baseline gap-x-3">
                  <h4 className="font-bold text-[9.5pt] text-black">{exp.title} <span className="font-medium text-gray-600">— {exp.company}{exp.city ? `, ${exp.city}` : ''}</span></h4>
                  <p className="text-[8pt] text-gray-500 font-medium whitespace-nowrap">{exp.startDate} - {exp.endDate}</p>
                </div>
                <ul className="mt-0.5 text-[9pt] text-gray-600 list-disc ltr:pl-4 rtl:pr-4 space-y-0.5">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[10pt] font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-1 mb-2">{t('education')}</h3>
          <div className="divide-y divide-gray-200">
            {education.map(edu => (
              <div key={edu.id} className="py-1 first:pt-0 last:pb-0 flex justify-between items-baseline gap-x-3">
                <h4 className="font-bold text-[9.5pt] text-black">{edu.degree} <span className="font-medium text-gray-600">— {edu.institution}{edu.city ? `, ${edu.city}` : ''}</span></h4>
                <p className="text-[8pt] text-gray-500 font-medium whitespace-nowrap">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </section>

        <ResumePageBreak />

        <section>
          <h3 className="text-[10pt] font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-1 mb-2">{t('skills')}</h3>
          <ul className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[9pt] text-black">
            {skills.map((skill, index) => skill.name && (
              <li key={skill.id}>
                {skill.name}{index < skills.filter(s => s.name).length - 1 ? <span className="text-gray-400">,</span> : ''}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-[10pt] font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-1 mb-2">{t('languages')}</h3>
          <ul className="text-[9pt] text-black">
            {languages.map((lang, index) => (
              <li key={lang.id} className="inline">
                <span className="font-medium">{lang.name}</span>
                <LanguageProficiency proficiency={lang.proficiency} themeColor={themeColor} className="inline-flex align-middle ltr:ml-2 rtl:mr-2" />
                {index < languages.length - 1 ? <span className="text-gray-400 mx-1.5">|</span> : ''}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
