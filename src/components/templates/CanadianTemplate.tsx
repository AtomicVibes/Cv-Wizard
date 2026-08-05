import type { ResumeData } from '@/lib/types';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText } from 'lucide-react';
import { LanguageProficiency } from './LanguageProficiency';

export const CanadianTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;

  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-black p-8 w-full aspect-[210/297] text-[10pt] leading-normal shadow-2xl rounded-lg">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-black">{personalInfo.name}</h1>
        <h2 className="text-lg font-medium text-gray-600 mt-1">{personalInfo.jobTitle}</h2>
        <div className="flex justify-center items-center gap-x-5 gap-y-1 text-xs mt-3 text-gray-600 flex-wrap">
          {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{personalInfo.email}</p>}
          {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{personalInfo.phone}</p>}
          {personalInfo.address && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{personalInfo.address}</p>}
        </div>
      </header>

      <main className="space-y-4">
        {summary && (
          <section className="resume-section">
            <h3 className="text-base font-bold uppercase tracking-wider text-black border-b-2 border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('summary')}
            </h3>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        <section className="resume-section">
          <h3 className="text-base font-bold uppercase tracking-wider text-black border-b-2 border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {t('experience')}
          </h3>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id} className="experience-item">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-base">{exp.title}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium">{exp.startDate && `${exp.startDate} -`} {exp.endDate}</p>
                </div>
                <p className="text-sm text-black font-semibold">{exp.company}{exp.city && `, ${exp.city}`}</p>
                <ul className="mt-1.5 text-sm text-gray-600 list-disc ltr:pl-5 rtl:pr-5 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        <section className="resume-section">
          <h3 className="text-base font-bold uppercase tracking-wider text-black border-b-2 border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            {t('education')}
          </h3>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="education-item">
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-base">{edu.degree}</h4>
                   <p className="text-[9pt] text-gray-500 font-medium">{edu.startDate && `${edu.startDate} -`} {edu.endDate}</p>
                  </div>
                <p className="text-sm text-black font-semibold">{edu.institution}{edu.city && `, ${edu.city}`}</p>
              </div>
            ))}
          </div>
        </section>

        {skills.length > 0 && (
          <section className="resume-section">
            <h3 className="text-base font-bold uppercase tracking-wider text-black border-b-2 border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('skills')}
            </h3>
            <ul className="text-sm columns-3 gap-x-6 list-disc ltr:pl-5 rtl:pr-5 resume-skill-group">
              {skills.map(skill => skill.name && (
                <li key={skill.id} className="mb-1">{skill.name}</li>
              ))}
            </ul>
          </section>
        )}

        {languages.length > 0 && (
          <section className="resume-section">
            <h3 className="text-base font-bold uppercase tracking-wider text-black border-b-2 border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4" />
              {t('languages')}
            </h3>
            <ul className="text-sm space-y-2">
              {languages.map(lang => (
                <li key={lang.id}>
                <span className="font-medium text-black">{lang.name}</span>
                <LanguageProficiency proficiency={lang.proficiency} themeColor={themeColor} className="mt-1" />
              </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};
