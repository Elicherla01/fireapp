import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FIRE Works · Financial Independence & Early Retirement Simulator',
  description:
    'Interactive FIRE calculator, 30-year compounding trajectory simulator, safe withdrawal rate (SWR) stress-tester, and engineering cashflow architecture by Ravindra Elicherla.',
  keywords: [
    'FIRE calculator',
    'Financial Independence Retire Early',
    'FIRE India',
    'Safe Withdrawal Rate',
    '30x Rule',
    'Corpus Calculator',
    'SIP Calculator',
    'Coast FIRE',
    'Barista FIRE',
    'Ravindra Elicherla',
  ],
  authors: [{ name: 'Ravindra Elicherla' }],
  creator: 'Ravindra Elicherla',
  openGraph: {
    title: 'FIRE Works · Financial Independence Simulator',
    description: 'Calculate your exact FIRE number, runway, and compounding trajectory with engineering precision.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'FIRE Works',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIRE Works · Financial Independence Calculator',
    description: 'Calculate your exact FIRE number, runway, and compounding trajectory with engineering precision.',
  },
};

export const viewport: Viewport = {
  themeColor: '#06090f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-primary font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
