import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '企業・団体の方へ',
  description: '静岡の学生と連携したい企業の皆様へ。マーケティング、広報、イベント企画など、学生の力で貴社の課題を解決します。',
};

export default function ForCompaniesPage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>FOR COMPANIES</h2>
          <p>企業・団体の皆様へ</p>
        </div>
      </section>

      <main className="container page-content">
        <div className="section-header">
          <h2 className="section-title-modern">OUR SERVICES</h2>
          <p className="section-desc">学生の柔軟な発想と技術力で、貴社の課題を解決します</p>
        </div>

        <div className="service-detail-grid">
            
            <div className="service-detail-card">
                <div className="service-icon-header"><i className="fas fa-lightbulb"></i></div>
                <div className="service-body">
                    <h3>新しいアイデアの提供</h3>
                    <p>「若者の意見を取り入れたい」「SNSでどう発信すればいいかわからない」そんなお悩みはありませんか？<br/>SNSマーケティング、商品開発のブレインストーミング、イベント企画など、学生ならではの忖度のない視点で、貴社のビジネスに新しい風を吹き込みます。</p>
                    <div className="service-tag-list">
                        <span className="service-tag">#マーケティング</span>
                        <span className="service-tag">#SNS運用</span>
                        <span className="service-tag">#商品企画</span>
                    </div>
                </div>
            </div>

            <div className="service-detail-card">
                <div className="service-icon-header"><i className="fas fa-bullhorn"></i></div>
                <div className="service-body">
                    <h3>広報・ブランディング</h3>
                    <p>連携プロジェクトを通して、学生や地域社会に対する貴社の認知度向上に貢献します。<br/>また、HP制作やシステム開発など、学生エンジニアによる技術的なサポートも可能です。コストを抑えつつ、熱意ある制作物をご提供します。</p>
                    <div className="service-tag-list">
                        <span className="service-tag">#HP制作</span>
                        <span className="service-tag">#システム開発</span>
                        <span className="service-tag">#採用広報</span>
                    </div>
                </div>
            </div>

            <div className="service-detail-card">
                <div className="service-icon-header"><i className="fas fa-hands-helping"></i></div>
                <div className="service-body">
                    <h3>CSR・地域貢献</h3>
                    <p>地域の課題解決に学生と共に取り組むことで、貴社の地域貢献活動（CSR）をサポートします。<br/>次世代を担う若者の育成に関わることは、企業の社会的価値を高め、地域からの信頼獲得につながります。</p>
                    <div className="service-tag-list">
                        <span className="service-tag">#地域活性化</span>
                        <span className="service-tag">#人材育成</span>
                        <span className="service-tag">#SDGs</span>
                    </div>
                </div>
            </div>
        </div>

        <section className="step-section" style={{ marginTop: '5rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>ご依頼・連携の流れ</h3>
            <div className="step-grid">
                <div className="step-card">
                    <div className="step-icon"><i className="far fa-comments"></i></div>
                    <h4>1. お問い合わせ</h4>
                    <p>まずはフォームよりお気軽にご相談ください。「こんなことできる？」という段階で構いません。</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><i className="fas fa-users-cog"></i></div>
                    <h4>2. ヒアリング・提案</h4>
                    <p>運営メンバーがお話を伺い、学生のリソースでどのように貢献できるかをご提案します。</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><i className="fas fa-rocket"></i></div>
                    <h4>3. プロジェクト開始</h4>
                    <p>マッチする学生チームを編成し、プロジェクトや実務をスタートさせます。</p>
                </div>
            </div>
        </section>
          
        <section className="modern-cta">
            <div className="cta-content">
              <h2>まずはお気軽にご相談ください</h2>
              <p>学生の力で、貴社の未来を少しだけ面白くできるかもしれません。<br/>ご質問やご依頼をお待ちしております。</p>
              <Link href="/contact" className="btn btn-white">お問い合わせフォームへ</Link>
            </div>
        </section>
          
      </main>
    </>
  );
}