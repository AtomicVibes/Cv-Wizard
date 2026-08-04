import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Cv Wizard',
  description: 'Create professional resumes in multiple languages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning {...{"data-lt-installed": true}}>
      <head>
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/logo.png" />
        <link rel="apple-touch-icon" href="/assets/icons/logo.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
