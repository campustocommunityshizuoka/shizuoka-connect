import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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

// サーバーサイド(Edge)で navigator が定義されていない場合、ダミーを定義して
// Firebase SDK がエラーになるのを防ぎます。
if (typeof globalThis.navigator === 'undefined') {
  // @ts-ignore
  globalThis.navigator = { 
    userAgent: 'node',
    // 必要に応じて他のプロパティも追加できますが、基本はこれでOK
  };
}

// SSR環境での多重初期化防止
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);