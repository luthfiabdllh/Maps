import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { isValidLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === 'id';
  return {
    title: isId ? 'Peta SinergiMP' : 'SinergiMP Maps',
    description: isId
      ? 'Peta kawasan interaktif SinergiMP'
      : 'Interactive area map for SinergiMP',
  };
}

import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Language layout — wraps all pages with providers.
 * Sets the html lang attribute for the correct locale.
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        {children}
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
