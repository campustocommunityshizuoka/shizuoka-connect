"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // 2秒間クリックがなければカウントをリセット（連打判定のため）
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      // 5回到達したら管理画面へ
      router.push('/admin');
      setClickCount(0); // リセット
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {/* ここに隠しコマンドを設定 */}
          <p 
            id="secret-door" 
            onClick={handleSecretClick}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            © 2026 地域と学生をつなぐ会 しずおかコネクト
          </p>
          <div className="footer-links">
            <a href="https://www.instagram.com/shizuoka_connect?igsh=OXMyazhjcWQ0aW8y" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:campustocommunityshizuoka@gmail.com">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}