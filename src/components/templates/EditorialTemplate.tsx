import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { ResumePageBreak } from '../ResumePageBreak';
import { LanguageProficiency } from './LanguageProficiency';

const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";

export const EditorialTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-gray-800 p-12 w-full aspect-[210/297] text-[10.5pt] leading-relaxed shadow-2xl rounded-lg">
      {/* Header — editorial serif masthead */}
      <header className="mb-8 pb-6 border-b-2 border-gray-900">
        {personalInfo.showPhoto && personalInfo.photo && (
          <div className="mb-5">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={80}
              height={80}
              className="object-cover w-20 h-20 rounded-sm border border-gray-200"
            />
          </div>
        )}
        <h1 className="text-[26pt] font-semibold tracking-tight leading-tight" style={{ fontFamily: serif }}>{personalInfo.name}</h1>
        <h2 className="text-sm mt-1.5 italic" style={{ fontFamily: serif }}>{personalInfo.jobTitle}</h2>
        <div className="flex items-center gap-x-3 gap-y-0.5 text-xs text-gray-600 mt-4 flex-wrap">
          {personalInfo.address && <p>{personalInfo.address}</p>}
          {personalInfo.phone && <p className="flex items-center"><span className="text-gray-300 mx-2" aria-hidden="true">—</span>{personalInfo.phone}</p>}
          {personalInfo.email && <p className="flex items-center"><span className="text-gray-300 mx-2" aria-hidden="true">—</span>{personalInfo.email}</p>}
        </div>
      </header>

      <main className="space-y-7">
        {summary && (
          <section>
            <h3 className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold mb-3" style={{ fontFamily: serif }}>
              {t('summary')}
              <span className="flex-1 border-t border-gray-300" aria-hidden="true" />
            </h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>
        )}

        <section>
          <h3 className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold mb-4" style={{ fontFamily: serif }}>
            {t('experience')}
            <span className="flex-1 border-t border-gray-300" aria-hidden="true" />
          </h3>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-x-4">
                  <h4 className="text-base font-semibold" style={{ fontFamily: serif }}>{exp.title}</h4>
                  <p className="text-[9pt] text-gray-500 uppercase tracking-wider whitespace-nowrap">{exp.startDate} — {exp.endDate}</p>
                </div>
                <p className="text-sm italic text-gray-600 mt-0.5">{exp.company}{exp.city ? `, ${exp.city}` : ''}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc ltr:pl-4 rtl:pr-4 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold mb-4" style={{ fontFamily: serif }}>
            {t('education')}
            <span className="flex-1 border-t border-gray-300" aria-hidden="true" />
          </h3>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-x-4">
                  <h4 className="text-sm font-semibold" style={{ fontFamily: serif }}>{edu.degree}</h4>
                  <p className="text-[9pt] text-gray-500 uppercase tracking-wider whitespace-nowrap">{edu.startDate} — {edu.endDate}</p>
                </div>
                <p className="text-sm italic text-gray-600 mt-0.5">{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
              </div>
            ))}
          </div>
        </section>

        <ResumePageBreak />

        <section>
          <h3 className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold mb-3" style={{ fontFamily: serif }}>
            {t('skills')}
            <span className="flex-1 border-t border-gray-300" aria-hidden="true" />
          </h3>
          <ul className="columns-2 text-sm text-gray-700 space-y-1">
            {skills.map(skill => skill.name && (
              <li key={skill.id} className="break-inside-avoid">
                <span className="text-gray-400 ltr:mr-1.5 rtl:ml-1.5" aria-hidden="true">—</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold mb-3" style={{ fontFamily: serif }}>
            {t('languages')}
            <span className="flex-1 border-t border-gray-300" aria-hidden="true" />
          </h3>
          <ul className="text-sm text-gray-700 space-y-1.5">
            {languages.map(lang => (
              <li key={lang.id}>
                <span className="font-medium" style={{ fontFamily: serif }}>{lang.name}</span>
                <LanguageProficiency proficiency={lang.proficiency} themeColor={themeColor} className="mt-1" />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
