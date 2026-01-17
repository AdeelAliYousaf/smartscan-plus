import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = 'https://smartscanplus.vercel.app';

export const metadata: Metadata = {
  title: "SmartScan+: AI Screening tool for Skin Lesions & Anemia",
  description:
    "SmartScan+ is an AI-powered Mobile Application designed to assist in the early detection of skin lesions and anemia through advanced computer vision techniques.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/SmartScanPlusLogo.png',
    shortcut: '/SmartScanPlusLogo.png',
    apple: '/SmartScanPlusLogo.png',
  },
  openGraph: {
    title: 'SmartScan+',
    description:
      'AI screening for skin lesions and anemia — SmartScan+ AI Screening tool.',
    url: siteUrl,
    siteName: 'SmartScan+',
    images: [
      {
        url: `${siteUrl}/SmartScanPlusLogo.png`,
        width: 1200,
        height: 630,
        alt: 'SmartScan+ logo',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartScan+',
    description:
      'AI screening for skin lesions and anemia — SmartScan+ AI Screening tool.',
    images: [`${siteUrl}/SmartScanPlusLogo.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnects for Google Fonts to speed up font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Preload the stylesheet for Poppins (non-blocking) */}
            <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </noscript>
        {/* JSON-LD Organization schema for SEO (logo in /public/SmartScanPlusLogo.png) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SmartScan+",
          "url": siteUrl,
          "logo": `${siteUrl}/SmartScanPlusLogo.png`,
          "sameAs": [
            "https://www.linkedin.com/",
            "https://www.twitter.com/"
          ]
        }) }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
