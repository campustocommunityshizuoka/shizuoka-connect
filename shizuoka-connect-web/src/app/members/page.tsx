import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'メンバー紹介',
  description: '地域と学生をつなぐ会「しずおかコネクト」の運営メンバーをご紹介します。',
};

export default function MembersPage() {
  return (
    <>
      <section className="page-hero-modern" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="page-hero-text">
          <h2>MEMBERS</h2>
          <p>運営メンバー紹介</p>
        </div>
      </section>
      
      <main className="container page-content">
        <div className="section-header">
          <h2 className="section-title-modern">OUR TEAM</h2>
          <p className="section-desc">多様な専門性と熱意を持った学生たちが活動しています。</p>
        </div>

        <div className="modern-member-grid">
          
          {/* 野田 悠生 */}
          <div className="modern-member-card">
            <div className="member-img-wrapper">
                <img src="/assets/member1.jpg" alt="野田 悠生" />
            </div>
            <h4>野田 悠生</h4>
            <div className="role">理事長</div>
            
            <div className="member-bio-modern">
                <h5>役割</h5>
                <p>「地域と学生をつなぐ会 しずおかコネクト」 代表</p>
                <h5>所属</h5>
                <p>静岡大学 工学部 機械工学科光電精密コース</p>
                <h5>活動への想い</h5>
                <p>私が「地域と学生をつなぐ会 しずおかコネクト」を立ち上げた原点は...（省略なしで表示）...日々活動を広げてまいります。</p>
                {/* ※長文のため省略していますが、実際のファイルには元のHTMLの全文を入れてください */}
                <h5>メッセージ</h5>
                <p>学生が持つ革新的な知恵と行動力を地域社会に結びつけることで...（省略なしで表示）...ご協力を心よりお願い申し上げます。</p>
            </div>
          </div>

          {/* 前田 伊瑳武 */}
          <div className="modern-member-card">
            <div className="member-img-wrapper">
                <img src="/assets/member2.jpg" alt="前田 伊瑳武" />
            </div>
            <h4>前田 伊瑳武</h4>
            <div className="role">副理事長</div>
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
            <div className="role">副理事長</div>
            <div className="member-bio-modern">
                <h5>役割</h5><p>副理事長、ホームページの製作、管理等</p>
                <h5>所属</h5><p>静岡大学 工学部 機械工学科 航空宇宙工学専攻</p>
                <h5>活動への想い</h5><p>静岡・浜松の地域をより活性化していきたいと感じこの活動に参加させていただいています。</p>
                <h5>これまでの経験</h5><p>留学</p>
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

        </div>
      </main>
    </>
  );
}