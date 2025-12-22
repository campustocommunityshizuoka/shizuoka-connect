// javascript.js (完全機能保持版)

// =========================================================================
// 1. 設定とインポート
// =========================================================================
import { db, rtdb } from "./firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { collection, addDoc, getDoc, getDocs, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
  
  // =========================================================================
  // 2. UI / ナビゲーション関連
  // =========================================================================
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // ハンバーガーメニューの開閉
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // スマホ用ドロップダウンメニューの制御
  const dropdownTogglesSp = document.querySelectorAll('.dropdown-toggle-sp');
  const allDropdownMenusSp = document.querySelectorAll('.dropdown-menu-sp');

  dropdownTogglesSp.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); 
      const currentMenu = toggle.nextElementSibling;
      
      // 他の開いているメニューがあれば閉じる
      allDropdownMenusSp.forEach(menu => {
        if (menu !== currentMenu) menu.classList.remove('show');
      });
      
      // タップしたメニューの開閉を切り替え
      currentMenu.classList.toggle('show');
    });
  });

  // (オプション) スクロール時のフェードインアニメーション
  // .fade-in クラスがついている要素をスクロールに合わせて表示
  const fadeElements = document.querySelectorAll('.fade-in, .section-title');
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
  
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // 一度表示したら監視終了
          }
      });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));


  // =========================================================================
  // 3. お問い合わせフォーム (Firebase + LINE通知)
  // =========================================================================
  const contactForm = document.getElementById("contactForm");
  
  // ★ここに手順6でコピーした「GASのURL」を貼り付けてください！
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwm65W4QR-HnjtZuEsxWNa9B07W7U7p6wA9MYsNzjNlT_K0dU9Hai2YQI3_0fZJ7IkFYg/exec";

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const btn = contactForm.querySelector('button[type="submit"]');
      if(btn) {
          btn.disabled = true;
          btn.textContent = "送信中...";
      }

      const data = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
        timestamp: new Date().toISOString()
      };

      // 1. Firebaseに保存（これは今まで通り）
      const contactsRef = ref(rtdb, "contacts");
      const newContactRef = push(contactsRef);

      set(newContactRef, data)
        .then(() => {
          // --------------------------------------------------
          // ★ 2. LINEにも通知を送る
          // --------------------------------------------------
          const lineData = {
            "お名前": data.name,
            "件名": data.subject,
            "メール": data.email,
            "内容": data.message
          };

          // GASにデータを投げる
          fetch(GAS_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lineData)
          }).catch(err => console.log("LINE送信エラー(無視OK):", err));
          // --------------------------------------------------

          alert("お問い合わせ内容を送信しました！\nLINEにも通知を送りました。");
          contactForm.reset();
        })
        .catch((error) => {
          alert("送信に失敗しました: " + error.message);
          console.error(error);
        })
        .finally(() => {
            if(btn) {
                btn.disabled = false;
                btn.textContent = "送信する";
            }
        });
    });
  }


  // =========================================================================
  // 4. 学生登録フォーム (Firestore / 入力欄出し分けロジック)
  // =========================================================================
  const studentForm = document.getElementById("studentForm");
  
  if (studentForm) {
    const privacyCheckbox = document.getElementById("privacy-agreement");
    const submitButton = document.getElementById("submitButton");

    // 各種フィールドエリア
    const schoolTypeSelect = document.getElementById("school-type");
    
    const universityFields = document.getElementById("university-fields");
    const vocationalFields = document.getElementById("vocational-fields");
    const otherSchoolFields = document.getElementById("other-school-fields");
    const gradeField = document.getElementById("grade-field");
    
    const gradeSelect = document.getElementById("grade");

    // 必須チェック制御用の入力要素
    const universityInputs = universityFields ? universityFields.querySelectorAll("input") : [];
    const vocationalInputs = vocationalFields ? vocationalFields.querySelectorAll("input") : [];
    const otherSchoolInputs = otherSchoolFields ? otherSchoolFields.querySelectorAll("input, textarea") : [];

    // 学校種別の切り替え処理
    if (schoolTypeSelect) {
      schoolTypeSelect.addEventListener("change", (e) => {
        const selectedType = e.target.value;

        // --- リセット処理: 一旦すべて隠す & 必須属性を外す ---
        if(universityFields) universityFields.classList.add("hidden");
        universityInputs.forEach(input => input.required = false);
        
        if(vocationalFields) vocationalFields.classList.add("hidden");
        vocationalInputs.forEach(input => input.required = false);
        
        if(otherSchoolFields) otherSchoolFields.classList.add("hidden");
        otherSchoolInputs.forEach(input => input.required = false);
        
        if(gradeField) gradeField.classList.add("hidden");
        if(gradeSelect) gradeSelect.required = false;

        // --- 選択されたタイプに合わせて表示 & 必須属性付与 ---
        if (selectedType === "university") {
          if(universityFields) universityFields.classList.remove("hidden");
          universityInputs.forEach(input => input.required = true);
          if(gradeField) gradeField.classList.remove("hidden");
          if(gradeSelect) gradeSelect.required = true;

        } else if (selectedType === "vocational") {
          if(vocationalFields) vocationalFields.classList.remove("hidden");
          vocationalInputs.forEach(input => input.required = true);
          if(gradeField) gradeField.classList.remove("hidden");
          if(gradeSelect) gradeSelect.required = true;

        } else if (selectedType === "other") {
          if(otherSchoolFields) otherSchoolFields.classList.remove("hidden");
          otherSchoolInputs.forEach(input => input.required = true);
        }
      });
    }

    // プライバシーポリシー同意チェックによるボタン活性化
    if (submitButton) submitButton.disabled = true;
    if (privacyCheckbox && submitButton) {
      privacyCheckbox.addEventListener("change", () => {
        submitButton.disabled = !privacyCheckbox.checked;
      });
    }

    // 送信処理
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById("submitButton");
      if(submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "送信中...";
      }

      // 基本データ
      let data = {
        name: studentForm.name.value,
        schoolType: studentForm["school-type"].value,
        grade: studentForm.grade ? studentForm.grade.value : "",
        email: studentForm.email.value,
        interests: studentForm.interests.value,
        skills: studentForm.skills.value,
        timestamp: new Date().toISOString()
      };

      // 学校種別ごとのデータ追加
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

      // Firestoreへ保存
      addDoc(collection(db, "students"), data)
        .then(() => {
          alert("登録が完了しました！\nイベントや活動のご案内をお送りします。");
          studentForm.reset();
          
          // フォームの表示状態を初期化
          if(universityFields) universityFields.classList.add("hidden");
          if(vocationalFields) vocationalFields.classList.add("hidden");
          if(otherSchoolFields) otherSchoolFields.classList.add("hidden");
          if(gradeField) gradeField.classList.add("hidden");
          if(gradeSelect) gradeSelect.required = false;
          
          if (submitBtn) {
              submitBtn.textContent = "送信する";
              // 同意チェックが外れるためボタンは無効化のままにする
          }
        })
        .catch((error) => {
          alert("登録に失敗しました: " + error.message);
          console.error(error);
          if (submitBtn) {
              submitBtn.textContent = "送信する";
              submitBtn.disabled = false; // エラー時は再送信可能に
          }
        });
    });
  }


  // =========================================================================
  // 5. お知らせ (News) の読み込み処理
  // =========================================================================
  
  // (A) トップページ (index.html) のリスト用
  const newsListContainer = document.querySelector('.news-list');
  if (newsListContainer) {
    loadNewsForIndex(newsListContainer);
  }

  // (B) ニュース一覧ページ (news.html) のリスト用
  const newsListFullContainer = document.getElementById('news-list-full');
  if (newsListFullContainer) {
    loadNewsPage(newsListFullContainer);
  }
  
  // (C) ニュース詳細ページ (news-detail.html) の本文読み込み用
  // ※これが以前抜けていた可能性があります
  const newsDetailContainer = document.getElementById('news-detail-content');
  if (newsDetailContainer) {
    loadNewsDetail();
  }


  // =========================================================================
  // 6. プロジェクト・開発実績 (Projects) の読み込み処理
  // =========================================================================
  const projectListArea = document.getElementById('project-list-area');
  const portfolioGrid = document.getElementById('portfolio-grid');
  
  // どちらかのコンテナが存在するページなら実行
  if (projectListArea || portfolioGrid) {
    loadProjects();
  }

});


