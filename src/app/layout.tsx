import "./styles/globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "intro.js/introjs.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/nprogress.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import NextTopLoader from 'nextjs-toploader';
// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konsume",
  description: "KonsumeAI web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#30b800" />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
