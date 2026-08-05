import type { ResumeData } from '@/lib/types';
import Image from 'next/image';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText } from 'lucide-react';
import { ResumePageBreak } from '../ResumePageBreak';
import { LanguageProficiency } from './LanguageProficiency';

export const ModernTemplate = ({ data, t, fontFamily, themeColor, fontSize }: { data: ResumeData, t: (key: string) => string; fontFamily: string; themeColor: string; fontSize: number; }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  return (
    <div style={{ fontFamily, fontSize: `${fontSize}%` }} className="bg-white text-black p-8 w-full aspect-[210/297] text-[10pt] leading-normal shadow-2xl rounded-lg">
      
      {/* Header */}
      <header className="flex items-center space-x-8 rtl:space-x-reverse mb-5">
        {personalInfo.showPhoto && personalInfo.photo && (
          <div className="shrink-0">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={100}
              height={100}
              className="object-cover w-24 h-24 rounded-md"
            />
          </div>
        )}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold" style={{ color: `hsl(${themeColor})` }}>{personalInfo.name}</h1>
          <h2 className="text-lg font-semibold text-gray-600 mt-1">{personalInfo.jobTitle}</h2>
          <div className="flex items-center gap-x-4 gap-y-1 text-xs mt-3 text-gray-600 flex-wrap">
            {personalInfo.address && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" style={{ color: `hsl(${themeColor} / 0.8)` }} />{personalInfo.address}</p>}
            {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: `hsl(${themeColor} / 0.8)` }} />{personalInfo.phone}</p>}
            {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: `hsl(${themeColor} / 0.8)` }} />{personalInfo.email}</p>}
          </div>
        </div>
      </header>
      
      <div className="space-y-4">
        {summary && (
          <section className="resume-section">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 pb-1.5 flex items-center gap-2" style={{ color: `hsl(${themeColor})`, borderColor: `hsl(${themeColor} / 0.1)` }}><FileText className="w-4 h-4"/>{t('summary')}</h3>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        <section className="resume-section">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 pb-1.5 flex items-center gap-2" style={{ color: `hsl(${themeColor})`, borderColor: `hsl(${themeColor} / 0.1)` }}><Briefcase className="w-4 h-4"/>{t('experience')}</h3>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id} className="experience-item">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-base">{exp.title}</h4>
                  <p className="text-[9pt] text-gray-500 font-medium">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 font-semibold">{exp.company}, {exp.city}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc ltr:pl-4 rtl:pr-4 space-y-1">
                  {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        <section className="resume-section">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 pb-1.5 flex items-center gap-2" style={{ color: `hsl(${themeColor})`, borderColor: `hsl(${themeColor} / 0.1)` }}><GraduationCap className="w-4 h-4"/>{t('education')}</h3>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="education-item">
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-base">{edu.degree}</h4>
                   <p className="text-[9pt] text-gray-500 font-medium">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-sm text-gray-600 font-semibold">{edu.institution}, {edu.city}</p>
              </div>
            ))}
          </div>
        </section>

        <ResumePageBreak />

        <section className="resume-section">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 pb-1.5 flex items-center gap-2" style={{ color: `hsl(${themeColor})`, borderColor: `hsl(${themeColor} / 0.1)` }}><Sparkles className="w-4 h-4"/>{t('skills')}</h3>
            <ul className="columns-3 text-sm list-disc ltr:pl-5 rtl:pr-5 resume-skill-group">
              {skills.map(skill => skill.name && (
                <li key={skill.id} className="mb-1">{skill.name}</li>
              ))}
            </ul>
        </section>

        <section className="resume-section">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 pb-1.5 flex items-center gap-2" style={{ color: `hsl(${themeColor})`, borderColor: `hsl(${themeColor} / 0.1)` }}><LanguagesIcon className="w-4 h-4"/>{t('languages')}</h3>
            <ul className="space-y-2 text-sm">
              {languages.map(lang => (
                <li key={lang.id}>
                  <p className="font-medium">{lang.name}</p>
                  <LanguageProficiency proficiency={lang.proficiency} themeColor={themeColor} className="mt-1" />
                </li>
              ))}
            </ul>
        </section>
      </div>
    </div>
  );
};
