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
  title: "CalendarȘcolar.ro – Calendar Școlar 2025-2026 și 2026-2027",
  description: "Calendar școlar complet pentru toate cele 42 de județe. Vacanțe, zile libere, structura anului școlar 2025-2026 și 2026-2027. Vacanța de primăvară 2026, vacanța de vară 2026, început an școlar 2026-2027. Sincronizare automată în Google Calendar, Apple Calendar sau Outlook.",
  keywords: [
    'calendar școlar',
    'calendar școlar 2025-2026',
    'calendar școlar 2026-2027',
    'vacanțe școlare',
    'vacanța de primăvară 2026',
    'vacanța de vară 2026',
    'când se termină școala 2026',
    'zile libere școală',
    'structura anului școlar',
    'calendar școlar România',
    'vacanța intersemestrială 2027',
  ],
  openGraph: {
    title: 'CalendarȘcolar.ro – Calendar Școlar 2025-2026 și 2026-2027',
    description: 'Vacanțe, zile libere și structura anului școlar 2025-2026 și 2026-2027 pentru toate cele 42 de județe. Sincronizare automată în calendarul tău.',
    type: 'website',
    locale: 'ro_RO',
    url: 'https://calendarscolar.ro',
    siteName: 'CalendarȘcolar.ro',
    images: [
      {
        url: 'https://calendarscolar.ro/api/og',
        width: 1200,
        height: 630,
        alt: 'Calendar Școlar 2025-2026 și 2026-2027 România',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalendarȘcolar.ro – Calendar Școlar 2025-2026 și 2026-2027',
    description: 'Vacanțe, zile libere și structura anului școlar 2025-2026 și 2026-2027 pentru toate cele 42 de județe.',
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
        {/* Preload hero image to reduce LCP resource load delay */}
        <link rel="preload" as="image" href="/hero.webp" type="image/webp" fetchPriority="high" />
        <Script id="matomo" strategy="afterInteractive">
          {`
            var _paq = window._paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="//overview.thisisfruit.com/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '8']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
        </Script>
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
