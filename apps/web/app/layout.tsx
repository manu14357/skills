import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZSkills — Open Skill Registry",
    template: "%s · ZSkills"
  },
  description: "The open registry for agent skills. Browse, submit, and evolve SKILL.md files for every coding agent.",
  alternates: {
    canonical: SITE_URL
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "ZSkills — Open Skill Registry",
    description: "The open registry for agent skills. Browse, submit, and evolve SKILL.md files for every coding agent.",
    siteName: "ZSkills"
  },
  twitter: {
    card: "summary",
    title: "ZSkills — Open Skill Registry",
    description: "The open registry for agent skills. Browse, submit, and evolve SKILL.md files for every coding agent."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('zskills-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}`
          }}
        />
      </head>
      <body>
        <SiteHeader />
        <main className="mx-auto w-full max-w-screen-xl px-5 py-10 md:px-10 lg:px-16">{children}</main>
      </body>
    </html>
  );
}
