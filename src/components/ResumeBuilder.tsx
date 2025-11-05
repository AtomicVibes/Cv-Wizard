'use client';

import { ResumeForm } from '@/components/ResumeForm';
import { ResumePreview } from '@/components/ResumePreview';
import { ResumeHeader } from '@/components/ResumeHeader';
import { useResume } from '@/contexts/ResumeContext';
import { useEffect } from 'react';

export function ResumeBuilder() {
  const { language } = useResume();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <div
      key={language}
      className="min-h-screen bg-muted/40 text-foreground"
    >
      <ResumeHeader />
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-3 gap-8 p-4 sm:p-6 md:p-8 max-w-screen-2xl mx-auto">
        <div className="lg:col-span-2 xl:col-span-1 resume-form-container">
          <ResumeForm />
        </div>
        <div className="md:col-span-1 lg:col-span-3 xl:col-span-2 resume-preview-wrapper">
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
