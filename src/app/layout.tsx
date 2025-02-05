import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Happy Birthday!",
  description: "生日快乐！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${cormorant.variable} ${notoSerif.variable} font-cormorant antialiased`}>
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
