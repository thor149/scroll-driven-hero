import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ITZ FIZZ — Scroll-Driven Hero",
  description:
    "A scroll-driven hero section animation built with Next.js, Tailwind CSS and GSAP ScrollTrigger.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-canvas font-sans text-graphite antialiased">
        {children}
      </body>
    </html>
  );
}
