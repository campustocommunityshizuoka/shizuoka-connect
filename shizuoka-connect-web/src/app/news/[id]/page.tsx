"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Cloudflare用の設定
export const runtime = 'edge';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "news", id as string);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setNews(snap.data());
        } else {
          setNews(null);
        }
      } catch (e) {
        console.error("News fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  // --- ボタンのスタイル定義（確実に適用させるため変数化） ---
  const buttonStyle = {
    display: 'inline-block',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #1A71BE',
    padding: '12px 35px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 500 as const,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  };

  // --- ローディング表示 ---
  if (loading) {
    return (
      <main className="container page-content" style={{ marginTop: '120px', minHeight: '50vh', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '4px solid #f3f3f3', borderTop: '4px solid #1A71BE', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: '#666' }}>記事を読み込んでいます...</p>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
      </main>
    );
  }

  // --- 記事が見つからない場合 ---
  if (!news) {
    return (
      <main className="container page-content" style={{ marginTop: '120px', minHeight: '50vh', textAlign: 'center' }}>
        <h2>記事が見つかりませんでした</h2>
        <p style={{ margin: '1rem 0' }}>削除されたか、URLが間違っている可能性があります。</p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/news" className="news-back-btn" style={buttonStyle}>
            一覧に戻る
          </Link>
        </div>
        {/* ホバー効果のみCSSで注入 */}
        <style dangerouslySetInnerHTML={{__html: `
          .news-back-btn:hover {
            background-color: #1A71BE !important;
            color: #fff !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(26, 113, 190, 0.2) !important;
          }
        `}} />
      </main>
    );
  }

  // --- 記事表示 (メイン) ---
  // 背景画像のフォールバック設定：画像がない場合は 'taki.jpg' を使用
  const bgImage = news.image ? `url('${news.image}')` : "url('/assets/taki.jpg')";

  return (
    <>
      <section className="page-hero-modern" style={{ 
          backgroundImage: bgImage, 
          minHeight: '300px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1A71BE' // 画像読み込み前の背景色
      }}>
        <div className="page-hero-text">
          <span style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 10px', borderRadius: '4px', marginBottom: '10px', display: 'inline-block' }}>
            {news.date}
          </span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: 'white' }}>{news.title}</h2>
        </div>
      </section>

      <main className="container page-content" style={{ maxWidth: '800px', margin: '3rem auto' }}>
        {/* 本文 */}
        <div className="news-body" style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
          {news.content || '本文はありません。'}
        </div>

        {/* 関連リンク */}
        {news.links && (Object.values(news.links).some(url => url)) && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.1rem' }}>関連リンク</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {news.links.web && <a href={news.links.web} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#333', color:'white', padding:'8px 15px', borderRadius:'4px', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'0.9rem'}}><i className="fas fa-globe"></i> Web</a>}
                    {news.links.instagram && <a href={news.links.instagram} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#E1306C', color:'white', padding:'8px 15px', borderRadius:'4px', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'0.9rem'}}><i className="fab fa-instagram"></i> Instagram</a>}
                    {news.links.x && <a href={news.links.x} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#000', color:'white', padding:'8px 15px', borderRadius:'4px', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'0.9rem'}}><i className="fab fa-twitter"></i> X (Twitter)</a>}
                    {news.links.facebook && <a href={news.links.facebook} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#1877F2', color:'white', padding:'8px 15px', borderRadius:'4px', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'0.9rem'}}><i className="fab fa-facebook-f"></i> Facebook</a>}
                </div>
            </div>
        )}

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          {/* インラインスタイルを適用したボタン */}
          <Link href="/news" className="news-back-btn" style={buttonStyle}>
            一覧に戻る
          </Link>
        </div>

        {/* ホバー時のスタイルをグローバルに注入 */}
        <style dangerouslySetInnerHTML={{__html: `
          .news-back-btn:hover {
            background-color: #1A71BE !important;
            color: #fff !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(26, 113, 190, 0.2) !important;
          }
          .btn-sns:hover { opacity: 0.8; }
        `}} />
      </main>
    </>
  );
}