import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vercel Webhooks & SDK Educational App",
  description: "Learn how to build production-ready webhook handlers using the Vercel API, Vercel SDK, and TypeScript. Automated deployment protection and Git validation.",
  keywords: [
    "Vercel",
    "Webhooks",
    "Vercel SDK",
    "TypeScript",
    "Next.js",
    "API Integration",
    "Deployment Protection",
    "Git Validation",
    "DevOps",
    "Security",
    "Compliance",
  ],
  authors: [{ name: "Vercel Webhooks Team" }],
  creator: "Vercel Webhooks Educational App",
  publisher: "Vercel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webhooks-example.vercel.app",
    siteName: "Vercel Webhooks & SDK Educational App",
    title: "Vercel Webhooks & SDK Educational App",
    description: "Learn how to build production-ready webhook handlers using the Vercel API, Vercel SDK, and TypeScript. Automated deployment protection and Git validation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vercel Webhooks & SDK Educational App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel Webhooks & SDK Educational App",
    description: "Learn how to build production-ready webhook handlers using the Vercel API, Vercel SDK, and TypeScript.",
    images: ["/og-image.png"],
    creator: "@vercel",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  category: "technology",
  metadataBase: new URL("https://webhooks-example.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
