'use client';

import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createAppwriteInstances, saveResumeData } from '@/lib/appwrite';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Download, Languages, LayoutTemplate, Type, Palette, Check, TextCursor, LogOut, Save } from 'lucide-react';
import type { LanguageOption, TemplateOption, FontOption } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';

const colorOptions = [
  { name: 'Blue', hsl: '217 91% 60%' },
  { name: 'Green', hsl: '142 76% 36%' },
  { name: 'Red', hsl: '0 72% 51%' },
  { name: 'Purple', hsl: '262 84% 59%' },
  { name: 'Orange', hsl: '25 95% 53%' },
  { name: 'Gray', hsl: '215 14% 34%' },
  { name: 'Teal', hsl: '180 84% 37%' },
  { name: 'Pink', hsl: '322 84% 60%' },
  { name: 'Indigo', hsl: '243 75% 59%' },
  { name: 'Cyan', hsl: '189 94% 43%' },
  { name: 'Lime', hsl: '84 81% 44%' },
  { name: 'Rose', hsl: '348 83% 47%' },
  { name: 'Amber', hsl: '45 93% 47%' },
  { name: 'Emerald', hsl: '160 84% 39%' },
  { name: 'Sky', hsl: '199 89% 48%' },
  { name: 'Violet', hsl: '271 81% 56%' },
  { name: 'Fuchsia', hsl: '289 84% 67%' },
  { name: 'Slate', hsl: '215 28% 17%' },
];

export function ResumeHeader() {
  const { language, setLanguage, template, setTemplate, font, setFont, t, availableFonts, themeColor, setThemeColor, fontSize, setFontSize, resumeData, userId, activeDocumentId } = useResume();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { account } = createAppwriteInstances();

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    if (!userId) {
      alert('Please log in to save your resume.');
      return;
    }

    setIsSaving(true);
    try {
      await saveResumeData(resumeData, userId, activeDocumentId, createAppwriteInstances().databases, account);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm border-b resume-header">
        <h1 className="text-xl font-bold font-headline text-primary">
          <img src="/assets/icons/logo.png" alt={t('appName')} className="h-20 w-20" />
          <span className="sr-only">{t('appName')}</span>
        </h1>
        <div className="flex items-center gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="w-auto px-2 gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: `hsl(${themeColor})` }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-8 gap-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color.name}
                    variant="outline"
                    size="icon"
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      themeColor === color.hsl && 'border-primary'
                    )}
                    onClick={() => setThemeColor(color.hsl)}
                  >
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: `hsl(${color.hsl})` }}
                    />
                    {themeColor === color.hsl && <Check className="w-4 h-4 text-white absolute" />}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Select
            value={font}
            onValueChange={(value: FontOption) => setFont(value)}
          >
            <SelectTrigger className="w-auto gap-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder={t('font')} />
            </SelectTrigger>
            <SelectContent>
                {availableFonts.map((fontOption) => (
                    <SelectItem key={fontOption.value} value={fontOption.value}>
                        {fontOption.label}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select
            value={fontSize.toString()}
            onValueChange={(value) => setFontSize(parseInt(value))}
          >
            <SelectTrigger className="w-auto gap-2">
              <TextCursor className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="80">80%</SelectItem>
              <SelectItem value="90">90%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="110">110%</SelectItem>
              <SelectItem value="120">120%</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={template}
            onValueChange={(value: TemplateOption) => setTemplate(value)}
          >
            <SelectTrigger className="w-auto gap-2">
              <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder={t('template')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Modern</SelectLabel>
                    <SelectItem value="modern">{t('modern')}</SelectItem>
                    <SelectItem value="modern-2">{t('modern-2')}</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Classic</SelectLabel>
                    <SelectItem value="classic">{t('classic')}</SelectItem>
                    <SelectItem value="classic-2">{t('classic-2')}</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Canadian</SelectLabel>
                    <SelectItem value="canadian">{t('canadian')}</SelectItem>
                    <SelectItem value="canadian-2">{t('canadian-2')}</SelectItem>
                </SelectGroup>
                 <SelectGroup>
                     <SelectLabel>Specialized</SelectLabel>
                     <SelectItem value="golf">{t('golf')}</SelectItem>
                     <SelectItem value="golf-2">{t('golf-2')}</SelectItem>
                 </SelectGroup>
                 <SelectGroup>
                     <SelectLabel>Misc</SelectLabel>
                     <SelectItem value="misc">{t('misc')}</SelectItem>
                     <SelectItem value="misc-2">{t('misc-2')}</SelectItem>
                 </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select
            value={language}
            onValueChange={(value: LanguageOption) => setLanguage(value)}
          >
            <SelectTrigger className="w-auto gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSave} variant="outline" disabled={isSaving}>
            <Save className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            {isSaving ? 'Saving...' : 'Save Data'}
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            Logout
          </Button>
          <Button onClick={handlePrint}>
            <Download className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            {t('downloadPdf')}
          </Button>
        </div>
      </header>
    </>
  );
}
