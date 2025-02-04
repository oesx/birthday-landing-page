import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const notoSerif = Noto_Serif_SC({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto",
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
