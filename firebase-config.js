// firebase-config.js
// ★shizuoka-connect (本番用) の設定に戻しました

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGQmrKoyRwza7JZJbbjf1xYN9oYQmpgDE",
  authDomain: "shizuokaconnect.firebaseapp.com",
  projectId: "shizuokaconnect",
  storageBucket: "shizuokaconnect.firebasestorage.app",
  messagingSenderId: "515798920710",
  appId: "1:515798920710:web:bb58037d0acad8a8605d87",
  measurementId: "G-C2ECY6KQJC",
  databaseURL: "https://shizuokaconnect-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);   // ニュース・学生データ用
export const auth = getAuth(app);      // 管理者ログイン用
export const rtdb = getDatabase(app);  // お問い合わせデータ用