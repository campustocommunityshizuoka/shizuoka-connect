import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP, Poppins } from 'next/font/google';
import Script from 'next/script';

// 1. フォントの最適化 (CLS防止・高速化)
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// 2. サイトの基本情報
const siteName = 'しずおかコネクト';
const siteDescription = '静岡の学生と地域企業をつなぐ「しずおかコネクト」。学生の柔軟な発想と技術力で、地域の課題解決と活性化を目指します。';
const siteUrl = 'https://shizuoka-connect.com'; // 本番ドメイン
const googleAnalyticsId = 'G-C2ECY6KQJC';       // firebase-config.jsより

// 3. 最強のSEOメタデータ設定 (改善版)
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${siteName}`,
    default: `${siteName} | 地域と学生をつなぐ会`,
  },
  description: siteDescription,
  keywords: ['静岡', '学生', '地域活性化', 'インターン', '企業連携', 'しずおかコネクト', '浜松', '大学生','HP','ホームページ','ウェブアプリ', '開発', '動画編集', 'IT教育','プログラミング教育'],
  authors: [{ name: 'しずおかコネクト 運営事務局' }],
  creator: 'しずおかコネクト',
  publisher: '地域と学生をつなぐ会 しずおかコネクト',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // ■ アイコン設定
  // ブラウザのタブやスマホのホーム画面用にはロゴを使用
  // 注意: src/app/favicon.ico がある場合はそちらが優先されるため、削除してください。
  icons: {
    icon: [
      // 通常のアイコン（サイズとファイル形式を明記）
      { url: '/assets/logo.png?v=2', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: ['/assets/logo.png?v=2'],
    // スマホのホーム画面に追加した時用
    apple: [
      { url: '/assets/logo.png?v=2', sizes: '180x180' },
    ],
  },

  // ■ OGP設定 (SNSシェア用 - 改善版)
  // ここで将来作成するリッチなアイキャッチ画像 (ogp.png) を指定します
  openGraph: {
    title: {
      template: `%s | ${siteName}`,
      default: `${siteName} | 地域と学生をつなぐ会`,
    },
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/assets/ogp.png', // ★ここを専用画像に設定
        width: 1200,
        height: 630,
        alt: 'しずおかコネクト - 学生と地域をつなぐプラットフォーム',
      },
    ],
  },
  
  // ■ Twitter設定 (X用 - 改善版)
  twitter: {
    card: 'summary_large_image', // 画像を大きく見せるカードタイプ
    title: siteName,
    description: siteDescription,
    images: ['/assets/ogp.png'], // ★ここも専用画像
    // creator: '@shizuoka_connect', // Xアカウントがあれば設定推奨
  },

  // クローラー制御
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // GSCなどの所有権確認
  verification: {
    google: 'ceIF4aTxXfR5vmp98XAVfTczFedhNAdcffjkJj1gMNs',
  },
};

// 4. ビューポート設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A71BE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 5. 構造化データ (Organization)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/assets/logo.png`,
    description: siteDescription,
    address: {
      '@type': 'PostalAddress',
      addressRegion: '静岡県',
      addressLocality: '浜松市',
      addressCountry: 'JP',
    },
    sameAs: [
      'https://www.instagram.com/shizuoka_connect',
      // 'https://twitter.com/shizuoka_connect',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'campustocommunityshizuoka@gmail.com',
      contactType: 'customer support',
    },
  };

  return (
    <html lang="ja" className={`${notoSansJP.variable} ${poppins.variable}`}>
      <head>
        {/* FontAwesome (CDN) */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
        />
        {/* 構造化データを出力 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>

        <Header />
        
        <div className="content-wrapper">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}