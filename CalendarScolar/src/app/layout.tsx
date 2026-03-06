import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { MaintenanceCheck } from "@/components/layout/MaintenanceCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CalendarȘcolar.ro – Calendar Școlar 2026-2027",
  description: "Calendar școlar complet pentru toate cele 42 de județe. Vacanțe, zile libere, structura anului școlar 2026-2027. Sincronizează-l automat în Google Calendar, Apple Calendar sau Outlook.",
  keywords: [
    'calendar școlar',
    'calendar școlar 2026-2027',
    'vacanțe școlare',
    'zile libere școală',
    'structura anului școlar',
    'calendar școlar România',
  ],
  openGraph: {
    title: 'CalendarȘcolar.ro – Calendar Școlar 2026-2027',
    description: 'Vacanțe, zile libere și structura anului școlar 2026-2027 pentru toate cele 42 de județe. Sincronizare automată în calendarul tău.',
    type: 'website',
    locale: 'ro_RO',
    url: 'https://calendarscolar.ro',
    siteName: 'CalendarȘcolar.ro',
    images: [
      {
        url: 'https://calendarscolar.ro/api/og',
        width: 1200,
        height: 630,
        alt: 'Calendar Școlar 2026-2027 România',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalendarȘcolar.ro – Calendar Școlar 2026-2027',
    description: 'Vacanțe, zile libere și structura anului școlar 2026-2027 pentru toate cele 42 de județe.',
  },
  alternates: {
    canonical: 'https://calendarscolar.ro',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <Script
          src="https://scripts.simpleanalyticscdn.com/latest.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <MaintenanceCheck>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </MaintenanceCheck>
        </Providers>
      </body>
    </html>
  );
}
