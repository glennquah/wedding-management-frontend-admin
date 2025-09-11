import '../../../../shared/components/globals.css';
import { AuthRedirect } from './components/AuthRedirect';
import Providers from './components/Providers';
import './globals.css';
import { Toaster } from '@shared/components/ui/sonner';
import type { Metadata } from 'next';
import { Montserrat, Nunito } from 'next/font/google';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const nunito = Nunito({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Knotly - Wedding Management Made Simple',
  description:
    'Knotly is a wedding management platform that simplifies the planning process, making it easy to organize your dream wedding.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${nunito.variable} antialiased`}>
        <Providers>
          <Toaster />
          <AuthRedirect />
          {children}
        </Providers>
      </body>
    </html>
  );
}
