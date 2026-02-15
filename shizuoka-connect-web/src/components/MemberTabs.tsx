"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function MemberTabs() {
  const [activeTab, setActiveTab] = useState('management');

  // タブの定義
  const tabs = [
    { id: 'management', label: '運営' },
    { id: 'hp', label: 'HPチーム' },
    { id: 'app', label: 'アプリチーム' },
    { id: 'video', label: '動画チーム' },
    { id: 'event', label: 'イベントチーム' },
  ];

  return (
    <div>
      {/* タブメニュー */}
      <div className="member-tab-menu">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`member-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* コンテンツエリア */}
      <div className="modern-member-grid">
        
        {/* === 運営チーム (既存のメンバー移植) === */}
        {activeTab === 'management' && (
          <>
            {/* 野田 悠生 */}
            <div className="modern-member-card">
              <div className="member-img-wrapper">
                  <img src="/assets/member1.jpg" alt="野田 悠生" />
              </div>
              <h4>野田 悠生</h4>
              <div className="role">代表</div>
              
              <div className="member-bio-modern">
                  <h5>役割</h5>
                  <p>「地域と学生をつなぐ会 しずおかコネクト」 代表</p>
                  <h5>所属</h5>
                  <p>静岡大学 工学部 機械工学科光電精密コース</p>
                  <h5>活動への想い</h5>
                  <p>私が「地域と学生をつなぐ会 しずおかコネクト」を立ち上げた原点は、学生の持つ無限の可能性と地域社会の深い魅力を結びつけたいという強い願いにあります。これまでの活動を通じて、学生の柔軟な発想が地域の課題解決に寄与する瞬間を数多く目の当たりにしてきました。<br/>
                  私たちは、単なる学生団体にとどまらず、地域と学生が共に成長できるプラットフォームを目指しています。この法人の設立により、より持続的で信頼される組織として、地域企業や自治体との連携を深め、活動の幅を広げてまいります。</p>
                  <h5>メッセージ</h5>
                  <p>学生が持つ革新的な知恵と行動力を地域社会に結びつけることで、静岡・浜松から新しい価値を創造し、次世代のリーダーを育成していきます。<br/>
                  皆様の温かいご支援とご協力を心よりお願い申し上げます。</p>
              </div>
            </div>

            {/* 前田 伊瑳武 */}
            <div className="modern-member-card">
              <div className="member-img-wrapper">
                  <img src="/assets/member2.jpg" alt="前田 伊瑳武" />
              </div>
              <h4>前田 伊瑳武</h4>
              <div className="role">副代表</div>
              <div className="member-bio-modern">
                  <h5>役割</h5><p>副代表、ホームページの制作、管理等</p>
                  <h5>所属</h5><p>静岡大学工学部機械工学学科航空宇宙学専攻</p>
                  <h5>活動への想い</h5><p>色々な人と出会ってみたくて参加しました！一度きりの大学生活挑戦あるのみ！この活動を通し、人々をつなぐお手伝いができればと思っています。</p>
                  <h5>趣味・特技</h5><p>楽器の演奏が趣味です。サークルではドラムをやっています。ルービックキューブを23秒で揃えたことがあります。</p>
                  <h5>メッセージ</h5><p>最後まで読んで頂きありがとうございます！この団体があなたのお役に立てることを願っています！</p>
              </div>
            </div>

            {/* 栗本 來嶺 */}
            <div className="modern-member-card">
              <div className="member-img-wrapper">
                  <img src="/assets/member3.jpg" alt="栗本 來嶺" />
              </div>
              <h4>栗本 來嶺</h4>
              <div className="role">副代表</div>
              <div className="member-bio-modern">
                  <h5>役割</h5><p>副理事長、ホームページの製作、管理等</p>
                  <h5>所属</h5><p>静岡大学 工学部 機械工学科 航空宇宙工学専攻</p>
                  <h5>活動への想い</h5><p>静岡・浜松の地域をより活性化していきたいと感じこの活動に参加させていただいています。</p>
                  <h5>これまでの経験</h5><p>留学，HP製作，ウェブアプリ製作，AIを使った動画生成</p>
                  <h5>趣味・特技</h5><p>F1観戦</p>
                  <h5>メッセージ</h5><p>まずは、静岡・浜松において学生と企業の懸け橋となり活動を広げていけるように邁進します。留学中ではありますが、精一杯頑張ります！</p>
              </div>
            </div>

             {/* 中川 昂 */}
             <div className="modern-member-card">
              <div className="member-img-wrapper">
                  <img src="/assets/koh.jpg" alt="中川 昂" />
              </div>
              <h4>中川 昂</h4>
              <div className="role">理事</div>
              <div className="member-bio-modern">
                  <h5>役割</h5><p>SNS運用</p>
                  <h5>所属</h5><p>静岡大学 工学部 電子物質科学科 材料エネルギー化学専攻</p>
                  <h5>活動への想い</h5><p>この活動を通じて、学生が企業を知り、企業が学生を知るきっかけを生み出せることに大きな意義を感じています。私自身もその中で成長したいと考えています。</p>
                  <h5>これまでの経験</h5><p>動画編集、ドイツの大学での留学</p>
                  <h5>趣味・特技</h5><p>旅行、言語学習、サッカー</p>
                  <h5>メッセージ</h5><p>学生と企業の架け橋となれるよう、全力で活動しています！</p>
              </div>
            </div>

            {/* 渡邉 晴喜 */}
            <div className="modern-member-card">
              <h4>渡邉 晴喜</h4>
              <div className="role">監事</div>
              <div className="member-bio-modern">
                  <h5>役割</h5><p>監事として、法人の財産状況や業務の適正性の監査を行います。</p>
                  <h5>所属</h5><p>静岡大学 工学部 機械工学科 光電精密コース</p>
                  <h5>活動への想い</h5><p>実際に知識を最大限に活かした仕事を体験することで、大学で学ぶ意義やモチベーションを見つけていきたいと考えています。その経験をより多くの学生と共有し、大学での学びに目的を持ってもらうことが、私自身の役割だと思っています。</p>
                  <h5>これまでの経験</h5><p>岐阜県加茂市を中心に、学生向けイベントを複数回運営・主催してきました。その経験を活かし、個人としての活動を当法人における活動にも反映させていきたいと考えています。</p>
                  <h5>趣味</h5><p>ソフトテニス、ランニング、スポーツ観戦など</p>
                  <h5>メッセージ</h5><p>「大学で学んだ知識が目に見える形となって誰かの役に立つ」という成功体験を共に分かち合い、全力でサポートいたします。少しでも興味をお持ちいただけましたら、ぜひお力添えさせていただきます！</p>
              </div>
            </div>
          </>
        )}

        {/* === HPチーム === */}
        {activeTab === 'hp' && (
          <div className="modern-member-card">
            <div className="member-img-wrapper">
                <img src="/assets/HP-web.jpg" alt="中川 昂" />
            </div>
            <h4>栗本 來嶺</h4>
            <div className="role">HPチーム チームリーダー</div>
            <div className="member-bio-modern">
              <h5>活動実績</h5>
              <p>公式サイトのリニューアル、企業案件のLP制作などを行っています。詳細な実績は、<Link href="/about" className="text-link">活動内容の開発実績</Link>についてご覧ください。</p>
              <h5>活動への想い</h5>
              <p>見やすく、使いやすいWebサイトを作ることで、地域の情報をより多くの人に届けたいと考えています。</p>
            </div>
          </div>
        )}

        {/* === アプリチーム === */}
        {activeTab === 'app' && (
          <div className="modern-member-card">
            <div className="member-img-wrapper">
               <img src="/assets/HP-web.jpg" alt="アプリチーム" />
            </div>
            <h4>前田 伊瑳武</h4>
            <div className="role">ウェブアプリチーム チームリーダー</div>
            <div className="member-bio-modern">
              <h5>活動実績</h5>
              <p>地域イベント用マッチングアプリの開発、学生向け便利ツール等の制作を行っています。詳細な実績は、<Link href="/about" className="text-link">活動内容の開発実績</Link>についてご覧ください。</p>
              <h5>活動への想い</h5>
              <p>技術の力で日常の「ちょっと不便」を解消し、面白い体験を作っていきます。</p>
            </div>
          </div>
        )}

        {/* === 動画チーム === */}
        {activeTab === 'video' && (
          <div className="modern-member-card">
            <div className="member-img-wrapper">
               <img src="/assets/video.jpg" alt="動画チーム" />
            </div>
            <h4>中川 昂</h4>
            <div className="role">動画チーム チームリーダー</div>
            <div className="member-bio-modern">
              <h5>活動実績</h5>
              <p>企業PR動画の作成・編集を行っています。詳細な活動実績については<a href="https://grow-up-impact.com/" target="_blank" rel="noopener noreferrer" className="text-link">Grou Up Impact</a>のHPをご覧ください。</p>
              <h5>活動への想い</h5>
              <p>映像を通じて、言葉だけでは伝わらない魅力を発信します。</p>
            </div>
          </div>
        )}

        {/* === イベントチーム === */}
        {activeTab === 'event' && (
          <div className="modern-member-card">
            <div className="member-img-wrapper">
               <img src="/assets/event.jpg" alt="イベントチーム" />
            </div>
            <h4>渡邉 晴喜</h4>
            <div className="role">イベントチーム チームリーダー</div>
            <div className="member-bio-modern">
              <h5>活動実績</h5>
              <p>学生交流会の企画・運営、企業合同ワークショップの開催を行っています。特に2026/2/18のイベントを皮切りに様々なイベントを企画していきます。詳細は<a href="https://hamamtsu-events.shizuoka-connect.com/" target="_blank" rel="noopener noreferrer" className="text-link">しずおかコネクト地域情報サイト</a>や<Link href="/about" className="text-link">活動内容のエリアマップ</Link>をご覧ください。</p>
              <h5>活動への想い</h5>
              <p>人と人が直接つながる場の熱量を大切にし、記憶に残るイベントを作ります。</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}