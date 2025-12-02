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

const siteName = "DreamCanvas AI";
const description =
  "Generate on-brand images instantly with curated styles, smart aspect ratios, and a spotlight gallery powered by AI.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic-086064ca.vercel.app"),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url: "https://agentic-086064ca.vercel.app",
    siteName,
    images: [
      {
        url: "https://image.pollinations.ai/prompt/Dreamy%20neon%20gradient%20background",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: [
      "https://image.pollinations.ai/prompt/Dreamy%20neon%20gradient%20background",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 antialiased text-white`}
      >
        {children}
      </body>
    </html>
  );
}
