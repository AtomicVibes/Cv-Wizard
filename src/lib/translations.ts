import type { LanguageOption } from './types';

export const translations: Record<LanguageOption, Record<string, string>> = {
  en: {
    // Header
    appName: 'Cv Wizard',
    language: 'Language',
    template: 'Template',
    font: 'Font',
    downloadPdf: 'Download PDF',
    // Templates
    modern: 'Modern - Style 1',
    classic: 'Classic - Style 1',
    canadian: 'Canadian - Style 1',
    golf: 'Golf - Style 1',
    'modern-2': 'Modern - Style 2',
    'classic-2': 'Classic - Style 2',
    'canadian-2': 'Canadian - Style 2',
    'golf-2': 'Golf - Style 2',
    misc: 'Divers - Style 1',
    'misc-2': 'Divers - Style 2',
    // Form Sections
    personalInfo: 'Personal Information',
    summary: 'Profile',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    // Form Fields - Personal Info
    fullName: 'Full Name',
    jobTitle: 'Job Title',
    email: 'Email',
    phone: 'Phone Number',
    address: 'Address',
    uploadPhoto: 'Upload Photo',
    changePhoto: 'Change Photo',
    showPhoto: 'Show Photo',
    // Form Fields - Summary
    summaryPlaceholder: 'Write a brief summary of your career and goals...',
    // Form Fields - Common
    add: 'Add',
    remove: 'Remove',
    // Form Fields - Experience
    company: 'Company',
    jobCity: 'City',
    jobStartDate: 'Start Date',
    jobEndDate: 'End Date',
    jobDescription: 'Description',
    // Form Fields - Education
    institution: 'Institution',
    degree: 'Degree',
    eduCity: 'City',
    eduStartDate: 'Start Date',
    eduEndDate: 'End Date',
    // Form Fields - Skills
    skillName: 'Skill (e.g., React)',
    // Form Fields - Languages
    languageName: 'Language (e.g., English)',
    proficiency: 'Proficiency',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    native: 'Native',
  },
  fr: {
    // Header
    appName: 'Cv Wizard',
    language: 'Langue',
    template: 'Modèle',
    font: 'Police',
    downloadPdf: 'Télécharger en PDF',
    // Templates
    modern: 'Moderne - Style 1',
    classic: 'Classique - Style 1',
    canadian: 'Canadien - Style 1',
    golf: 'Golf - Style 1',
    'modern-2': 'Moderne - Style 2',
    'classic-2': 'Classique - Style 2',
    'canadian-2': 'Canadien - Style 2',
    'golf-2': 'Golf - Style 2',
    misc: 'Divers - Style 1',
    'misc-2': 'Divers - Style 2',
    // Form Sections
    personalInfo: 'Informations Personnelles',
    summary: 'Profil',
    experience: 'Expérience',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    // Form Fields - Personal Info
    fullName: 'Nom Complet',
    jobTitle: 'Titre du Poste',
    email: 'E-mail',
    phone: 'Numéro de Téléphone',
    address: 'Adresse',
    uploadPhoto: 'Télécharger une Photo',
    changePhoto: 'Changer la Photo',
    showPhoto: 'Afficher la Photo',
    // Form Fields - Summary
    summaryPlaceholder: 'Rédigez un bref résumé de votre carrière et de vos objectifs...',
    // Form Fields - Common
    add: 'Ajouter',
    remove: 'Supprimer',
    // Form Fields - Experience
    company: 'Entreprise',
    jobCity: 'Ville',
    jobStartDate: 'Date de Début',
    jobEndDate: 'Date de Fin',
    jobDescription: 'Description',
    // Form Fields - Education
    institution: 'Établissement',
    degree: 'Diplôme',
    eduCity: 'Ville',
    eduStartDate: 'Date de Début',
    eduEndDate: 'Date de Fin',
    // Form Fields - Skills
    skillName: 'Compétence (ex: React)',
    // Form Fields - Languages
    languageName: 'Langue (ex: Français)',
    proficiency: 'Niveau',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    native: 'Natif',
  },
  ar: {
    // Header
    appName: 'Cv Wizard',
    language: 'اللغة',
    template: 'قالب',
    font: 'الخط',
    downloadPdf: 'تحميل PDF',
    // Templates
    modern: 'حديث - نمط 1',
    classic: 'كلاسيكي - نمط 1',
    canadian: 'كندي - نمط 1',
    golf: 'جولف - نمط 1',
    'modern-2': 'حديث - نمط 2',
    'classic-2': 'كلاسيكي - نمط 2',
    'canadian-2': 'كندي - نمط 2',
    'golf-2': 'جولف - نمط 2',
    misc: 'متنوع - نمط 1',
    'misc-2': 'متنوع - نمط 2',
    // Form Sections
    personalInfo: 'المعلومات الشخصية',
    summary: 'الملف الشخصي',
    experience: 'الخبرة العملية',
    education: 'التعليم',
    skills: 'المهارات',
    languages: 'اللغات',
    // Form Fields - Personal Info
    fullName: 'الاسم الكامل',
    jobTitle: 'المسمى الوظيفي',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    uploadPhoto: 'تحميل صورة',
    changePhoto: 'تغيير الصورة',
    showPhoto: 'إظهار الصورة',
    // Form Fields - Summary
    summaryPlaceholder: 'اكتب ملخصًا موجزًا لمسيرتك المهنية وأهدافك...',
    // Form Fields - Common
    add: 'إضافة',
    remove: 'إزالة',
    // Form Fields - Experience
    company: 'الشركة',
    jobCity: 'المدينة',
    jobStartDate: 'تاريخ البدء',
    jobEndDate: 'تاريخ الانتهاء',
    jobDescription: 'الوصف',
    // Form Fields - Education
    institution: 'المؤسسة التعليمية',
    degree: 'الشهادة',
    eduCity: 'المدينة',
    eduStartDate: 'تاريخ البدء',
    eduEndDate: 'تاريخ الانتهاء',
    // Form Fields - Skills
    skillName: 'المهارة (مثال: React)',
    // Form Fields - Languages
    languageName: 'اللغة (مثال: العربية)',
    proficiency: 'المستوى',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    native: 'لغة أم',
  },
};
