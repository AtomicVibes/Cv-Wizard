import type { ResumeData } from '@/lib/types';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Trophy, UserCheck } from 'lucide-react';
import Image from 'next/image';
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

export const GolfTemplate = ({ data, t, fontFamily }: { data: ResumeData, t: (key: string) => string; fontFamily: string; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;

  return (
    <div style={{ fontFamily }} className="bg-white text-gray-800 p-10 w-full aspect-[210/297] text-[10pt] leading-relaxed shadow-2xl rounded-lg border-t-8 border-green-800">
        <header className="flex items-center gap-8 mb-8">
            {personalInfo.showPhoto && personalInfo.photo && (
                <div className="shrink-0">
                    <Image
                        src={personalInfo.photo}
                        alt={personalInfo.name}
                        width={100}
                        height={100}
                        className="object-cover w-28 h-28 rounded-md"
                    />
                </div>
            )}
            <div className="text-left flex-grow">
                <h1 className="text-4xl font-bold tracking-tight text-green-900">{personalInfo.name}</h1>
                <h2 className="text-lg font-medium text-gray-600 mt-1">{personalInfo.jobTitle}</h2>
                <div className="flex items-center gap-x-4 gap-y-1 text-xs mt-3 text-gray-600 flex-wrap">
                    {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-green-800"/>{personalInfo.email}</p>}
                    {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-green-800"/>{personalInfo.phone}</p>}
                    {personalInfo.address && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-green-800"/>{personalInfo.address}</p>}
                </div>
            </div>
        </header>

      <main className="space-y-6">
        {summary && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 border-b border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              {t('summary')}
            </h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </section>
        )}

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 border-b border-gray-200 pb-1.5 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {t('experience')}
          </h3>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-base">{exp.title}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium">{exp.startDate && `${exp.startDate} -`} {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 font-medium">{exp.company}{exp.city && `, ${exp.city}`}</p>
                <ul className="mt-1.5 text-sm text-gray-600 list-disc ltr:pl-5 rtl:pr-5 space-y-1 marker:text-green-700">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        {education.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 border-b border-gray-200 pb-1.5 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {t('education')}
            </h3>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold text-base">{edu.degree}</h4>
                      <p className="text-[9pt] text-gray-500 font-medium">{edu.startDate && `${edu.startDate} -`} {edu.endDate}</p>
                    </div>
                  <p className="text-sm text-gray-600 font-medium">{edu.institution}{edu.city && `, ${edu.city}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 border-b border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Core Competencies
            </h3>
            <ul className="text-sm columns-3 gap-x-6 list-disc ltr:pl-5 rtl:pr-5 marker:text-green-700">
              {skills.map(skill => skill.name && (
                <li key={skill.id} className="mb-1">{skill.name}</li>
              ))}
            </ul>
          </section>
        )}
        
        {languages.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 border-b border-gray-200 pb-1.5 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Certifications & Achievements
              </h3>
               <ul className="text-sm space-y-3">
                {languages.map(lang => (
                  <li key={lang.id}>
                    <p className='mb-1 font-semibold'>{lang.name} - <span className='font-medium text-gray-600 text-xs'>{t(lang.proficiency.toLowerCase())}</span></p>
                    <Progress value={proficiencyToValue(lang.proficiency)} className="h-1.5 bg-green-100 [&>div]:bg-green-700" />
                  </li>
                ))}
              </ul>
            </section>
          )}
      </main>
    </div>
  );
};
