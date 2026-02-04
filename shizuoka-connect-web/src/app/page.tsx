import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getOptimizedImage } from '@/lib/utils';
import MapWrapper from '@/components/home/MapWrapper';
import ScrollObserver from '@/components/ScrollObserver';

export default async function Home() {
  // 1. ニュース取得 (Server Side)
  const newsQuery = query(collection(db, "news"), orderBy("date", "desc"), limit(10));
  const newsSnapshot = await getDocs(newsQuery);
  const newsList = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  const latestNews = newsList.length > 0 ? newsList[0] : null;

  // 2. 注目プロジェクト取得 (Server Side)
  const projQuery = query(collection(db, "top_projects"), orderBy("order", "asc"));
  const projSnapshot = await getDocs(projQuery);
  const featuredProjects = projSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

  return (
    <>
      <ScrollObserver />
      
      <section className="modern-hero">
        <div className="hero-bg-overlay"></div>
        <div className="hero-content container">
          <h2 className="hero-title">地域と学生の<br className="sp-only" />未来を<span className="text-gradient">コネクト</span>する</h2>
          <p className="hero-subtitle">
            学生の柔軟な発想 × 地域の魅力。<br />
            静岡から新しい価値を創造するプラットフォーム。
          </p>
          <div className="hero-buttons">
            <Link href="#roles" className="btn btn-hero">もっと詳しく見る <i className="fas fa-arrow-down"></i></Link>
          </div>
        </div>
      </section>

      <main className="container page-content">
          
        {/* ニュースセクション */}
        <section style={{ marginTop: '2rem', marginBottom: '4rem' }}>
            <div className="news-list-container">
                <ul className="news-list">
                    {newsList.slice(0, 5).map((news) => {
                        // 1. リンク先の優先順位決定ロジック
                        let linkHref = "";
                        const hasContent = news.content && news.content.trim() !== "";

                        if (hasContent) {
                            linkHref = `/news/${news.id}`; // 本文があれば詳細ページ
                        } else if (news.directUrl) {
                            linkHref = news.directUrl;     // 外部URL
                        } else if (news.links?.web) {
                            linkHref = news.links.web;     // Webリンク
                        } else if (news.internalUrl) {
                            // ★修正ポイント：.html を消し、パスを整える
                            let path = news.internalUrl.replace('.html', ''); // .html を削除
                            if (!path.startsWith('/') && !path.startsWith('http')) {
                                path = '/' + path; // 頭にスラッシュがなければ付ける
                            }
                            linkHref = path;
                        }

                        // 2. リンクがない場合の表示
                        const content = (
                            <>
                                <span className="date">{news.date}</span>
                                <span style={{ marginLeft: '10px' }}>{news.title}</span>
                            </>
                        );

                        // 3. 外部リンクかどうかの判定
                        const isExternal = linkHref.startsWith('http');

                        return (
                            <li key={news.id} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                {linkHref ? (
                                    <Link 
                                        href={linkHref} 
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        style={{ flex: 1, textDecoration: 'none', color: 'inherit', display: 'block' }}
                                        className="news-link-hover" // CSSでホバーエフェクトをつけるとなお良し
                                    >
                                        {content}
                                    </Link>
                                ) : (
                                    <div style={{ flex: 1, color: '#666' }}>{content}</div>
                                )}
                            </li>
                        );
                    })}
                    {newsList.length === 0 && <li style={{padding:'1rem'}}>お知らせはありません</li>}
                </ul>
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <Link href="/news" style={{ fontSize: '0.9rem', color: '#1A71BE' }}>お知らせ一覧へ »</Link>
            </div>
        </section>

        {/* 役割選択セクション */}
        <section id="roles">
            <div className="section-header">
                <h2 className="section-title-modern">WHO ARE YOU?</h2>
                <p className="section-desc">あなたに合った入り口を選んでください</p>
            </div>

            <div className="modern-role-grid">
              <Link href="/service" className="modern-role-card student-card">
                <div className="card-bg-img" style={{ backgroundImage: "url('/assets/gakutika.jpg')" }}></div>
                <div className="card-content">
                  <div className="icon-circle"><i className="fas fa-user-graduate"></i></div>
                  <h3>学生の方へ</h3>
                  <p>ガクチカ作り・インターン・イベント企画。<br />学校では学べない「実践」をここで。</p>
                  <span className="card-arrow"><i className="fas fa-arrow-right"></i></span>
                </div>
              </Link>
              
              <Link href="/for-companies" className="modern-role-card company-card">
                <div className="card-bg-img" style={{ backgroundImage: "url('/assets/cumpa.jpg')" }}></div>
                <div className="card-content">
                  <div className="icon-circle"><i className="fas fa-building"></i></div>
                  <h3>企業・団体の方へ</h3>
                  <p>HP制作・システム開発・若者との連携。<br />学生の力で貴社の課題を解決します。</p>
                  <span className="card-arrow"><i className="fas fa-arrow-right"></i></span>
                </div>
              </Link>
            </div>
        </section>

        {/* プロジェクトセクション */}
        <section style={{ marginTop: '6rem' }}>
            <div className="section-header">
                <h2 className="section-title-modern">PROJECTS</h2>
                <p className="section-desc">現在進行中の注目のプロジェクト</p>
            </div>

            <div className="feature-grid" id="featured-projects-grid">
                {featuredProjects.length === 0 ? (
                    <p style={{ textAlign: 'center', width: '100%' }}>現在、注目のプロジェクトはありません。</p>
                ) : (
                    featuredProjects.map((proj) => {
                        const rawImg = proj.image || '/assets/teaching.png';
                        const optimizedImg = getOptimizedImage(rawImg) || rawImg;

                        return (
                            <div key={proj.id} className="service-card modern-card">
                                <Link href="/about" className="card-image-link">
                                    <div className="card-img-wrapper">
                                        {/* 2. imgタグには必ず最適化後の変数を使う */}
                                        <img src={optimizedImg} alt={proj.title || 'Project'} />
                                        <span className={`category-tag ${proj.tagClass || ''}`}>{proj.tagName || 'Project'}</span>
                                    </div>
                                </Link>
                                <div className="project-body">
                                    <h3 className="card-title">{proj.title}</h3>
                                    <p className="card-text">{proj.description ? proj.description.substring(0, 60) + '...' : ''}</p>
                                    <div className="card-footer">
                                        <Link href="/about" className="text-link-arrow">詳細を見る <i className="fas fa-arrow-right"></i></Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>

        {/* マップセクション */}
        <section className="map-section" style={{ marginTop: '6rem' }}>
            <div className="section-header">
                <h2 className="section-title-modern">AREA & PARTNERS</h2>
                <p className="section-desc">浜松市を中心に活動エリア拡大中</p>
            </div>
            
            {/* クライアントコンポーネントとしてマップを呼び出し */}
            <MapWrapper />
        </section>

        {/* CTA & Grow Up Group */}
        <div className="bottom-grid">
            <section className="cta-section">
                <h2 style={{ color: '#135a9e' }}>あなたの力を、静岡の未来に。</h2>
                <p style={{ margin: '1rem 0 1.5rem 0' }}>学生の皆さん、企業の皆さん、私たちと一緒に新しい一歩を踏み出しませんか？</p>
                <Link href="/contact" className="btn">お問い合わせはこちら</Link>
            </section>

            <div className="grow-up-card">
                <h3><i className="fas fa-users"></i> Grow Upグループ</h3>
                <p>三団体が連携し、Grow Upグループとしての活動を本格的にスタートしました。</p>
                <div className="grow-up-btn-wrapper">
                    <a href="https://grow-up-group.shizuoka-connect.com/" className="btn" target="_blank" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                    合同HPを見る
                    </a>
                </div>
            </div>
        </div>

      </main>
    </>
  );
}