// =========================================================================
// 関数定義エリア
// =========================================================================

// --- [関数] トップページ用のお知らせ読み込み ---
async function loadNewsForIndex(container) {
  try {
    const q = query(collection(db, "news"), orderBy("date", "desc"), limit(5));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<li>お知らせはまだありません。</li>';
      return;
    }

    container.innerHTML = '';

    querySnapshot.forEach((docSnapshot) => {
      const news = docSnapshot.data();
      const docId = docSnapshot.id;
      const dateStr = news.date ? news.date.replace(/-/g, '/') : '';
      
      // リンク先の判定 logic
      let href = `news-detail.html?id=${docId}`;
      let target = "";

      // 内部リンクが設定されている場合
      if (news.internalUrl && !news.content) {
        href = news.internalUrl;
      } 
      // 外部リンクが設定されている場合
      else if (news.directUrl && !news.content) {
        href = news.directUrl;
        target = 'target="_blank"';
      }
      
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="date">${dateStr}</span>
        <a href="${href}" ${target}>
          ${news.title}
        </a>
      `;
      container.appendChild(li);
    });

  } catch (error) {
    console.error("お知らせ読み込みエラー:", error);
    container.innerHTML = '<li>読み込みに失敗しました。</li>';
  }
}

// --- [関数] ニュース一覧ページ用のお知らせ読み込み ---
async function loadNewsPage(container) {
  try {
    const q = query(collection(db, "news"), orderBy("date", "desc"), limit(30));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<p style="text-align:center">現在、お知らせはありません。</p>';
      return;
    }

    container.innerHTML = '';

    querySnapshot.forEach((docSnapshot) => {
      const news = docSnapshot.data();
      const docId = docSnapshot.id;
      const dateStr = news.date ? news.date.replace(/-/g, '/') : '';
      
      // 本文がなく、リンクのみのお知らせも表示する場合はここを調整
      // 今回は基本的にすべて表示
      
      let href = `news-detail.html?id=${docId}`;
      let target = "";

      if (news.internalUrl && !news.content) {
        href = news.internalUrl;
      } else if (news.directUrl && !news.content) {
        href = news.directUrl;
        target = 'target="_blank"';
      }
      
      const html = `
        <a href="${href}" class="news-item-link" ${target}>
          <article class="news-item">
            <p class="news-item-date">${dateStr}</p>
            <h3 class="news-item-title">${news.title}</h3>
          </article>
        </a>
      `;
      container.innerHTML += html;
    });

  } catch (error) {
    console.error("一覧読み込みエラー:", error);
    container.innerHTML = '<p style="text-align:center;">読み込みに失敗しました。</p>';
  }
}

// --- [関数] ニュース詳細ページの読み込み ---
async function loadNewsDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('news-title-area').textContent = "記事が見つかりません";
        return;
    }

    try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // タイトルや日付の反映
            const titleEl = document.getElementById('news-title-area');
            const dateEl = document.getElementById('news-date-area');
            const contentEl = document.getElementById('news-detail-content');
            
            if(titleEl) titleEl.textContent = data.title;
            if(dateEl) dateEl.textContent = data.date ? data.date.replace(/-/g, '/') : '';
            if(contentEl) {
                // 改行を<br>に変換
                contentEl.innerHTML = data.content ? data.content.replace(/\n/g, '<br>') : '';
            }
            
            // リンクボタンの表示（もしあれば）
            const linkArea = document.getElementById('news-links-area');
            if(linkArea && data.links) {
                let linksHtml = '';
                if(data.links.web) linksHtml += `<a href="${data.links.web}" target="_blank" class="sns-btn"><i class="fas fa-globe"></i> 公式サイト</a>`;
                if(data.links.instagram) linksHtml += `<a href="${data.links.instagram}" target="_blank" class="sns-btn"><i class="fab fa-instagram"></i> Instagram</a>`;
                if(data.links.x) linksHtml += `<a href="${data.links.x}" target="_blank" class="sns-btn"><i class="fab fa-twitter"></i> X (Twitter)</a>`;
                
                linkArea.innerHTML = linksHtml;
            }

        } else {
            document.getElementById('news-detail-content').innerHTML = "<p>該当するお知らせが見つかりませんでした。</p>";
        }
    } catch (error) {
        console.error("詳細読み込みエラー:", error);
    }
}


// --- [関数] プロジェクト・ポートフォリオ読み込み (完全振り分け版) ---
async function loadProjects() {
  const portfolioContainer = document.getElementById('portfolio-grid');
  const listContainer = document.getElementById('project-list-area');

  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      if(portfolioContainer) portfolioContainer.innerHTML = '<p style="text-align:center;width:100%;">実績はまだありません。</p>';
      if(listContainer) listContainer.innerHTML = '<p style="text-align:center;width:100%;">プロジェクトはまだありません。</p>';
      return;
    }

    if(portfolioContainer) portfolioContainer.innerHTML = '';
    if(listContainer) listContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // 共通URLボタン
      let urlBtn = '';
      if(data.url) {
        urlBtn = `<a href="${data.url}" target="_blank" class="proj-link-btn"><i class="fas fa-external-link-alt"></i> 詳細・サイトを見る</a>`;
      }

      // 共通ステータスバッジ
      let statusHtml = '<span class="status-badge status-active">活動中・運用中</span>';
      if(data.status === 'completed') {
          statusHtml = '<span class="status-badge status-completed">完了・終了</span>';
      }

      // ★振り分けロジック
      // type='portfolio' なら画像エリアへ。
      // ただし、画像が未入力(空文字)の場合はテキストのみのカードとして表示するか、
      // あるいはプレースホルダーを表示するか。ここでは「画像なし」でもレイアウトが崩れないようにします。
      
      const isPortfolio = data.type === 'portfolio';

      if (isPortfolio) {
          // =============================================
          // 開発実績 (Portfolio) エリアへの表示
          // =============================================
          if (portfolioContainer) {
              
              // 画像HTMLの生成 (画像がない場合は表示しない)
              let imgHtml = '';
              if (data.image && data.image.trim() !== "") {
                  imgHtml = `<div class="portfolio-img" style="background-image: url('${data.image}');"></div>`;
              } else {
                  // 画像がない場合の代替（必要ならコメントアウトを外してください）
                  // imgHtml = `<div class="portfolio-img" style="background-color:#eee; display:flex; align-items:center; justify-content:center; color:#888;"><span>No Image</span></div>`;
              }

              const html = `
                <div class="portfolio-card">
                    ${imgHtml}
                    <div class="portfolio-content">
                        <div class="portfolio-header">
                            <span class="proj-tag tag-dev">開発</span>
                            ${statusHtml}
                        </div>
                        <h3 class="portfolio-title">${data.title}</h3>
                        <p class="portfolio-desc">${data.description.replace(/\n/g, '<br>')}</p>
                        ${urlBtn}
                    </div>
                </div>`;
              portfolioContainer.innerHTML += html;
          }

      } else {
          // =============================================
          // 活動プロジェクト (List) エリアへの表示
          // =============================================
          if (listContainer) {
              let catLabel = 'その他';
              let catClass = 'tag-other';
              if(data.category === 'dev') { catLabel = '開発'; catClass = 'tag-dev'; }
              else if(data.category === 'edu') { catLabel = '教育'; catClass = 'tag-edu'; }
              else if(data.category === 'com') { catLabel = '交流'; catClass = 'tag-com'; }
              
              let cardClass = data.status === 'completed' ? 'project-completed' : '';

              const html = `
                <div class="project-card ${cardClass}">
                  <div class="proj-header">
                    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:0.5rem;">
                        <span class="proj-tag ${catClass}">${catLabel}</span>
                        ${statusHtml}
                    </div>
                    <h3 class="proj-title">${data.title}</h3>
                  </div>
                  <p class="proj-desc">${data.description.replace(/\n/g, '<br>')}</p>
                  ${urlBtn}
                </div>`;
              listContainer.innerHTML += html;
          }
      }
    });

  } catch (error) {
    console.error("プロジェクト読み込みエラー:", error);
    if(portfolioContainer) portfolioContainer.innerHTML = '<p>読み込みエラーが発生しました</p>';
    if(listContainer) listContainer.innerHTML = '<p>読み込みエラーが発生しました</p>';
  }
}

// =========================================================================
// 7. スライドショー (Slideshow)
// =========================================================================
const slideshows = document.querySelectorAll('.slideshow-container');

slideshows.forEach(slideshow => {
  const slides = slideshow.querySelectorAll('.slide');
  const prevButton = slideshow.querySelector('.prev');
  const nextButton = slideshow.querySelector('.next');
  let currentSlideIndex = 0;

  function showSlide(index) {
    slides.forEach(slide => {
      slide.classList.remove('active-slide');
      slide.style.display = 'none';
    });
    
    if(slides[index]) {
        slides[index].style.display = 'flex'; 
        slides[index].classList.add('active-slide');
    }
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentSlideIndex++;
      if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
      }
      showSlide(currentSlideIndex);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentSlideIndex--;
      if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
      }
      showSlide(currentSlideIndex);
    });
  }

  // 自動再生 (オプション)
  // setInterval(() => {
  //   currentSlideIndex++;
  //   if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
  //   showSlide(currentSlideIndex);
  // }, 5000);

  if (slides.length > 0) {
      showSlide(currentSlideIndex);
  }
});

// =========================================================================
// ★ 隠し機能：フッターのCopyrightを5回連打で管理画面へ
// =========================================================================
const secretDoor = document.getElementById("secret-door");
if (secretDoor) {
  let clickCount = 0;
  let timer;

  secretDoor.addEventListener("click", () => {
    clickCount++;
    console.log("Secret count: " + clickCount); // 確認用（本番では消してもOK）

    // 最初のクリックから2秒経過したらリセット
    clearTimeout(timer);
    timer = setTimeout(() => {
      clickCount = 0;
    }, 2000);

    // 5回クリックされたら発動
    if (clickCount >= 5) {
      alert("管理者認証：管理画面へ移動します");
      window.location.href = "admin.html"; // 移動先のファイル名
      clickCount = 0;
    }
  });
}