import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "画像圧縮・変換ツール",
  description: "ブラウザで簡単に画像を圧縮・変換できるツールです",
  icons: {
    // SVGをメインのファビコンとして設定
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      // レガシーブラウザ用のICOファビコン
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    // Apple Touch Icon（オプション）
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
