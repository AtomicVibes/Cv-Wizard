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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PlusCircle, Trash2, User, Briefcase, GraduationCap, Sparkles, Languages as LanguagesIcon, FileText, Upload, Wand2, Loader2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { Education, Experience, Language, Skill } from '@/lib/types';
import Image from 'next/image';
import { enhanceText, type EnhanceTextOutput, improveSummary, type ImproveSummaryOutput } from '@/ai/flows/text-enhancer';


function AiAssistant({ forField, context, onSuggestionClick }: { forField: string, context: string, onSuggestionClick: (suggestion: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<EnhanceTextOutput | ImproveSummaryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      if (context === 'resume summary') {
        const result = await improveSummary({ text: forField, role: '' });
        setSuggestions(result);
      } else {
        const result = await enhanceText({ text: forField, context });
        setSuggestions(result);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (!isOpen) handleEnhance();
          }}
        >
          <Wand2 className="h-4 w-4 text-primary/80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Suggestions</h4>
            <p className="text-sm text-muted-foreground">
              Suggestions to improve your {context}.
            </p>
          </div>
          <div className="grid gap-2">
            {isLoading && <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /><span>Generating ideas...</span></div>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {suggestions?.suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted" onClick={() => onSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
                            <AiAssistant forField={exp.description} context="job description" onSuggestionClick={(suggestion) => handleItemChange('experience', exp.id, 'description', suggestion)} />
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
