import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'しずおかコネクトへのお問い合わせはこちらから。学生登録、企業連携、イベントについてなどお気軽にご連絡ください。',
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>CONTACT</h2>
          <p>お問い合わせ</p>
        </div>
      </section>
      
      <main className="container page-content">
        <div className="section-header">
           <p className="section-desc">
              ご質問・ご相談、地域連携のご提案など、お気軽にご連絡ください。<br />
              以下のフォーム、またはメール・Instagram DMにて受け付けております。
           </p>
        </div>

        {/* クライアントコンポーネントのフォームを配置 */}
        <ContactForm />

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h3 style={{ color: '#1A71BE', marginBottom: '1rem' }}>フォーム以外でのご連絡</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a href="mailto:campustocommunityshizuoka@gmail.com" className="btn btn-white" style={{ border: '1px solid #ddd' }}>
                <i className="fas fa-envelope"></i> メールで連絡
              </a>
              <a href="https://www.instagram.com/shizuoka_connect?igsh=OXMyazhjcWQ0aW8y" target="_blank" className="btn btn-white" style={{ border: '1px solid #ddd' }} rel="noopener noreferrer">
                <i className="fab fa-instagram"></i> Instagram DM
              </a>
            </div>
        </div>
      </main>
    </>
  );
}