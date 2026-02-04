// javascript.js (Complete Fix: Image Optimization & Mobile Menu & Loading)

import { db, rtdb } from "./firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { collection, addDoc, getDoc, getDocs, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// =========================================================
// ヘルパー関数: Cloudinary画像最適化 (クレジット節約)
// =========================================================
function getOptimizedImage(url) {
  if (!url) return null; 
  if (!url.includes('res.cloudinary.com')) return url; 

  // すでに変換パラメータが入っているかチェック
  if (url.includes('/f_auto,q_auto')) return url;

  // URLに "f_auto,q_auto,w_600" を挿入して軽量化
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
}

// =========================================================
// メイン処理 (ページ読み込み完了時に実行)
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
  
  // 1. UI / ナビゲーション
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  // ▼▼ 追加：新しい閉じるボタンを取得 ▼▼
  const closeBtn = document.getElementById("menu-close-btn");

  if (hamburger && navMenu) {
    // 開くボタン（ヘッダーの3本線）
    hamburger.addEventListener("click", () => {
      hamburger.classList.add("active");
      navMenu.classList.add("active");
    });
  }

  // ▼▼ 追加：閉じるボタン（メニュー内の×）を押した時の動作 ▼▼
  if (closeBtn && navMenu && hamburger) {
    closeBtn.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  }
  

  // スマホ用ドロップダウン
  const dropdownTogglesSp = document.querySelectorAll('.dropdown-toggle-sp');
  dropdownTogglesSp.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); 
      const currentMenu = toggle.nextElementSibling;
      // 他を閉じる
      document.querySelectorAll('.dropdown-menu-sp').forEach(menu => {
        if (menu !== currentMenu) menu.classList.remove('show');
      });
      // 切り替え
      currentMenu.classList.toggle('show');
    });
  });

  // スクロールアニメーション
  const fadeElements = document.querySelectorAll('.fade-in, .section-title');
  const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              obs.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });
  fadeElements.forEach(el => observer.observe(el));

  // 2. お問い合わせフォーム
  const contactForm = document.getElementById("contactForm");
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwm65W4QR-HnjtZuEsxWNa9B07W7U7p6wA9MYsNzjNlT_K0dU9Hai2YQI3_0fZJ7IkFYg/exec";

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if(btn) { btn.disabled = true; btn.textContent = "送信中..."; }

      const data = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
        timestamp: new Date().toISOString()
      };

      const contactsRef = ref(rtdb, "contacts");
      push(contactsRef, data)
        .then(() => {
          fetch(GAS_URL, {
            method: "POST", mode: "no-cors", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "お名前": data.name, "件名": data.subject, "メール": data.email, "内容": data.message })
          }).catch(console.error);
          alert("送信しました！");
          contactForm.reset();
        })
        .catch(err => alert("送信失敗: " + err.message))
        .finally(() => { if(btn) { btn.disabled = false; btn.textContent = "送信する"; } });
    });
  }

  // 3. 学生登録フォーム
  const studentForm = document.getElementById("studentForm");
  if (studentForm) {
    const privacyCheckbox = document.getElementById("privacy-agreement");
    const submitButton = document.getElementById("submitButton");
    const schoolTypeSelect = document.getElementById("school-type");

    if (schoolTypeSelect) {
      schoolTypeSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        const toggle = (id, show) => {
            const el = document.getElementById(id);
            if(el) {
                show ? el.classList.remove("hidden") : el.classList.add("hidden");
                el.querySelectorAll("input, select, textarea").forEach(i => i.required = show);
            }
        };
        toggle("university-fields", val === "university");
        toggle("vocational-fields", val === "vocational");
        toggle("other-school-fields", val === "other");
        toggle("grade-field", val === "university" || val === "vocational");
      });
    }

    if (submitButton) submitButton.disabled = true;
    if (privacyCheckbox) {
      privacyCheckbox.addEventListener("change", () => submitButton.disabled = !privacyCheckbox.checked);
    }

    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = document.getElementById("submitButton");
      if(btn) { btn.disabled = true; btn.textContent = "送信中..."; }

      let data = {
        name: studentForm.name.value,
        schoolType: studentForm["school-type"].value,
        grade: studentForm.grade ? studentForm.grade.value : "",
        email: studentForm.email.value,
        interests: studentForm.interests.value,
        skills: studentForm.skills.value,
        timestamp: new Date().toISOString()
      };

      if (data.schoolType === "university") {
        data.university = studentForm.university.value;
        data.faculty = studentForm.faculty.value;
        data.department = studentForm.department.value;
      } else if (data.schoolType === "vocational") {
        data.schoolName = studentForm["vocational-school"].value;
        data.major = studentForm.major.value;
      } else if (data.schoolType === "other") {
        data.schoolDetails = studentForm["other-school-details"].value;
      }

      addDoc(collection(db, "students"), data)
        .then(() => {
          alert("登録完了しました！");
          studentForm.reset();
          ["university-fields", "vocational-fields", "other-school-fields", "grade-field"].forEach(id => document.getElementById(id)?.classList.add("hidden"));
        })
        .catch(err => alert("エラー: " + err.message))
        .finally(() => { if(btn) { btn.textContent = "登録する"; } });
    });
  }

  // 4. データ読み込み実行 (ここが重要！)
  // トップページ用ニュース (tickerなど)
  const newsContainer = document.querySelector('.news-list'); 
  const newsTicker = document.querySelector('.news-content'); 
  if (newsContainer || newsTicker) loadNewsForIndex(newsContainer, newsTicker);
  
  // お知らせ一覧ページ
  if (document.getElementById('news-list-full')) loadNewsPage(document.getElementById('news-list-full'));
  
  // プロジェクト・開発実績・トップ注目 (すべて共通関数で処理)
  if (document.getElementById('project-list-area') || document.getElementById('portfolio-grid') || document.getElementById('featured-projects-grid')) {
      loadProjects();
  }
  
  // ニュース詳細
  if (document.getElementById('news-detail-content')) loadNewsDetail();

  // 隠しコマンド
  const secretDoor = document.getElementById("secret-door");
  if (secretDoor) {
    let count = 0;
    secretDoor.addEventListener("click", () => {
      count++;
      if(count >= 5) { location.href = "admin.html"; }
      setTimeout(() => count = 0, 2000);
    });
  }

  // スライドショー
  const slideshows = document.querySelectorAll('.slideshow-container');
  slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.slide');
    const prev = slideshow.querySelector('.prev');
    const next = slideshow.querySelector('.next');
    let idx = 0;
    const show = (i) => {
        slides.forEach(s => { s.classList.remove('active-slide'); s.style.display='none'; });
        if(slides[i]) { slides[i].style.display='flex'; slides[i].classList.add('active-slide'); }
    };
    if(next) next.addEventListener('click', () => { idx = (idx+1)%slides.length; show(idx); });
    if(prev) prev.addEventListener('click', () => { idx = (idx-1+slides.length)%slides.length; show(idx); });
    if(slides.length>0) show(0);
  });
});

