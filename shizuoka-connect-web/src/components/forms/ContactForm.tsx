"use client";

import { useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, push } from 'firebase/database';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      timestamp: new Date().toISOString()
    };

    // GAS (Google Apps Script) のURL
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwm65W4QR-HnjtZuEsxWNa9B07W7U7p6wA9MYsNzjNlT_K0dU9Hai2YQI3_0fZJ7IkFYg/exec";

    try {
      // 1. Firebase Realtime Database に保存
      await push(ref(rtdb, "contacts"), data);

      // 2. GAS に送信 (no-corsモード)
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "お名前": data.name, 
            "件名": data.subject, 
            "メール": data.email, 
            "内容": data.message 
        })
      });

      alert("送信しました！");
      form.reset();
    } catch (err: any) {
      console.error(err);
      alert("送信失敗: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modern-form-wrapper">
        <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1A71BE' }}>お問い合わせフォーム</h3>
        <form className="form-section" onSubmit={handleSubmit}>
            <label htmlFor="name">お名前 <span style={{color:'red'}}>*</span></label>
            <input type="text" id="name" name="name" required placeholder="例: 山田 太郎" />
            
            <label htmlFor="email">メールアドレス <span style={{color:'red'}}>*</span></label>
            <input type="email" id="email" name="email" required placeholder="example@email.com" />
            
            <label htmlFor="subject">お問い合わせの種類 <span style={{color:'red'}}>*</span></label>
            <select id="subject" name="subject" required defaultValue="">
                <option value="" disabled>選択してください</option>
                <option value="学生の方：登録について">学生の方：登録について</option>
                <option value="企業の方：連携について">企業の方：連携について</option>
                <option value="イベントについて">イベントについて</option>
                <option value="その他">その他</option>
            </select>
            
            <label htmlFor="message">お問い合わせ内容 <span style={{color:'red'}}>*</span></label>
            <textarea id="message" name="message" rows={6} required placeholder="お問い合わせ内容をご記入ください"></textarea>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? "送信中..." : "送信する"}
                </button>
            </div>
        </form>
    </div>
  );
}