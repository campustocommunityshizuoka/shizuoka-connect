import type { Metadata } from 'next';
import Link from 'next/link';
import StudentEntryForm from '@/components/forms/StudentEntryForm';

export const metadata: Metadata = {
  title: '学生の方へ (登録サービス)',
  description: 'しずおかコネクトの学生登録ページです。あなたのスキルやアイデアを地域で活かしてみませんか？',
};

export default function ServicePage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>STUDENT ENTRY</h2>
          <p>学生登録サービス</p>
        </div>
      </section>

      <main className="container page-content">
        
        <div className="section-header">
          <h2 className="section-title-modern">JOIN US</h2>
          <p className="section-desc">あなたのスキルやアイデアを、地域で試してみませんか？</p>
        </div>

        <div className="merit-list">
            <div className="merit-item"><i className="fas fa-check-circle"></i> 実践的な活動の場</div>
            <div className="merit-item"><i className="fas fa-check-circle"></i> 他大学との交流</div>
            <div className="merit-item"><i className="fas fa-check-circle"></i> 企業とのコネクション</div>
            <div className="merit-item"><i className="fas fa-check-circle"></i> スキルアップ</div>
        </div>

        <section className="step-section">
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>登録から活動までの流れ</h3>
            <div className="step-grid">
                <div className="step-card">
                    <div className="step-icon"><i className="fas fa-file-alt"></i></div>
                    <h4>1. フォームから登録</h4>
                    <p>以下のフォームに学校情報や興味のある分野を入力して送信します。</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><i className="fas fa-envelope-open-text"></i></div>
                    <h4>2. 案内メール受信</h4>
                    <p>私たちからご案内のメールを送信させていただきます。</p>
                </div>
                <div className="step-card">
                    <div className="step-icon"><i className="fas fa-handshake"></i></div>
                    <h4>3. 活動へ参加</h4>
                    <p>興味のあるプロジェクトチームに参加しましょう！</p>
                </div>
            </div>
        </section>

        {/* フォームコンポーネントを配置 */}
        <StudentEntryForm />
        
      </main>
    </>
  );
}