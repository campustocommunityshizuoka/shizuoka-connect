import type { Metadata } from 'next';
import PartnerCard from '@/components/ui/PartnerCard';

export const metadata: Metadata = {
  title: '連携企業・団体紹介',
  description: 'しずおかコネクトと連携・協力している企業・団体様をご紹介します。',
};

export default function PartnersPage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>PARTNERS</h2>
          <p>協賛企業・団体</p>
        </div>
      </section>

      <main className="container page-content">
        <div className="section-header">
          <h2>協賛企業・団体のご紹介</h2>
          <p>しずおかコネクトは、以下の企業・団体の皆様からご支援・ご協力をいただいております。</p> 
        </div>

        <div className="partner-grid">
          {/* Grow Up Academy */}
          <PartnerCard 
            name="一般社団法人Grow Up Academy"
            description="静岡県浜松市を拠点としてスポーツに関する事業を行ってます。様々な部分で協力させていただいており、同法人代表には当会の特別顧問にも就任していただいています。"
            url="https://www.grow-up-academy.com/"
            images={['/assets/growuplogo.jpg']}
          />

          {/* テガラ株式会社 */}
          <PartnerCard 
            name="テガラ株式会社"
            description="研究者・開発者のためのさまざまなサービスを提供している会社です。大学などにおける研究では欠かせない存在です。現在、エンジニア職体験など体験会の募集を行っています。"
            url="https://www.tegara.com/"
            images={[
                '/assets/tegara-logo.png',
                '/assets/tegara1.JPG',
                '/assets/tegara2.jpg',
                '/assets/tegara3.JPG',
                '/assets/tegara4.JPG'
            ]}
          />

          {/* Career Vision Lab */}
          <PartnerCard 
            name="一般社団法人Career Vision Lab"
            description="「ツマラナイ就活を、オモシロく。」をスローガンに、従来の堅苦しい就職活動とは異なるアプローチを特徴. 就活生×社会人 カジュアルコミュニティ 'STAND UP!!'"
            url="https://share.google/J2gCuAwfwO09tOpGs" // 頂いたコードのままですがリンク切れの可能性あり
            images={[
                '/assets/careervision.jpg',
                '/assets/ca1.JPG',
                '/assets/ca2.JPG',
                '/assets/ca3.JPG'
            ]}
          />

          {/* 愛管株式会社 */}
          <PartnerCard 
            name="愛管株式会社"
            description="管工事を中心に多くの事業を展開しており，配管工事と付随する企画、設計、施工を40年以上続け、安心安全な生活を提供しています．"
            url="https://i-kan.co.jp/"
            images={['/assets/ikan.jpg']}
          />
        </div>
      </main>
    </>
  );
}