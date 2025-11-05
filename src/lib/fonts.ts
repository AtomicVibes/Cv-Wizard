import type { FontOption } from './types';

interface FontDetails {
  value: FontOption;
  label: string;
  css: string;
  googleFontUrl: string;
}

export const fontOptions: FontDetails[] = [
  {
    value: 'lato',
    label: 'Lato',
    css: "'Lato', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  },
  {
    value: 'montserrat',
    label: 'Montserrat',
    css: "'Montserrat', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
  },
  {
    value: 'roboto',
    label: 'Roboto',
    css: "'Roboto', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  },
  {
    value: 'open-sans',
    label: 'Open Sans',
    css: "'Open Sans', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap',
  },
  {
    value: 'source-sans-pro',
    label: 'Source Sans Pro',
    css: "'Source Sans Pro', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap',
  },
  {
    value: 'playfair-display',
    label: 'Playfair Display',
    css: "'Playfair Display', serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
  },
  {
    value: 'merriweather',
    label: 'Merriweather',
    css: "'Merriweather', serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
  },
  {
    value: 'lora',
    label: 'Lora',
    css: "'Lora', serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap',
  },
  {
    value: 'pt-serif',
    label: 'PT Serif',
    css: "'PT Serif', serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
  },
  {
    value: 'cormorant-garamond',
    label: 'Cormorant Garamond',
    css: "'Cormorant Garamond', serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap',
  },
  {
    value: 'tajawal',
    label: 'Tajawal (Arabic)',
    css: "'Tajawal', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap',
  },
  {
    value: 'cairo',
    label: 'Cairo (Arabic)',
    css: "'Cairo', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
  },
  {
    value: 'almarai',
    label: 'Almarai (Arabic)',
    css: "'Almarai', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap',
  },
  {
    value: 'scheherazade-new',
    label: 'Scheherazade New (Arabic)',
    css: "'Scheherazade New', serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap',
  },
  {
    value: 'ibm-plex-sans-arabic',
    label: 'IBM Plex Sans Arabic',
    css: "'IBM Plex Sans Arabic', sans-serif",
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap',
  },
];
