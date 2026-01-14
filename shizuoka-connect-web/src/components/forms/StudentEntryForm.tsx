"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function StudentEntryForm() {
  const [schoolType, setSchoolType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacyChecked) return;
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // 基本データ
    const data: any = {
      name: formData.get('name'),
      schoolType: formData.get('school-type'),
      email: formData.get('email'),
      interests: formData.get('interests'),
      skills: formData.get('skills'),
      grade: formData.get('grade') || "", // 大学・専門のみ
      timestamp: new Date().toISOString()
    };

    // 学校種別ごとの追加データ
    if (data.schoolType === "university") {
        data.university = formData.get('university');
        data.faculty = formData.get('faculty');
        data.department = formData.get('department');
    } else if (data.schoolType === "vocational") {
        data.schoolName = formData.get('vocational-school');
        data.major = formData.get('major');
    } else if (data.schoolType === "other") {
        data.schoolDetails = formData.get('other-school-details');
    }

    try {
      await addDoc(collection(db, "students"), data);
      alert("登録完了しました！");
      form.reset();
      setSchoolType(""); // 入力欄表示をリセット
      setPrivacyChecked(false);
    } catch (err: any) {
      console.error(err);
      alert("エラー: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modern-form-wrapper">
        <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1A71BE' }}>学生登録フォーム</h3>
        
        <form className="form-section" onSubmit={handleSubmit}>
            <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <label htmlFor="name">名前 <span style={{color:'red'}}>*</span></label>
                <input type="text" id="name" name="name" required placeholder="例: 静岡 花子" />

                <label htmlFor="school-type">所属区分 <span style={{color:'red'}}>*</span></label>
                <select 
                    id="school-type" 
                    name="school-type" 
                    required 
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value)}
                >
                    <option value="" disabled>選択してください</option>
                    <option value="university">大学</option>
                    <option value="vocational">専門学校</option>
                    <option value="other">その他</option>
                </select>

                {/* 大学の場合 */}
                {schoolType === 'university' && (
                    <div id="university-fields" className="form-field-group">
                        <label htmlFor="university">大学名</label>
                        <input type="text" id="university" name="university" placeholder="例: 静岡大学" required />
                        <label htmlFor="faculty">学部</label>
                        <input type="text" id="faculty" name="faculty" required />
                        <label htmlFor="department">学科</label>
                        <input type="text" id="department" name="department" required />
                    </div>
                )}

                {/* 専門学校の場合 */}
                {schoolType === 'vocational' && (
                    <div id="vocational-fields" className="form-field-group">
                        <label htmlFor="vocational-school">学校名</label>
                        <input type="text" id="vocational-school" name="vocational-school" required />
                        <label htmlFor="major">専攻・コース名</label>
                        <input type="text" id="major" name="major" required />
                    </div>
                )}

                 {/* その他の場合 */}
                 {schoolType === 'other' && (
                    <div id="other-school-fields" className="form-field-group">
                        <label htmlFor="other-school-details">所属情報</label>
                        <textarea id="other-school-details" name="other-school-details" rows={2} placeholder="学校名、学部、学科、研究室など" required></textarea>
                    </div>
                )}
                
                {/* 学年 (大学・専門のみ表示) */}
                {(schoolType === 'university' || schoolType === 'vocational') && (
                    <div id="grade-field">
                        <label htmlFor="grade">学年</label>
                        <select id="grade" name="grade">
                            <option value="1">1年</option>
                            <option value="2">2年</option>
                            <option value="3">3年</option>
                            <option value="4">4年</option>
                            <option value="other">その他</option>
                        </select>
                    </div>
                )}
            </div>

            <label htmlFor="email">メールアドレス <span style={{color:'red'}}>*</span></label>
            <input type="email" id="email" name="email" required placeholder="連絡のつきやすいアドレス" />
            
            <label htmlFor="interests">興味・関心 <span style={{color:'red'}}>*</span></label>
            <textarea id="interests" name="interests" rows={3} required placeholder="例: イベント企画、Webデザイン、子どもへの指導、地域活性化など"></textarea>
            
            <label htmlFor="skills">持っているスキル・資格 <span style={{color:'red'}}>*</span></label>
            <textarea id="skills" name="skills" rows={2} required placeholder="例: HTML/CSS, 動画編集, 英語(日常会話), 普通自動車免許"></textarea>

            <div className="privacy-policy-container" style={{ marginTop: '2rem' }}>
              <div className="privacy-policy-box">
                <h4>個人情報の取扱いについて</h4>
                <p>
                  ご入力いただいた個人情報は、地域と学生をつなぐ会 しずおかコネクトが、登録いただいた内容で得意を生かせる場所を提供する目的で利用します。<br />
                  当会は、ご本人の同意がある場合または法令に基づく場合を除き、取得した個人情報を第三者に提供することはありません。
                </p>
              </div>
              <div className="form-group-checkbox" style={{ marginTop: '10px' }}>
                <input 
                    type="checkbox" 
                    id="privacy-agreement" 
                    name="privacy-agreement" 
                    required 
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                />
                <label htmlFor="privacy-agreement" style={{ display: 'inline', marginLeft: '5px' }}>個人情報の取扱いについて同意する</label>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button type="submit" id="submitButton" className="btn-submit" disabled={!privacyChecked || isSubmitting}>
                    {isSubmitting ? "送信中..." : "登録する"}
                </button>
            </div>
        </form>
    </div>
  );
}