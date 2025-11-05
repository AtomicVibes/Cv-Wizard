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

const GolfBallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-800/80">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM8.625 7.5a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375V7.875a.375.375 0 0 0-.375-.375h-.375Zm3.375 0a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375V7.875a.375.375 0 0 0-.375-.375h-.375Zm3.375 0a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375V7.875a.375.375 0 0 0-.375-.375h-.375Zm-5.625 2.625a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375v-.375a.375.375 0 0 0-.375-.375h-.375Zm3.375 0a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375v-.375a.375.375 0 0 0-.375-.375h-.375Zm3.375 0a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375v-.375a.375.375 0 0 0-.375-.375h-.375Zm-5.625 2.625a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375v-.375a.375.375 0 0 0-.375-.375h-.375Zm3.375 0a.375.375 0 0 0-.375.375v.375c0 .207.168.375.375.375h.375a.375.375 0 0 0 .375-.375v-.375a.375.375 0 0 0-.375-.375h-.375Z" clipRule="evenodd" />
    </svg>
);

const Section = ({ icon, title, children, className }: { icon: React.ReactNode, title: string, children: React.ReactNode, className?: string }) => (
  <section className={className}>
    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-3 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </section>
);


export const GolfTemplate2 = ({ data, t, fontFamily }: { data: ResumeData, t: (key: string) => string; fontFamily: string; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;

  return (
    <div style={{ fontFamily }} className="bg-white text-gray-800 p-8 w-full aspect-[210/297] text-[10pt] leading-normal shadow-2xl rounded-lg">

        <header className="text-center mb-6">
            {personalInfo.showPhoto && personalInfo.photo && (
                <div className="flex justify-center mb-4">
                    <Image
                        src={personalInfo.photo}
                        alt={personalInfo.name}
                        width={120}
                        height={120}
                        className="object-cover w-32 h-32 rounded-md border-4 border-blue-200/60 p-1"
                    />
                </div>
            )}
            <h1 className="text-4xl font-bold tracking-tight text-blue-900">{personalInfo.name}</h1>
            <h2 className="text-lg font-semibold text-gray-700 mt-1">{personalInfo.jobTitle}</h2>
            <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-3 text-gray-600 flex-wrap">
              {personalInfo.email && <p className="flex items-start gap-2"><Mail className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-800/80"/><span>{personalInfo.email}</span></p>}
              {personalInfo.phone && <p className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-800/80"/><span>{personalInfo.phone}</span></p>}
              {personalInfo.address && <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-800/80"/><span>{personalInfo.address}</span></p>}
            </div>
        </header>

        <main className="flex flex-col gap-6">
            {summary && (
              <section>
                <p className="text-sm text-gray-700 italic border-l-4 border-blue-200/80 pl-4 py-2 bg-blue-50/50 rounded-r-md">{summary}</p>
              </section>
            )}

            <Section icon={<Briefcase className="w-4 h-4" />} title={t('experience')}>
                <div className="space-y-5">
                    {experience.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-base">{exp.title}</h4>
                        <p className="text-[9pt] text-gray-500 font-medium">{exp.startDate && `${exp.startDate} -`} {exp.endDate}</p>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">{exp.company}{exp.city && `, ${exp.city}`}</p>
                        <ul className="mt-1.5 text-sm text-gray-600 list-disc ltr:pl-4 rtl:pr-4 space-y-1 marker:text-blue-800/70">
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
                    <p className="text-sm text-gray-600 font-semibold">{edu.institution}{edu.city && `, ${edu.city}`}</p>
                  </div>
                ))}
              </div>
            </Section>

             <Section icon={<Sparkles className="w-4 h-4"/>} title="Core Competencies">
                <ul className="text-sm space-y-1.5 columns-3">
                    {skills.map(skill => skill.name && (
                        <li key={skill.id} className="flex items-center gap-2"><GolfBallIcon/>{skill.name}</li>
                    ))}
                </ul>
            </Section>

            <Section icon={<Trophy className="w-4 h-4"/>} title="Certifications">
                 <ul className="text-sm space-y-3">
                    {languages.map(lang => (
                        <li key={lang.id}>
                           <div>
                            <p className='font-semibold'>{lang.name} - <span className='text-xs text-gray-500 font-normal'>{t(lang.proficiency.toLowerCase())}</span></p>
                            <Progress value={proficiencyToValue(lang.proficiency)} className="h-2 mt-1 bg-blue-100 [&>div]:bg-blue-800" />
                           </div>
                        </li>
                    ))}
                </ul>
            </Section>
      </main>
    </div>
  );
};
