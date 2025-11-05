'use client';

import { useResume } from '@/contexts/ResumeContext';
import { useEffect } from 'react';

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const { themeColor } = useResume();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--primary-hsl', themeColor);
    }
  }, [themeColor]);

  return <>{children}</>;
}
