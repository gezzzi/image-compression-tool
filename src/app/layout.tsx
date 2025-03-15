import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'

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
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="v-5mBHaQPHryCAhOwqhA9MjkOtYrU6p3t9_sQSaFrv4" />
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-D2PV9459LC" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D2PV9459LC');
          `}
        </Script>
      </body>
    </html>
  );
}
