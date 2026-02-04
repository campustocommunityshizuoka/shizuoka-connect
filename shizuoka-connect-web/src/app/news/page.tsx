import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getOptimizedImage } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お知らせ・発表',
  description: 'しずおかコネクトからの最新のお知らせ、プレスリリース、活動報告などを掲載しています。',
};

export default async function NewsPage() {
  // サーバーサイドでデータ取得
  const q = query(collection(db, "news"), orderBy("date", "desc"), limit(30));
  const snap = await getDocs(q);
  
  const newsList = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as any));

  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>NEWS</h2>
          <p>お知らせ・発表</p>
        </div>
      </section>

      <main className="container page-content">
        <div className="news-list-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {newsList.length === 0 ? (
            <p style={{ textAlign: 'center' }}>お知らせはありません</p>
          ) : (
            newsList.map((news) => {
              // リンク先の判定（詳細記事か、外部リンクか）
              const href = news.content ? `/news/${news.id}` : (news.internalUrl || news.directUrl || '#');
              const target = (!news.content && news.directUrl) ? '_blank' : undefined;
              
              // ★画像がない場合はロゴをデフォルト画像として使用
              const rawImg = news.image || '/assets/logo.png';
              const optimizedImg = getOptimizedImage(rawImg) || rawImg;

              return (
                <Link 
                    key={news.id} 
                    href={href} 
                    className="news-item-link" 
                    target={target}
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderBottom: '1px solid #eee' }}
                >
                  <div className="news-item" style={{ display: 'flex', alignItems: 'flex-start', padding: '1.5rem 1rem' }}>
                    {/* 画像エリア (常に表示) */}
                    <div className="news-thumb" style={{ width: '120px', height: '90px', flexShrink: 0, marginRight: '15px', background: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <img 
                           src={optimizedImg} 
                           style={{ 
                               width: '100%', 
                               height: '100%', 
                               // 画像があれば 'cover' (埋め尽くし)、ロゴなどの代替画像なら 'contain' (全体表示)
                               objectFit: news.image ? 'cover' : 'contain', 
                               padding: news.image ? '0' : '10px' // ロゴの場合は少し余白を入れる
                           }} 
                           alt="サムネイル" 
                         />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p className="news-item-date" style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>{news.date}</p>
                      <h3 className="news-item-title" style={{ margin: '0', fontSize: '1.1rem', color: '#1A71BE' }}>{news.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}