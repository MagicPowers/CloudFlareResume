import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { RECRUITER_BOOT_SCRIPT, SiteStateProvider } from "@/lib/site-state";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CommandPalette } from "@/components/interactive/CommandPalette";
import { Terminal } from "@/components/interactive/Terminal";
import { EffectLayer } from "@/components/interactive/EffectLayer";
import { profile } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: `${profile.name} — Engineering Leader, Dublin`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Engineering manager and tech lead in Dublin. Ten years turning tangled platforms and the teams around them into things that ship. Currently leading two teams at Hertz.",
  keywords: [
    "David Power",
    "Engineering Manager",
    "Tech Lead",
    "Dublin",
    "Software Engineering",
    "AWS",
    "Kubernetes",
    "Java",
    "React",
    "Hertz",
    "Webio",
  ],
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    locale: "en_IE",
    url: profile.site,
    siteName: `${profile.name} — Engineering Leader`,
    title: `${profile.name} — Engineering Leader, Dublin`,
    description: profile.tagline,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Engineering Leader, Dublin`,
    description: profile.tagline,
  },
  alternates: { canonical: profile.site },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  url: profile.site,
  telephone: profile.phoneHref,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dublin",
    addressCountry: "IE",
  },
  worksFor: { "@type": "Organization", name: "Hertz" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Trinity College Dublin" },
    { "@type": "CollegeOrUniversity", name: "University of Glasgow" },
  ],
  knowsLanguage: ["English", "Irish", "Scottish Gaelic"],
  knowsAbout: [
    "Engineering Management",
    "Platform Architecture",
    "AWS",
    "Kubernetes",
    "Developer Experience",
    "Agile Delivery",
  ],
  sameAs: [profile.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IE"
      data-recruiter="off"
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: RECRUITER_BOOT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <SiteStateProvider>
          <SmoothScroll />
          {children}
          <CommandPalette />
          <Terminal />
          <EffectLayer />
        </SiteStateProvider>
      </body>
    </html>
  );
}