// =========================================================
// データ取得関数定義 (クレジット節約版)
// =========================================================

// トップページニュース (Limit 10)
async function loadNewsForIndex(container, ticker) {
  try {
    const q = query(collection(db, "news"), orderBy("date", "desc"), limit(10));
    const snap = await getDocs(q);

    if (snap.empty) {
      if(container) container.innerHTML = '<li style="padding:1rem;">お知らせはありません</li>';
      if(ticker) ticker.innerHTML = 'お知らせはありません';
      return;
    }

    // ティッカーは最新1件のみ
    if (ticker) {
        const latest = snap.docs[0].data();
        const link = latest.content ? `news-detail.html?id=${snap.docs[0].id}` : (latest.internalUrl || latest.directUrl || '#');
        ticker.innerHTML = `<a href="${link}">${latest.date} ${latest.title} <i class="fas fa-chevron-right"></i></a>`;
    }

    // リスト表示（トップページ中段用）
    if (container) {
        container.innerHTML = '';
        // limit(10)で取得したが、表示は5件程度に絞るなど調整可
        const displayLimit = 5; 
        let count = 0;
        
        snap.forEach(d => {
            if(count >= displayLimit) return;
            const data = d.data();
            const link = data.content ? `news-detail.html?id=${d.id}` : (data.internalUrl || data.directUrl || '#');
            const target = (!data.content && data.directUrl) ? 'target="_blank"' : '';
            
            const li = document.createElement('li');
            // ここでは画像は出さずシンプルに
            li.innerHTML = `<span class="date">${data.date}</span><a href="${link}" ${target}>${data.title}</a>`;
            container.appendChild(li);
            count++;
        });
    }
  } catch (e) { console.error(e); }
}

