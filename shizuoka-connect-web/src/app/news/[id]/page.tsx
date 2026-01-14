"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// Cloudflare用の設定 (念のため残しておきます)
export const runtime = 'edge';

export default function NewsDetailPage() {
  const { id } = useParams(); // URLからIDを取得
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ブラウザ側でデータを取得する
    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "news", id as string);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          setNews(snap.data());
        } else {
          setNews(null); // 見つからない場合
        }
      } catch (e) {
        console.error("News fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // --- ローディング表示 ---
  if (loading) {
    return (
      <main className="container page-content" style={{ marginTop: '120px', minHeight: '50vh', textAlign: 'center' }}>
        <div className="spinner-border" role="status" style={{ display: 'inline-block', width: '2rem', height: '2rem', verticalAlign: 'text-bottom', border: '.25em solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spinner-border .75s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: '#666' }}>記事を読み込んでいます...</p>
        <style jsx>{`@keyframes spinner-border { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  // --- 記事が見つからない場合 ---
  if (!news) {
    return (
      <main className="container page-content" style={{ marginTop: '120px', minHeight: '50vh', textAlign: 'center' }}>
        <h2>記事が見つかりませんでした</h2>
        <p style={{ margin: '1rem 0' }}>削除されたか、URLが間違っている可能性があります。</p>
        <Link href="/news" className="btn" style={{ padding: '10px 20px', background: '#1A71BE', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          お知らせ一覧に戻る
        </Link>
      </main>
    );
  }

  // --- 記事表示 (メイン) ---
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: news.image ? `url('${news.image}')` : "url('/assets/hero-bg.jpg')", minHeight: '300px' }}>
        <div className="page-hero-text">
          <span style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', marginBottom: '10px', display: 'inline-block' }}>
            {news.date}
          </span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>{news.title}</h2>
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
                    {news.links.web && <a href={news.links.web} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#333'}}><i className="fas fa-globe"></i> Web</a>}
                    {news.links.instagram && <a href={news.links.instagram} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#E1306C'}}><i className="fab fa-instagram"></i> Instagram</a>}
                    {news.links.x && <a href={news.links.x} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#000'}}><i className="fab fa-twitter"></i> X (Twitter)</a>}
                    {news.links.facebook && <a href={news.links.facebook} target="_blank" rel="noopener noreferrer" className="btn-sns" style={{background:'#1877F2'}}><i className="fab fa-facebook-f"></i> Facebook</a>}
                </div>
            </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/news" className="btn btn-outline" style={{ border: '1px solid #1A71BE', color: '#1A71BE', padding: '10px 30px', textDecoration: 'none', borderRadius: '30px' }}>
            一覧に戻る
          </Link>
        </div>

        {/* スタイル調整 */}
        <style jsx>{`
          .btn-sns { color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.2s; }
          .btn-sns:hover { opacity: 0.8; }
        `}</style>
      </main>
    </>
  );
}