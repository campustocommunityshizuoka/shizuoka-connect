import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特別顧問',
  description: 'しずおかコネクトの活動を専門的な知見からご支援いただいている特別顧問（アドバイザー）をご紹介します。',
};

export default function AdvisorsPage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>ADVISORS</h2>
          <p>特別顧問のご紹介</p>
        </div>
      </section>
      
      <main className="container page-content">
        <div className="section-header">
          <h2 className="section-title-modern">SPECIAL ADVISOR</h2>
          <p className="section-desc">専門的な知見から活動をご支援いただいています。</p>
        </div>

        <div className="modern-member-grid" style={{ justifyContent: 'center', display: 'flex' }}>
          
          <div className="modern-member-card" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="member-img-wrapper">
                <img src="/assets/adviser.jpg" alt="島沢翔哉" />
            </div>
            <h4>島沢 翔哉</h4>
            <div className="role">特別顧問</div>
            
            <div className="member-bio-modern">
                <h5>経歴・専門</h5>
                <p>一般社団法人 Grow Up Academy代表</p>
                
                <h5>団体への関わり</h5>
                <p>スポーツ事業、英会話教室、プログラミング事業等を連携しながら活動させていただくことになりました。計画、運営の準備様々な活動に知見をお貸しいただいています。</p>
                
                <h5>メッセージ</h5>
                <p>しずおかコネクトは、学生の持つ柔軟な発想やスキルと、地域の魅力や課題を結びつける素晴らしい取り組みです。<br />
                私たちGrow Up Academyも、“人と地域の可能性を育てる”ことを使命に、スポーツや教育、文化を通じて次世代の育成と地域の活性化に取り組んできました。<br />
                今回の参画を通じて、学生の皆さんと共に新しい価値を生み出し、静岡というフィールドから未来を切り拓く力を育んでいけることを大変嬉しく思います。<br />
                若い世代の挑戦と地域の力がつながることで、きっと新しい静岡の可能性が広がっていくと信じています。</p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}