import type { ResumeData } from '@/lib/types';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText, User } from 'lucide-react';
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
          className={`w-2 h-2 rounded-full ${i < dots ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
}

export const CanadianTemplate2 = ({ data, t, fontFamily, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;

  const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <section>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3 border-b-2 border-gray-100 pb-2">
        <span className="bg-gray-200 p-2 rounded-md">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );

  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-gray-800 p-10 w-full aspect-[210/297] text-[10pt] leading-relaxed shadow-2xl rounded-lg">
      <header className="text-left mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{personalInfo.name}</h1>
        <h2 className="text-xl font-medium text-gray-600 mt-1">{personalInfo.jobTitle}</h2>
      </header>
      
      <main className="space-y-6">
        <Section icon={<User className="w-4 h-4" />} title={t('personalInfo')}>
          <div className="space-y-2 text-sm text-gray-600">
              {personalInfo.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/>{personalInfo.email}</p>}
              {personalInfo.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/>{personalInfo.phone}</p>}
              {personalInfo.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/>{personalInfo.address}</p>}
          </div>
        </Section>

        {summary && (
          <Section icon={<FileText className="w-4 h-4" />} title={t('summary')}>
            <p className="text-sm">{summary}</p>
          </Section>
        )}

        <Section icon={<Briefcase className="w-4 h-4" />} title={t('experience')}>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-base">{exp.title}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium">{exp.startDate && `${exp.startDate} -`} {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-700 font-semibold">{exp.company}{exp.city && `, ${exp.city}`}</p>
                <ul className="mt-1.5 text-sm text-gray-600 list-disc ltr:pl-5 rtl:pr-5 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
        
        <Section icon={<GraduationCap className="w-4 h-4" />} title={t('education')}>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-base">{edu.degree}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium">{edu.startDate && `${edu.startDate} -`} {edu.endDate}</p>
                  </div>
                <p className="text-sm text-gray-700 font-semibold">{edu.institution}{edu.city && `, ${edu.city}`}</p>
              </div>
            ))}
          </div>
        </Section>

        {skills.length > 0 && (
          <Section icon={<Sparkles className="w-4 h-4" />} title={t('skills')}>
            <ul className="text-sm list-inside list-disc space-y-1 columns-3">
              {skills.map(skill => skill.name && (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </Section>
        )}
        
        {languages.length > 0 && (
          <Section icon={<LanguagesIcon className="w-4 h-4" />} title={t('languages')}>
            <ul className="text-sm space-y-3">
              {languages.map(lang => (
                <li key={lang.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span>{lang.name}</span>
                    <span className="font-medium text-gray-600 text-xs">{t(lang.proficiency.toLowerCase())}</span>
                  </div>
                  {renderLanguageProficiency(lang.proficiency)}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>
    </div>
  );
};
