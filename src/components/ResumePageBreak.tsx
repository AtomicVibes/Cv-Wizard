'use client';

import { useResume } from '@/contexts/ResumeContext';

export function ResumePageBreak() {
  const { resumeData } = useResume();

  // Calculate if content exceeds one page (rough estimate)
  const hasExperience = resumeData.experience && resumeData.experience.length > 0;
  const hasEducation = resumeData.education && resumeData.education.length > 0;
  const hasSkills = resumeData.skills && resumeData.skills.length > 0;
  const hasLanguages = resumeData.languages && resumeData.languages.length > 0;
  const hasLongSummary = resumeData.summary && resumeData.summary.length > 300;

  // If there's substantial content, add a page break
  const needsPageBreak = (hasExperience && resumeData.experience.length > 2) ||
                         (hasEducation && resumeData.education.length > 1) ||
                         hasLongSummary;

  if (!needsPageBreak) {
    return null;
  }

  return <div className="page-break" />;
}