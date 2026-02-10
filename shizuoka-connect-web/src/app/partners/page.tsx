import type { Metadata } from 'next';
import Link from 'next/link';
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

        <div style={{ 
            marginTop: '6rem', 
            padding: '3rem 2rem', 
            backgroundColor: '#f8fbfc', 
            borderRadius: '16px', 
            border: '1px solid #e1e8ed',
            textAlign: 'center'
        }}>
            <h3 style={{ 
                fontSize: '1.5rem', 
                color: '#135a9e', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <i className="fas fa-handshake"></i>
                <span>新たなパートナーを募集しています</span>
            </h3>
            
            <p style={{ 
                color: '#555', 
                lineHeight: '1.8', 
                maxWidth: '700px', 
                margin: '0 auto 2rem auto' 
            }}>
                しずおかコネクトでは、学生と共に地域の活性化や課題解決に取り組んでいただける<br className="pc-only"/>
                企業様・団体様を随時募集しております。<br />
                ご協賛や連携に関するご相談は、どんなことでも下記よりお気軽にお問い合わせください！
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/for-companies" className="btn" style={{ 
                    backgroundColor: 'transparent', 
                    color: '#135a9e', 
                    border: '2px solid #135a9e',
                    fontWeight: 'bold',
                    padding: '0.8rem 2rem'
                }}>
                    企業・団体の方へ <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </Link>
                
                <Link href="/contact" className="btn" style={{ 
                    padding: '0.8rem 2rem'
                }}>
                    お問い合わせ <i className="fas fa-envelope" style={{ marginLeft: '8px' }}></i>
                </Link>
            </div>
        </div>

      </main>
    </>
  );
}