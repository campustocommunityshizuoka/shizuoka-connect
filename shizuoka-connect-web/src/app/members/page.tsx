import type { Metadata } from 'next';
import MemberTabs from '@/components/MemberTabs'; // 作成したコンポーネントをインポート

export const metadata: Metadata = {
  title: 'メンバー紹介',
  description: '地域と学生をつなぐ会「しずおかコネクト」の運営メンバーと各チームをご紹介します。',
};

export default function MembersPage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>MEMBERS</h2>
          <p>チーム・メンバー紹介</p>
        </div>
      </section>
      
      <main className="container page-content">
        <div className="section-header">
          <h2 className="section-title-modern">OUR TEAMS</h2>
          <p className="section-desc">多様な専門性と熱意を持った学生たちが、それぞれのチームで活動しています。</p>
        </div>

        {/* タブ切り替え機能付きメンバーリスト */}
        <MemberTabs />

      </main>
    </>
  );
}