import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import "@/styles/mobile.css";

const cormorant = Cormorant_Garamond({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-cormorant",
  adjustFontFallback: false
});

const notoSerif = Noto_Serif_SC({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-noto",
  adjustFontFallback: false
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Happy Birthday!",
  description: "生日快乐！",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "192x192" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="zh">
        <body className={`${cormorant.variable} ${notoSerif.variable} font-cormorant antialiased`}>
          <div className="noise" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
