"use client"; // クライアント側の動き(メニュー開閉)があるため必要

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false); // スマホ用ドロップダウン管理

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveDropdown(!activeDropdown);
  };

  return (
    <>
      <header>
        <div className="container header-flex">
          <h1>
            <Link href="/" className="site-title" onClick={closeMenu}>
              {/* Next.jsでは画像はpublicフォルダからのパスになります */}
              <img src="/assets/logo.png" alt="しずおかコネクト ロゴ" className="header-logo" />
              <div className="title-text">
                地域と学生をつなぐ会<br /><span style={{ fontSize: '1.1em' }}>しずおかコネクト</span>
              </div>
            </Link>
          </h1>
          
          {/* PC用ナビゲーション */}
          <nav className="desktop-nav">
            <ul>
              <li><Link href="/">トップ</Link></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle">私たちについて <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem' }}></i></a>
                <ul className="dropdown-menu">
                  <li><Link href="/about">活動内容</Link></li>
                  <li><Link href="/members">メンバー紹介</Link></li>
                  <li><Link href="/advisors">特別顧問</Link></li>
                  <li><Link href="/partners">協賛企業・団体</Link></li>
                  <li><Link href="/news">お知らせ・発表</Link></li>
                </ul>
              </li>
              <li><Link href="/service" className="nav-btn-highlight">学生の方</Link></li>
              <li><Link href="/for-companies" className="nav-btn-highlight-outline">企業の方</Link></li>
              <li><Link href="/contact">お問い合わせ</Link></li>
            </ul>
          </nav>
          
          {/* ハンバーガーボタン */}
          <div 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            id="hamburger" 
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      </header>

      {/* スマホ用メニュー */}
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
        <div className="menu-close-btn" id="menu-close-btn" onClick={closeMenu}>
            <span></span>
            <span></span>
        </div>
        <ul>
           <li><Link href="/" onClick={closeMenu}>トップ</Link></li>
           <li className="dropdown-sp">
             <a href="#" className="dropdown-toggle-sp" onClick={toggleDropdown}>
                私たちについて <i className={`fas fa-chevron-down ${activeDropdown ? 'fa-rotate-180' : ''}`}></i>
             </a>
             <ul className={`dropdown-menu-sp ${activeDropdown ? 'show' : ''}`}>
               <li><Link href="/about" onClick={closeMenu}>- 活動内容</Link></li>
               <li><Link href="/members" onClick={closeMenu}>- メンバー紹介</Link></li>
               <li><Link href="/advisors" onClick={closeMenu}>- 特別顧問</Link></li>
               <li><Link href="/partners" onClick={closeMenu}>- 協賛企業・団体</Link></li>
               <li><Link href="/news" onClick={closeMenu}>- お知らせ・発表</Link></li>
             </ul>
           </li>
           <li><Link href="/service" onClick={closeMenu}>学生の方</Link></li>
           <li><Link href="/for-companies" onClick={closeMenu}>企業の方</Link></li>
           <li><Link href="/contact" onClick={closeMenu}>お問い合わせ</Link></li>
        </ul>
      </nav>
    </>
  );
}