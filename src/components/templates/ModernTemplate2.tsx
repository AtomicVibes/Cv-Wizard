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

export const ModernTemplate2 = ({ data, t, fontFamily }: { data: ResumeData, t: (key: string) => string; fontFamily: string; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily }} className="bg-white text-gray-800 p-10 w-full aspect-[210/297] text-[10pt] leading-relaxed shadow-2xl rounded-lg">
      <header className="flex flex-col items-center text-center mb-8 pb-6 border-b-2 border-primary/20">
        {personalInfo.showPhoto && personalInfo.photo && (
            <Image
                src={personalInfo.photo}
                alt={personalInfo.name}
                width={100}
                height={100}
                className="object-cover w-28 h-28 rounded-md mb-4 border-4 border-primary/20 p-1"
            />
        )}
        <h1 className="text-5xl font-bold text-primary">{personalInfo.name}</h1>
        <h2 className="text-xl font-semibold text-gray-600 mt-2">{personalInfo.jobTitle}</h2>
         <div className="flex justify-center items-center gap-x-5 gap-y-1 text-xs mt-4 text-gray-600 flex-wrap">
          {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-primary"/>{personalInfo.email}</p>}
          {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-primary"/>{personalInfo.phone}</p>}
          {personalInfo.address && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary"/>{personalInfo.address}</p>}
        </div>
      </header>

      <main className="space-y-8">
            {summary && (
            <section>
                <h3 className="text-base font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/>{t('summary')}</h3>
                <p className="text-sm">{summary}</p>
            </section>
            )}
            
            <section>
                <h3 className="text-base font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4"/>{t('experience')}</h3>
                <div className="space-y-5">
                {experience.map(exp => (
                    <div key={exp.id} className="relative ltr:pl-6 rtl:pr-6">
                        <div className="absolute top-1 ltr:left-0 rtl:right-0 h-full w-px bg-primary/20"></div>
                        <div className="absolute top-1 ltr:left-[-4.5px] rtl:right-[-4.5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></div>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-base">{exp.title}</h4>
                            <p className="text-[9pt] text-gray-500 font-medium">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">{exp.company}, {exp.city}</p>
                        <ul className="mt-2 text-sm text-gray-600 list-disc ltr:pl-5 rtl:pr-5 space-y-1">
                            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>
                ))}
                </div>
            </section>
            
            <section>
                <h3 className="text-base font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4"/>{t('education')}</h3>
                <div className="space-y-4">
                {education.map(edu => (
                    <div key={edu.id}>
                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                    <p className="text-xs text-gray-600 font-semibold">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.city}</p>
                     <p className="text-xs text-gray-500 font-medium mt-1">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
                </div>
            </section>

            <section>
              <h3 className="text-base font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4"/>{t('skills')}</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {skills.map(skill => skill.name && (
                  <span key={skill.id} className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full">{skill.name}</span>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-base font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><LanguagesIcon className="w-4 h-4"/>{t('languages')}</h3>
              <ul className="space-y-3 text-sm">
                {languages.map(lang => (
                  <li key={lang.id}>
                    <p className="mb-1">{lang.name}</p>
                    <Progress value={proficiencyToValue(lang.proficiency)} className="h-2" />
                  </li>
                ))}
              </ul>
            </section>
      </main>
    </div>
  );
};
