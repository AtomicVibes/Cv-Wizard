'use client';

import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlusCircle, Trash2, User, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText, Upload, Wand2, Loader2, RefreshCw, Check, X, Combine, ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { Education, Experience, Language, Skill } from '@/lib/types';
import Image from 'next/image';
import { enhanceText, improveSummary, enhanceExperienceDescription, combineExperienceSuggestions } from '@/ai/flows/text-enhancer';
import { toast } from '@/hooks/use-toast';

const AI_ERROR_MESSAGE =
  'AI suggestions are not available at this moment, try again later.';
// Matches the message returned by the server action ('fail' in text-enhancer)
// when the Gemini API is rate-limited after all retries. Must stay in sync.
const RATE_LIMIT_MESSAGE =
  'AI suggestions are temporarily busy due to high traffic. Please wait a moment and try again.';

interface SuggestionItem {
  id: string;
  text: string;
}

interface JobContext {
  jobTitle: string;
  company: string;
  city: string;
}

function AiAssistant({
  forField,
  context,
  jobContext,
  onSuggestionClick,
}: {
  forField: string;
  context: string;
  jobContext?: JobContext;
  onSuggestionClick: (suggestion: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionItems, setSuggestionItems] = useState<SuggestionItem[]>([]);
  const [combinedText, setCombinedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTailor, setShowTailor] = useState(false);
  const [focusContext, setFocusContext] = useState('');
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');

  const isMobile = useIsMobile(640);
  const isExperience = Boolean(jobContext);

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    // Full technical details for developers only (browser console) — never
    // shown to the user.
    console.error('Detailed AI Error:', {
      context,
      jobContext,
      fieldLength: forField.length,
      fieldPreview: forField.slice(0, 200),
      error,
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    setError(error instanceof Error && error.message === RATE_LIMIT_MESSAGE
      ? RATE_LIMIT_MESSAGE
      : AI_ERROR_MESSAGE);
    toast({
      title: 'AI suggestions unavailable',
      description:
        error instanceof Error && error.message === RATE_LIMIT_MESSAGE
          ? RATE_LIMIT_MESSAGE
          : AI_ERROR_MESSAGE,
      variant: 'destructive',
    });
  };

  const appendFreshSuggestions = (newTexts: string[]) => {
    setSuggestionItems(prev => {
      const existing = new Set(prev.map(item => item.text.trim().toLowerCase()));
      const fresh = newTexts
        .map(text => text.trim())
        .filter(text => text && !existing.has(text.toLowerCase()));
      return [...prev, ...fresh.map(text => ({ id: crypto.randomUUID(), text }))];
    });
    setCombinedText(null);
  };

  const replaceSuggestions = (newTexts: string[]) => {
    setSuggestionItems(
      newTexts
        .map(text => text.trim())
        .filter(Boolean)
        .map(text => ({ id: crypto.randomUUID(), text }))
    );
    setCombinedText(null);
  };

  const handleEnhance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isExperience && jobContext) {
        const result = await enhanceExperienceDescription({
          jobTitle: jobContext.jobTitle,
          company: jobContext.company,
          city: jobContext.city,
          text: forField,
          focusContext,
          jobDescription: jobDescriptionInput,
          excludedSuggestions: suggestionItems.map(item => item.text),
        });
        if (!result.success) {
          throw new Error(result.error);
        }
        if (!result.data.suggestions.length) {
          throw new Error('AI returned no suggestions');
        }
        appendFreshSuggestions(result.data.suggestions);
      } else if (context === 'resume summary') {
        const result = await improveSummary({
          text: forField,
          role: '',
          focusContext,
          jobDescription: jobDescriptionInput,
        });
        if (!result.success) {
          throw new Error(result.error);
        }
        if (!result.data.suggestions.length) {
          throw new Error('AI returned no suggestions');
        }
        replaceSuggestions(result.data.suggestions);
      } else {
        const result = await enhanceText({
          text: forField,
          context,
          focusContext,
          jobDescription: jobDescriptionInput,
        });
        if (!result.success) {
          throw new Error(result.error);
        }
        if (!result.data.suggestions.length) {
          throw new Error('AI returned no suggestions');
        }
        replaceSuggestions(result.data.suggestions);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setSuggestionItems(prev => prev.filter(item => item.id !== id));
    setCombinedText(null);
  };

  const handleCombine = async () => {
    if (!jobContext || suggestionItems.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await combineExperienceSuggestions({
        jobTitle: jobContext.jobTitle,
        company: jobContext.company,
        focusContext,
        jobDescription: jobDescriptionInput,
        suggestions: suggestionItems.map(item => item.text),
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      if (!result.data.text) {
        throw new Error('AI returned no combined text');
      }
      setCombinedText(result.data.text);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (text: string) => {
    onSuggestionClick(text);
    setIsOpen(false);
  };

  const triggerButton = (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className="h-11 w-11 shrink-0 md:h-8 md:w-8"
      onClick={() => {
        if (!isOpen) handleEnhance();
      }}
      aria-label="Open AI suggestions"
    >
      <Wand2 className="h-4 w-4 text-primary/80" />
    </Button>
  );

  const content = (
    <>
      <div className="space-y-1.5 pr-12 sm:pr-0">
        <DialogTitle className="text-base font-medium leading-none sm:text-lg">
          AI Suggestions
        </DialogTitle>
        <DialogDescription className="break-words">
          {isExperience
            ? `Role-specific tasks for ${jobContext?.jobTitle || 'this position'}.`
            : `Suggestions to improve your ${context}.`}
        </DialogDescription>
      </div>
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="h-11 w-full justify-between px-3 text-muted-foreground md:h-9 md:px-2"
          onClick={() => setShowTailor(prev => !prev)}
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Tailor suggestions
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${showTailor ? 'rotate-180' : ''}`}
          />
        </Button>
        {showTailor && (
          <div className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-2 sm:gap-4">
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Focus / Context (optional)</Label>
              <Textarea
                value={focusContext}
                onChange={e => setFocusContext(e.target.value)}
                placeholder="e.g. Emphasize leadership, highlight Python and cloud migration"
                rows={3}
                className="min-h-24 w-full px-3 py-2.5 text-sm sm:py-3 sm:text-base md:text-base"
              />
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Job description URL or text (optional)</Label>
              <Textarea
                value={jobDescriptionInput}
                onChange={e => setJobDescriptionInput(e.target.value)}
                placeholder="Paste the job posting text or a URL to it"
                rows={3}
                className="min-h-24 w-full px-3 py-2.5 text-sm sm:py-3 sm:text-base md:text-base"
              />
            </div>
          </div>
        )}
      </div>
      <div className="min-h-0 max-h-[60vh] overflow-y-auto overscroll-contain pr-1">
        <div className="grid gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating ideas...</span>
            </div>
          )}
          {error && <p className="break-words text-sm text-destructive">{error}</p>}
          {combinedText && (
            <div className="rounded-md bg-primary/10 p-3">
              <p className="whitespace-pre-line break-words text-sm leading-relaxed">{combinedText}</p>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="mt-2 h-11 w-full md:h-9"
                onClick={() => applySuggestion(combinedText)}
                disabled={isLoading}
              >
                <Check className="h-3.5 w-3.5" />
                Apply combined text
              </Button>
            </div>
          )}
          {suggestionItems.map(item => (
            <div key={item.id} className="rounded-md bg-muted/50 p-3">
              <div className="flex flex-wrap items-start gap-2">
                <p
                  className="min-w-0 flex-1 cursor-pointer break-words text-sm leading-relaxed hover:text-accent-foreground"
                  onClick={() => applySuggestion(item.text)}
                  title="Click to apply"
                >
                  {item.text}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-11 w-11 shrink-0 rounded-full text-muted-foreground hover:text-destructive md:h-8 md:w-8"
                  onClick={() => handleDelete(item.id)}
                  disabled={isLoading}
                  title="Delete suggestion"
                  aria-label="Delete suggestion"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="mt-2 h-11 w-full md:h-9"
                onClick={() => applySuggestion(item.text)}
                disabled={isLoading}
              >
                <Check className="h-3.5 w-3.5" />
                Apply
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {isExperience && suggestionItems.length > 0 && (
          <Button
            variant="default"
            size="sm"
            type="button"
            className="h-11 min-w-0 flex-1 basis-full whitespace-normal py-2.5 sm:h-auto sm:min-h-10 sm:basis-auto sm:py-2"
            onClick={handleCombine}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Combine className="h-3.5 w-3.5" />
            )}
            Combine
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="h-11 min-w-0 flex-1 basis-full whitespace-normal py-2.5 sm:h-auto sm:min-h-10 sm:basis-auto sm:py-2"
          onClick={handleEnhance}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {isExperience ? 'New Complementary Suggestion' : 'New Suggestion'}
        </Button>
      </div>
    </>
  );

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="flex max-h-[85dvh] flex-col overflow-hidden rounded-t-xl p-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="flex max-h-[85dvh] flex-col overflow-hidden rounded-xl p-4 pt-12 sm:max-w-lg sm:p-6 md:max-w-2xl">
        {content}
      </DialogContent>
    </Dialog>
  );
}


export function ResumeForm() {
  const { resumeData, dispatch, t } = useResume();

  const handleFieldChange = (section: 'personalInfo' | 'summary', field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', section, payload: { field, value } });
  };
  
  const handleItemChange = (section: 'experience' | 'education' | 'skills' | 'languages', id: string, field: string, value: any) => {
    dispatch({ type: 'UPDATE_ITEM', section, payload: { id, field, value } });
  };

  const handleAddItem = (section: 'experience' | 'education' | 'skills' | 'languages') => {
    dispatch({ type: 'ADD_ITEM', section });
  };
  
  const handleRemoveItem = (section: 'experience' | 'education' | 'skills' | 'languages', id: string) => {
    dispatch({ type: 'REMOVE_ITEM', section, payload: { id } });
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({ type: 'SET_PHOTO', payload: { photo: event.target?.result as string } });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-none rounded-lg bg-card overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline"><User className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-primary"/>{t('personalInfo')}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="name">{t('fullName')}</Label><Input id="name" value={resumeData.personalInfo.name} onChange={(e) => handleFieldChange('personalInfo', 'name', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="jobTitle">{t('jobTitle')}</Label><Input id="jobTitle" value={resumeData.personalInfo.jobTitle} onChange={(e) => handleFieldChange('personalInfo', 'jobTitle', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="email">{t('email')}</Label><Input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleFieldChange('personalInfo', 'email', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="phone">{t('phone')}</Label><Input id="phone" value={resumeData.personalInfo.phone} onChange={(e) => handleFieldChange('personalInfo', 'phone', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="address">{t('address')}</Label><Input id="address" value={resumeData.personalInfo.address} onChange={(e) => handleFieldChange('personalInfo', 'address', e.target.value)} /></div>
              <div className="flex items-center gap-4 ltr:flex-row rtl:flex-row-reverse">
                <div className="space-y-2 flex-1">
                  <Label>{t('uploadPhoto')}</Label>
                  <div className="relative">
                    <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full opacity-0 absolute inset-0 z-10 cursor-pointer"/>
                    <Button asChild variant="outline" className="w-full pointer-events-none">
                      <div>
                        <Upload className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                        <span>{resumeData.personalInfo.photo ? t('changePhoto') : t('uploadPhoto')}</span>
                      </div>
                    </Button>
                  </div>
                </div>
                 {resumeData.personalInfo.photo && <Image src={resumeData.personalInfo.photo} alt="Profile" width={64} height={64} className="rounded-full object-cover w-16 h-16"/>}
              </div>
              <div className="flex items-center gap-2 pt-2 ltr:flex-row rtl:flex-row-reverse">
                <Switch id="show-photo" checked={resumeData.personalInfo.showPhoto} onCheckedChange={(checked) => handleFieldChange('personalInfo', 'showPhoto', checked)} />
                <Label htmlFor="show-photo">{t('showPhoto')}</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-none rounded-lg bg-card overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline"><FileText className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-primary"/>{t('summary')}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="relative">
                <Textarea placeholder={t('summaryPlaceholder')} value={resumeData.summary} onChange={(e) => handleFieldChange('summary', 'summary', e.target.value)} rows={5} />
                <div className="absolute top-2 right-2 rtl:left-2 rtl:right-auto">
                    <AiAssistant forField={resumeData.summary} context="resume summary" onSuggestionClick={(suggestion) => handleFieldChange('summary', 'summary', suggestion)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-none rounded-lg bg-card overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline"><Briefcase className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-primary"/>{t('experience')}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              {resumeData.experience.map((exp: Experience, index: number) => (
                <Card key={exp.id} className="bg-muted/50 border-none">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{exp.title || `Experience #${index + 1}`}</p>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('experience', exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>{t('jobTitle')}</Label><Input value={exp.title} onChange={(e) => handleItemChange('experience', exp.id, 'title', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('company')}</Label><Input value={exp.company} onChange={(e) => handleItemChange('experience', exp.id, 'company', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('jobCity')}</Label><Input value={exp.city} onChange={(e) => handleItemChange('experience', exp.id, 'city', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('jobStartDate')}</Label><Input type="month" value={exp.startDate} onChange={(e) => handleItemChange('experience', exp.id, 'startDate', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('jobEndDate')}</Label><Input type="text" placeholder="Present" value={exp.endDate} onChange={(e) => handleItemChange('experience', exp.id, 'endDate', e.target.value)} /></div>
                    </div>
                     <div className="space-y-2 relative">
                        <Label>{t('jobDescription')}</Label>
                        <Textarea value={exp.description} onChange={(e) => handleItemChange('experience', exp.id, 'description', e.target.value)} />
                        <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto">
                            <AiAssistant
                              forField={exp.description}
                              context="job description"
                              jobContext={{ jobTitle: exp.title, company: exp.company, city: exp.city }}
                              onSuggestionClick={(suggestion) => handleItemChange('experience', exp.id, 'description', suggestion)}
                            />
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={() => handleAddItem('experience')} className="w-full"><PlusCircle className="h-4 w-4 ltr:mr-2 rtl:ml-2"/> {t('add')}</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-none rounded-lg bg-card overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline"><GraduationCap className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-primary"/>{t('education')}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              {resumeData.education.map((edu: Education, index: number) => (
                <Card key={edu.id} className="bg-muted/50 border-none">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{edu.institution || `Education #${index + 1}`}</p>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('education', edu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>{t('institution')}</Label><Input value={edu.institution} onChange={(e) => handleItemChange('education', edu.id, 'institution', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('degree')}</Label><Input value={edu.degree} onChange={(e) => handleItemChange('education', edu.id, 'degree', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('eduCity')}</Label><Input value={edu.city} onChange={(e) => handleItemChange('education', edu.id, 'city', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('eduStartDate')}</Label><Input type="text" placeholder="2018" value={edu.startDate} onChange={(e) => handleItemChange('education', edu.id, 'startDate', e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t('eduEndDate')}</Label><Input type="text" placeholder="2022" value={edu.endDate} onChange={(e) => handleItemChange('education', edu.id, 'endDate', e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={() => handleAddItem('education')} className="w-full"><PlusCircle className="h-4 w-4 ltr:mr-2 rtl:ml-2"/> {t('add')}</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="border-none rounded-lg bg-card overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline"><Sparkles className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-primary"/>{t('skills')}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {resumeData.skills.map((skill: Skill) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <Input value={skill.name || ''} placeholder={t('skillName')} onChange={(e) => handleItemChange('skills', skill.id, 'name', e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('skills', skill.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => handleAddItem('skills')} className="w-full"><PlusCircle className="h-4 w-4 ltr:mr-2 rtl:ml-2"/> {t('add')}</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6" className="border-b-0 border-none rounded-lg bg-card overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline"><LanguagesIcon className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-primary"/>{t('languages')}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
              {resumeData.languages.map((lang: Language) => (
                 <Card key={lang.id} className="bg-muted/50 border-none">
                    <CardContent className="p-4">
                        <div className="flex items-end gap-2">
                            <div className="flex-grow space-y-2"><Label>{t('languageName')}</Label><Input value={lang.name} onChange={(e) => handleItemChange('languages', lang.id, 'name', e.target.value)} /></div>
                            <div className="flex-grow space-y-2">
                                <Label>{t('proficiency')}</Label>
                                <Select value={lang.proficiency} onValueChange={(value) => handleItemChange('languages', lang.id, 'proficiency', value)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">{t('beginner')}</SelectItem>
                                        <SelectItem value="Intermediate">{t('intermediate')}</SelectItem>
                                        <SelectItem value="Advanced">{t('advanced')}</SelectItem>
                                        <SelectItem value="Native">{t('native')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('languages', lang.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    </CardContent>
                 </Card>
              ))}
              <Button variant="outline" onClick={() => handleAddItem('languages')} className="w-full"><PlusCircle className="h-4 w-4 ltr:mr-2 rtl:ml-2"/> {t('add')}</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