// お知らせ一覧ページ (画像付き・最適化)
async function loadNewsPage(container) {
  try {
    const q = query(collection(db, "news"), orderBy("date", "desc"), limit(30));
    const snap = await getDocs(q);
    
    if (snap.empty) { 
      container.innerHTML = '<p class="text-center">お知らせはありません</p>'; 
      return; 
    }
    
    container.innerHTML = '';
    
    snap.forEach(d => {
      const data = d.data();
      const href = data.content ? `news-detail.html?id=${d.id}` : (data.internalUrl || data.directUrl || '#');
      const target = (!data.content && data.directUrl) ? 'target="_blank"' : '';
      
      // 画像の最適化
      const optimizedImg = getOptimizedImage(data.image);
      const imgHtml = optimizedImg 
        ? `<div class="news-thumb" style="width:120px; height:90px; flex-shrink:0; margin-right:15px; background:#f0f0f0; border-radius:4px; overflow:hidden;">
             <img src="${optimizedImg}" style="width:100%; height:100%; object-fit:cover;" alt="サムネイル">
           </div>`
        : ''; 

      container.innerHTML += `
        <a href="${href}" class="news-item-link" ${target} style="display:block; text-decoration:none; color:inherit; border-bottom:1px solid #eee;">
          <div class="news-item" style="display:flex; align-items:flex-start; padding:1.5rem 1rem;">
            ${imgHtml}
            <div style="flex:1;">
              <p class="news-item-date" style="color:#666; font-size:0.9rem; margin:0 0 0.5rem 0;">${data.date}</p>
              <h3 class="news-item-title" style="margin:0; font-size:1.1rem; color:#1A71BE;">${data.title}</h3>
            </div>
          </div>
        </a>`;
    });
  } catch (e) { 
    console.error(e);
    container.innerHTML = '<p>読み込みエラー</p>'; 
  }
}

// お知らせ詳細ページ (画像付き・最適化)
async function loadNewsDetail() {
    const c = document.getElementById('news-detail-content');
    if(!c) return;
    
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { c.innerHTML = "<p>記事が見つかりません</p>"; return; }
    
    try {
        const d = await getDoc(doc(db, "news", id));
        if (d.exists()) {
            const data = d.data();
            
            // アイキャッチ画像の最適化
            const optimizedImg = getOptimizedImage(data.image);
            const mainImageHtml = optimizedImg 
                ? `<div style="margin-bottom:2rem; border-radius:8px; overflow:hidden; max-height:400px;">
                     <img src="${optimizedImg}" style="width:100%; height:100%; object-fit:cover;" alt="${data.title}">
                   </div>`
                : '';

            let linksHtml = '';
            if(data.links) {
                const ls = [];
                if(data.links.web) ls.push(`<a href="${data.links.web}" target="_blank" class="btn-link"><i class="fas fa-globe"></i> WebSite</a>`);
                if(data.links.instagram) ls.push(`<a href="${data.links.instagram}" target="_blank" class="btn-link"><i class="fab fa-instagram"></i> Instagram</a>`);
                if(data.links.x) ls.push(`<a href="${data.links.x}" target="_blank" class="btn-link"><i class="fab fa-twitter"></i> X (Twitter)</a>`);
                if(data.links.facebook) ls.push(`<a href="${data.links.facebook}" target="_blank" class="btn-link"><i class="fab fa-facebook"></i> Facebook</a>`);
                if(ls.length > 0) linksHtml = `<div style="margin-top:2rem; display:flex; gap:10px; flex-wrap:wrap;">${ls.join('')}</div>`;
            }

            c.innerHTML = `
                <div style="border-bottom:1px solid #eee; padding-bottom:1rem; margin-bottom:2rem;">
                    <p style="color:#666;">${data.date}</p>
                    <h2 style="color:#1A71BE; font-size:1.8rem; margin-top:0.5rem;">${data.title}</h2>
                </div>
                ${mainImageHtml}
                <div style="line-height:1.8; white-space: pre-wrap; font-size:1.05rem;">${data.content || ''}</div>
                ${linksHtml}`;
        } else { c.innerHTML = "<p>記事がありません</p>"; }
    } catch (e) { c.innerHTML = "<p>エラーが発生しました</p>"; }
}

