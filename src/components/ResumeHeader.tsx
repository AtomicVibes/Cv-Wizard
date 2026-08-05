'use client';

import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { Download, Languages, LayoutTemplate, Type, Palette, Check, TextCursor, LogOut, Save, Menu, X } from 'lucide-react';
import type { LanguageOption, TemplateOption, FontOption } from '@/lib/types';
import type { FontDetails } from '@/lib/fonts';
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

function ThemeColorPicker({
  themeColor,
  onSelect,
  columns = 8,
}: {
  themeColor: string;
  onSelect: (color: string) => void;
  columns?: 6 | 8;
}) {
  return (
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
        <div className={cn('grid gap-2', columns === 8 ? 'grid-cols-8' : 'grid-cols-6')}>
          {colorOptions.map((color) => (
            <Button
              key={color.name}
              variant="outline"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center',
                themeColor === color.hsl && 'border-primary'
              )}
              onClick={() => onSelect(color.hsl)}
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
  );
}

function TopBarControls({
  layout,
  t,
  availableFonts,
  themeColor,
  setThemeColor,
  font,
  setFont,
  fontSize,
  setFontSize,
  template,
  setTemplate,
  language,
  setLanguage,
  isSaving,
  onSave,
  onLogout,
  onPrint,
}: {
  layout: 'inline' | 'panel';
  t: (key: string) => string;
  availableFonts: FontDetails[];
  themeColor: string;
  setThemeColor: (color: string) => void;
  font: FontOption;
  setFont: (font: FontOption) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  template: TemplateOption;
  setTemplate: (template: TemplateOption) => void;
  language: LanguageOption;
  setLanguage: (language: LanguageOption) => void;
  isSaving: boolean;
  onSave: () => void;
  onLogout: () => void;
  onPrint: () => void;
}) {
  if (layout === 'inline') {
    return (
      <>
        <ThemeColorPicker themeColor={themeColor} onSelect={setThemeColor} />
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
            <SelectGroup>
              <SelectLabel>ATS Modern</SelectLabel>
              <SelectItem value="executive">{t('executive')}</SelectItem>
              <SelectItem value="tech">{t('tech')}</SelectItem>
              <SelectItem value="compact">{t('compact')}</SelectItem>
              <SelectItem value="editorial">{t('editorial')}</SelectItem>
              <SelectItem value="corporate">{t('corporate')}</SelectItem>
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
        <Button onClick={onSave} variant="outline" disabled={isSaving}>
          <Save className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
          {isSaving ? 'Saving...' : 'Save Data'}
        </Button>
        <Button onClick={onLogout} variant="outline">
          <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
          Logout
        </Button>
        <Button onClick={onPrint}>
          <Download className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
          {t('downloadPdf')}
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Appearance
        </p>
        <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-muted-foreground" />
              Theme Color
            </span>
            <ThemeColorPicker themeColor={themeColor} onSelect={setThemeColor} columns={6} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t('font')}</Label>
            <Select
              value={font}
              onValueChange={(value: FontOption) => setFont(value)}
            >
              <SelectTrigger className="w-full gap-2">
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
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Size</Label>
            <Select
              value={fontSize.toString()}
              onValueChange={(value) => setFontSize(parseInt(value))}
            >
              <SelectTrigger className="w-full gap-2">
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
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Layout
        </p>
        <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3 backdrop-blur-sm">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t('template')}</Label>
            <Select
              value={template}
              onValueChange={(value: TemplateOption) => setTemplate(value)}
            >
              <SelectTrigger className="w-full gap-2">
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
                <SelectGroup>
                  <SelectLabel>ATS Modern</SelectLabel>
                  <SelectItem value="executive">{t('executive')}</SelectItem>
                  <SelectItem value="tech">{t('tech')}</SelectItem>
                  <SelectItem value="compact">{t('compact')}</SelectItem>
                  <SelectItem value="editorial">{t('editorial')}</SelectItem>
                  <SelectItem value="corporate">{t('corporate')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t('language')}</Label>
            <Select
              value={language}
              onValueChange={(value: LanguageOption) => setLanguage(value)}
            >
              <SelectTrigger className="w-full gap-2">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder={t('language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Actions
        </p>
        <div className="space-y-2">
          <Button onClick={onSave} variant="outline" disabled={isSaving} className="w-full">
            <Save className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            {isSaving ? 'Saving...' : 'Save Data'}
          </Button>
          <Button onClick={onLogout} variant="outline" className="w-full">
            <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            Logout
          </Button>
          <Button onClick={onPrint} className="w-full">
            <Download className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
            {t('downloadPdf')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ResumeHeader() {
  const { language, setLanguage, template, setTemplate, font, setFont, t, availableFonts, themeColor, setThemeColor, fontSize, setFontSize, resumeData, userId, activeDocumentId } = useResume();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!menuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const controls = {
    t,
    availableFonts,
    themeColor,
    setThemeColor,
    font,
    setFont,
    fontSize,
    setFontSize,
    template,
    setTemplate,
    language,
    setLanguage,
    isSaving,
    onSave: handleSave,
    onLogout: handleLogout,
    onPrint: handlePrint,
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm border-b resume-header">
        <h1 className="text-xl font-bold font-headline text-primary">
          <img src="/assets/icons/logo.png" alt={t('appName')} className="h-20 w-20" />
          <span className="sr-only">{t('appName')}</span>
        </h1>
        <div className="hidden min-[821px]:flex items-center gap-2">
          <TopBarControls layout="inline" {...controls} />
        </div>
        <div className="max-[820px]:flex hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="h-10 w-10 rounded-xl bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:bg-card"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          'menu-overlay fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <aside
        className={cn(
          'menu-panel fixed top-0 z-50 flex h-full w-[min(24rem,92vw)] flex-col gap-4 overflow-y-auto bg-card/80 backdrop-blur-xl shadow-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-in-out',
          'ltr:right-0 rtl:left-0 ltr:border-l rtl:border-r border-border',
          menuOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
        )}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Top bar controls"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Settings</p>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <TopBarControls layout="panel" {...controls} />
      </aside>
    </>
  );
}
