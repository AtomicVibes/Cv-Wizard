'use client';

import { useResume } from '@/contexts/ResumeContext';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { CanadianTemplate } from '@/components/templates/CanadianTemplate';
import { GolfTemplate } from './templates/GolfTemplate';
import { ModernTemplate2 } from './templates/ModernTemplate2';
import { ClassicTemplate2 } from './templates/ClassicTemplate2';
import { CanadianTemplate2 } from './templates/CanadianTemplate2';
import { GolfTemplate2 } from './templates/GolfTemplate2';
import { MiscTemplate } from './templates/MiscTemplate';
import { MiscTemplate2 } from './templates/MiscTemplate2';
import { useEffect, useState } from 'react';

export function ResumePreview() {
  const { resumeData, t, template, font, availableFonts, themeColor, fontSize } = useResume();
  const [fontFamily, setFontFamily] = useState<string>('');

  useEffect(() => {
    const selectedFont = availableFonts.find(f => f.value === font);
    if (selectedFont) {
      // Check if the font is already loaded
      const fontExists = document.head.querySelector(`link[href="${selectedFont.googleFontUrl}"]`);
      if (!fontExists) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = selectedFont.googleFontUrl;
        document.head.appendChild(link);
      }
      setFontFamily(selectedFont.css);
    }
  }, [font, availableFonts]);

  const renderTemplate = () => {
    const props = { data: resumeData, t, fontFamily, themeColor, fontSize };
    switch (template) {
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'canadian':
        return <CanadianTemplate {...props} />;
      case 'golf':
        return <GolfTemplate {...props} />;
      case 'modern-2':
        return <ModernTemplate2 {...props} />;
      case 'classic-2':
        return <ClassicTemplate2 {...props} />;
      case 'canadian-2':
        return <CanadianTemplate2 {...props} />;
      case 'golf-2':
        return <GolfTemplate2 {...props} />;
      case 'misc':
        return <MiscTemplate {...props} />;
      case 'misc-2':
        return <MiscTemplate2 {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="sticky top-[88px] resume-preview-wrapper flex items-start justify-center">
       <div className="p-4 bg-black/5 rounded-2xl">
          <div className="lg:scale-[0.8] xl:scale-[0.9] origin-top">
            {renderTemplate()}
          </div>
       </div>
    </div>
  );
}