// プロジェクト & 開発実績読み込み (最適化済み)
// プロジェクト & 開発実績読み込み (修正版：画像有無の自動判定)
async function loadProjects() {
  const portfolioContainer = document.getElementById('portfolio-grid'); 
  const listContainer = document.getElementById('project-list-area'); 
  const featuredContainer = document.getElementById('featured-projects-grid'); 

  if (!portfolioContainer && !listContainer && !featuredContainer) return;

  try {
    // --- トップページ (top_projects) ---
    // ここはトップページ用なので、画像の有無にかかわらず既存のデザイン（デフォルト画像）を維持します
    if (featuredContainer) {
        const q = query(collection(db, "top_projects"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        
        featuredContainer.innerHTML = '';
        if (querySnapshot.empty) {
            featuredContainer.innerHTML = '<p style="text-align:center; width:100%;">現在、注目のプロジェクトはありません。</p>';
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const bgImg = getOptimizedImage(data.image) || 'assets/teaching.png';
            const urlBtn = `<a href="about.html" class="text-link-arrow">詳細を見る <i class="fas fa-arrow-right"></i></a>`;

            const html = `
              <div class="service-card modern-card">
                  <a href="about.html" class="card-image-link">
                    <div class="card-img-wrapper">
                        <img src="${bgImg}" alt="${data.title}">
                        <span class="category-tag ${data.tagClass}">${data.tagName}</span>
                    </div>
                  </a>
                  <div class="project-body">
                    <h3 class="card-title">${data.title}</h3>
                    <p class="card-text">${data.description ? data.description.substring(0, 60) + '...' : ''}</p>
                    <div class="card-footer">
                        ${urlBtn}
                    </div>
                  </div>
              </div>`;
            featuredContainer.innerHTML += html;
        });
        return; 
    }

    // --- 活動一覧・開発実績 (projects) ---
    if (portfolioContainer || listContainer) {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        if (portfolioContainer) portfolioContainer.innerHTML = '';
        if (listContainer) listContainer.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // 画像URLを最適化 (画像がない場合は null になる)
            const optimizedUrl = getOptimizedImage(data.image);
            
            let urlBtn = data.url 
                ? `<a href="${data.url}" target="_blank" class="text-link-arrow" style="margin-top:auto;">詳細を見る <i class="fas fa-arrow-right"></i></a>`
                : `<span class="text-link-arrow" style="margin-top:auto; color:#999;">詳細なし</span>`;

            let tagClass = 'tag-other';
            let tagName = 'その他';
            if(data.category === 'dev') { tagClass = 'tag-dev'; tagName = '開発'; }
            if(data.category === 'edu') { tagClass = 'tag-edu'; tagName = '教育'; }
            if(data.category === 'com') { tagClass = 'tag-recruit'; tagName = '交流'; }
            if(data.type === 'portfolio') { tagClass = 'tag-dev'; tagName = '開発実績'; }

            if (data.type === 'portfolio' && portfolioContainer) {
                // ▼▼▼ 修正箇所：画像がある場合のみ画像エリアを表示 ▼▼▼
                let imgHtml = '';
                if (optimizedUrl) {
                    // 画像がある場合
                    imgHtml = `<div class="portfolio-img" style="background-image: url('${optimizedUrl}'); height: 200px; background-size: cover; background-position: center;"></div>`;
                }
                // 画像がない場合は imgHtml は空のまま

                const html = `
                    <div class="portfolio-card">
                        ${imgHtml}
                        <div class="portfolio-content">
                            <div class="portfolio-header"><span class="proj-tag tag-dev">開発実績</span></div>
                            <h3 class="portfolio-title">${data.title}</h3>
                            <p class="portfolio-desc">${data.description.replace(/\n/g, '<br>')}</p>
                            ${urlBtn}
                        </div>
                    </div>`;
                portfolioContainer.innerHTML += html;
            } else if (data.type !== 'portfolio' && listContainer) {
                // 活動リスト (こちらは元々画像なしのデザイン)
                const html = `
                    <div class="service-card modern-card" style="box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        <div class="project-body">
                        <div style="margin-bottom:1rem;"><span class="proj-tag ${tagClass}">${tagName}</span></div>
                        <h3 class="card-title" style="margin-top:0;">${data.title}</h3>
                        <p class="card-text">${data.description.replace(/\n/g, '<br>')}</p>
                        <div class="card-footer" style="border:none; padding-top:0;">${urlBtn}</div>
                        </div>
                    </div>`;
                listContainer.innerHTML += html;
            }
        });
    }

  } catch (error) {
    console.error("Project Load Error:", error);
  }
}