import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app';
const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || 'Your Name';
const siteCity = process.env.NEXT_PUBLIC_SITE_CITY || 'Your City';

const siteTitle = `${ownerName}'s Book Shelf — Borrow Books in ${siteCity}`;
const siteDescription = `A personal, non-commercial book lending library in ${siteCity}. Browse, borrow, and return books with just a small deposit.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: `${ownerName}'s Book Shelf`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
