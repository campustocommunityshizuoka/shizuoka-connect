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
        </div>
      </main>
    </>
  );
}