import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  )
}


import './globals.css'
const defaultUrl = `https://prompt.dedevs.club`
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "DeDevs Prompter",
  description:
    "Enhance your prompting with AI",
  keywords:
    "DeDevs, Prompter, Code, AI",
  structuredData: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "DeDevs Prompter",
    url: defaultUrl,
    description:
      "Enhance your prompting with AI",
  },
  socialMediaTags: {
    "og:title": "DeDevs Prompter",
    "og:description":
      "Enhance your prompting with AI",
    "twitter:card": "summary_large_image",
  },
  openGraph: {
    type: "website",
    title: "DeDevs Prompter",
    description: "Enhance your prompting with AI",
    url: defaultUrl,
    siteName: "DeDevs Prompter",
    images: [
      {
        url: `${defaultUrl}/images/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "DeDevs Prompter Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DeDevs Prompter",
    description: "Enhance your prompting with AI",
    images: [`${defaultUrl}/images/opengraph-image.png`],
    creator: "@DeDevsClub"
  }
}