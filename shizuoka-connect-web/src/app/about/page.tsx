import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { getOptimizedImage } from '@/lib/utils';
import MapWrapper from '@/components/home/MapWrapper';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '活動内容・開発実績',
  description: 'しずおかコネクトの活動内容（PROJECTS）と、学生エンジニアによる開発実績（WORKS）をご紹介します。',
};

// データの再検証 (ISR)
export const revalidate = 60;

export default async function AboutPage() {
  // 1. データ取得 (Server Side)
  // "projects" コレクションから全データを取得し、サーバー側で分類します
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  
  const allProjects = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as any));

  // 2. データの分類
  // type === 'portfolio' なら開発実績(WORKS)、それ以外はプロジェクト(PROJECTS)
  const worksList = allProjects.filter(p => p.type === 'portfolio');
  const projectList = allProjects.filter(p => p.type !== 'portfolio');

  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>ACTIVITIES</h2>
          <p>活動内容と実績</p>
        </div>
      </section>

      <main className="container page-content">
        
        {/* PROJECTS セクション (日々の活動) */}
        <section style={{ marginBottom: '6rem' }}>
          <div className="section-header">
              <h2 className="section-title-modern">PROJECTS</h2>
              <p className="section-desc">教室開催やイベント運営など、日々の活動</p>
          </div>
          
          <div className="project-list-grid" id="project-list-area">
            {projectList.length === 0 ? (
                <p>読み込み中...</p>
            ) : (
                projectList.map((item) => {
                    // タグのスタイル判定
                    let tagClass = 'tag-other';
                    let tagName = 'その他';
                    if(item.category === 'dev') { tagClass = 'tag-dev'; tagName = '開発'; }
                    else if(item.category === 'edu') { tagClass = 'tag-edu'; tagName = '教育'; }
                    else if(item.category === 'com') { tagClass = 'tag-recruit'; tagName = '交流'; }

                    const urlBtn = item.url 
                        ? <a href={item.url} target="_blank" className="text-link-arrow" style={{marginTop:'auto'}} rel="noopener noreferrer">詳細を見る <i className="fas fa-arrow-right"></i></a>
                        : <span className="text-link-arrow" style={{marginTop:'auto', color:'#999'}}>詳細なし</span>;

                    return (
                        <div key={item.id} className="service-card modern-card" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <div className="project-body">
                                <div style={{ marginBottom: '1rem' }}>
                                    <span className={`proj-tag ${tagClass}`}>{tagName}</span>
                                </div>
                                <h3 className="card-title" style={{ marginTop: 0 }}>{item.title}</h3>
                                <div 
                                    className="card-text" 
                                    dangerouslySetInnerHTML={{ __html: item.description?.replace(/\n/g, '<br/>') || '' }} 
                                />
                                <div className="card-footer" style={{ border: 'none', paddingTop: 0 }}>
                                    {urlBtn}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </section>

        {/* WORKS セクション (開発実績) */}
        <section style={{ marginBottom: '6rem' }}>
          <div className="section-header">
              <h2 className="section-title-modern">WORKS</h2>
              <p className="section-desc">これまでに開発・リリースしたWebサイトやアプリ</p>
          </div>

          <div className="portfolio-grid" id="portfolio-grid">
            {worksList.length === 0 ? (
                <p style={{ textAlign: 'center' }}>実績はまだありません</p>
            ) : (
                worksList.map((work) => {
                    const optimizedUrl = getOptimizedImage(work.image);
                    const urlBtn = work.url 
                        ? <a href={work.url} target="_blank" className="text-link-arrow" style={{marginTop:'auto'}} rel="noopener noreferrer">詳細を見る <i className="fas fa-arrow-right"></i></a>
                        : <span className="text-link-arrow" style={{marginTop:'auto', color:'#999'}}>詳細なし</span>;

                    return (
                        <div key={work.id} className="portfolio-card">
                            {optimizedUrl && (
                                <div 
                                    className="portfolio-img" 
                                    style={{ 
                                        backgroundImage: `url('${optimizedUrl}')`, 
                                        height: '200px', 
                                        backgroundSize: 'cover', 
                                        backgroundPosition: 'center' 
                                    }}
                                ></div>
                            )}
                            <div className="portfolio-content">
                                <div className="portfolio-header"><span className="proj-tag tag-dev">開発実績</span></div>
                                <h3 className="portfolio-title">{work.title}</h3>
                                <p 
                                    className="portfolio-desc"
                                    dangerouslySetInnerHTML={{ __html: work.description?.replace(/\n/g, '<br/>') || '' }}
                                />
                                {urlBtn}
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </section>

        {/* マップセクション (コンポーネント再利用) */}
        <section className="map-section">
          <div className="section-header">
              <h2 className="section-title-modern">AREA MAP</h2>
              <p className="section-desc">浜松市を中心に活動中</p>
          </div>
          
          {/* LeafletMapコンポーネントがフィルタボタン等も全て持っています */}
          <MapWrapper />
        </section>

        <section className="modern-cta">
          <div className="cta-content">
              <h2>一緒に活動しませんか？</h2>
              <p>学生の皆さん、企業の皆さん。新しい一歩をここから。</p>
              <Link href="/contact" className="btn btn-white">お問い合わせ</Link>
          </div>
        </section>

      </main>
    </>
  );
}