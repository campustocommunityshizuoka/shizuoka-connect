import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
// Realtime Database (お問い合わせフォーム用)
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
// Firestore (学生登録サービス用)
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


window.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // 複数のスマホ用ドロップダウンメニューが、1つ開いたら他は閉じるように修正
  const dropdownTogglesSp = document.querySelectorAll('.dropdown-toggle-sp');
  const allDropdownMenusSp = document.querySelectorAll('.dropdown-menu-sp');

  dropdownTogglesSp.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); // リンクのデフォルト動作を停止
      
      // クリックされたメニューを特定
      const currentMenu = toggle.nextElementSibling;
      
      // 他のすべてのメニューを一旦閉じる
      allDropdownMenusSp.forEach(menu => {
        // もし、今ループしているメニューが、クリックされたメニューと違うものであれば
        if (menu !== currentMenu) {
          menu.classList.remove('show'); // showクラスを削除して閉じる
        }
      });
      
      // クリックされたメニューの表示/非表示を切り替える
      currentMenu.classList.toggle('show');
    });
  });
  
  // =========================================================================
  // ⭐ Firebase設定 (databaseURLを追加し、shizuokaconnect の情報に統一)
  // =========================================================================
  const firebaseConfig = {
    apiKey: "AIzaSyDGQmrKoyRwza7JZJbbjf1xYN9oYQmpgDE", // shizuokaconnect のAPIキー
    authDomain: "shizuokaconnect.firebaseapp.com",
    projectId: "shizuokaconnect",
    storageBucket: "shizuokaconnect.firebasestorage.app",
    messagingSenderId: "515798920710",
    appId: "1:515798920710:web:bb58037d0acad8a8605d87",
    measurementId: "G-C2ECY6KQJC",
    // Realtime Databaseに必須の設定
    databaseURL: "https://shizuokaconnect-default-rtdb.firebaseio.com" 
  };
  
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


  // =========================================================================
  // ⭐ お問い合わせフォーム (contact.html) の処理 - Realtime Databaseに送信
  // =========================================================================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const database = getDatabase(app); 

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
        timestamp: new Date().toISOString() // 送信日時を追加
      };

      // Realtime Databaseの 'contacts' パスにデータをプッシュ
      const contactsRef = ref(database, "contacts");
      const newContactRef = push(contactsRef); // 自動でIDを生成

      set(newContactRef, data)
        .then(() => {
          alert("お問い合わせ内容を送信しました！確認後、折り返しご連絡いたします。");
          contactForm.reset();
        })
        .catch((error) => {
          alert("送信に失敗しました: " + error.message);
          console.error(error);
        });
    });
  }


  // =========================================================================
  // ⭐ 学生登録フォーム (service.html) の処理 - Firestoreに送信
  // =========================================================================
  const studentForm = document.getElementById("studentForm");
  if (studentForm) {
    const db = getFirestore(app); // Firestoreのインスタンスを取得
    
    // 解説1：操作したいHTML要素（チェックボックスとボタン）を取得します
    const privacyCheckbox = document.getElementById("privacy-agreement");
    const submitButton = document.getElementById("submitButton");

    // ▼ ここから追加 ▼
    // 条件分岐フォームのための要素を取得
    const schoolTypeSelect = document.getElementById("school-type");
    const universityFields = document.getElementById("university-fields");
    const vocationalFields = document.getElementById("vocational-fields");
    const otherSchoolFields = document.getElementById("other-school-fields");
    const gradeField = document.getElementById("grade-field"); // ★学年フィールドのdivを追加
    const gradeSelect = document.getElementById("grade"); // ★学年セレクトボックスを追加

    // 各グループ内の入力欄を取得（required属性の切り替え用）
    const universityInputs = universityFields.querySelectorAll("input");
    const vocationalInputs = vocationalFields.querySelectorAll("input");
    const otherSchoolInputs = otherSchoolFields.querySelectorAll("input, textarea"); // input と textarea の両方を対象にする

    // 所属区分が変更されたときの処理
    if (schoolTypeSelect) {
      schoolTypeSelect.addEventListener("change", (e) => {
        const selectedType = e.target.value;

        // すべての入力欄グループを一旦非表示にし、必須属性を解除
        universityFields.classList.add("hidden");
        universityInputs.forEach(input => input.required = false);

        vocationalFields.classList.add("hidden");
        vocationalInputs.forEach(input => input.required = false);
        
        otherSchoolFields.classList.add("hidden");
        otherSchoolInputs.forEach(input => input.required = false);

        // ▼ ここから追加 ▼
        // 学年フィールドも一旦非表示にし、必須属性を解除
        gradeField.classList.add("hidden");
        gradeSelect.required = false;
        // ▲ ここまで追加 ▲

        // 選択された区分に応じて表示を切り替え、必須属性を設定
        if (selectedType === "university") {
          universityFields.classList.remove("hidden");
          universityInputs.forEach(input => input.required = true);
          
          // ▼ ここから追加 ▼
          // 学年フィールドを表示し、必須属性を設定
          gradeField.classList.remove("hidden");
          gradeSelect.required = true;
          // ▲ ここまで追加 ▲

        } else if (selectedType === "vocational") {
          vocationalFields.classList.remove("hidden");
          vocationalInputs.forEach(input => input.required = true);

          // ▼ ここから追加 ▼
          // 学年フィールドを表示し、必須属性を設定
          gradeField.classList.remove("hidden");
          gradeSelect.required = true;
          // ▲ ここまで追加 ▲

        } else if (selectedType === "other") {
          otherSchoolFields.classList.remove("hidden");
          otherSchoolInputs.forEach(input => input.required = true);
          // (学年フィールドは非表示のまま)
        }
      });
    }
    // ▲ ここまで追加 ▲

    // 解説2：ページ読み込み時に、まずボタンを押せないように設定します
    if (submitButton) {
      submitButton.disabled = true;
    }

    // 解説3：チェックボックスで変更があるたびに、中の処理を実行します
    if (privacyCheckbox && submitButton) {
      privacyCheckbox.addEventListener("change", () => {
        // 解説4：チェックボックスにチェックが入っていればボタンを有効に、入っていなければ無効にします
        submitButton.disabled = !privacyCheckbox.checked;
      });
    }

    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // ▼ ここから変更 ▼
      // 基本データを収集
      let data = {
        name: studentForm.name.value,
        schoolType: studentForm["school-type"].value,
        grade: studentForm.grade.value,
        email: studentForm.email.value,
        interests: studentForm.interests.value,
        skills: studentForm.skills.value,
        timestamp: new Date().toISOString() // 送信日時を追加
      };

      // 選択された所属区分に応じて、追加データを収集
      if (data.schoolType === "university") {
        data.university = studentForm.university.value;
        data.faculty = studentForm.faculty.value;
        data.department = studentForm.department.value;
      } else if (data.schoolType === "vocational") {
        data.schoolName = studentForm["vocational-school"].value;
        data.major = studentForm.major.value;
      } else if (data.schoolType === "other") {
        // ▼ ここから変更 (旧コードを削除) ▼
        data.schoolDetails = studentForm["other-school-details"].value; // 1つのtextareaから取得するように変更
        // ▲ ここまで変更 ▲
      }
      // ▲ ここまで変更 ▲

      addDoc(collection(db, "students"), data)
        .then(() => {
          alert("登録が完了しました！");
          studentForm.reset();

          // ▼ ここから追加 ▼
          // フォームリセット後、条件分岐フィールドも非表示に戻す
          universityFields.classList.add("hidden");
          vocationalFields.classList.add("hidden");
          otherSchoolFields.classList.add("hidden");
          gradeField.classList.add("hidden"); // ★学年フィールドも非表示に
          gradeSelect.required = false; // ★学年の必須属性も解除
          // ▲ ここまで追加 ▲

          // 解説6：送信後、チェックが外れるので再度ボタンを無効化します
          if (submitButton) {
            submitButton.disabled = true;
          }
        })
        .catch((error) => {
          alert("登録に失敗しました: " + error.message);
          console.error(error);
        });
    });
  }
});
// =========================================================================
// ⭐ パートナーカード スライドショーロジック
// =========================================================================
// ページ上のすべてのスライドショーコンテナを見つける
const slideshows = document.querySelectorAll('.slideshow-container');

// 各スライドショーを個別に設定する
slideshows.forEach(slideshow => {
  const slides = slideshow.querySelectorAll('.slide');
  const prevButton = slideshow.querySelector('.prev');
  const nextButton = slideshow.querySelector('.next');
  let currentSlideIndex = 0;

  // 特定のスライドを表示する関数
  function showSlide(index) {
    // まずすべてのスライドを非表示にする
    slides.forEach(slide => {
      slide.classList.remove('active-slide');
      slide.style.display = 'none'; // 確実に非表示にする
    });
    // 要求されたスライドを表示する
    slides[index].style.display = 'block';
    slides[index].classList.add('active-slide');
  }

  // 「次へ」ボタンのイベントリスナー
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentSlideIndex++;
      // 最後のスライドを超えたら、最初のスライドに戻る
      if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
      }
      showSlide(currentSlideIndex);
    });
  }

  // 「前へ」ボタンのイベントリスナー
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentSlideIndex--;
      // 最初のスライドより前に進んだら、最後のスライドにループする
      if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
      }
      showSlide(currentSlideIndex);
    });
  }

  // ページ読み込み時に最初のスライドを初期表示する
  if (slides.length > 0) {
      showSlide(currentSlideIndex);
  }
});