"use client";

import { useState, useEffect } from 'react';
import { auth, db, rtdb } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { 
  collection, query, orderBy, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { ref, get, remove } from 'firebase/database';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

// データ型の定義 (簡易)
type NewsItem = { id: string; title: string; date: string; content?: string; image?: string; links?: any; directUrl?: string; internalUrl?: string; };
type ProjectItem = { id: string; title: string; description?: string; image?: string; url?: string; type?: string; category?: string; status?: string; order?: number; tagClass?: string; tagName?: string; };
type MapItem = { id: string; name: string; popup: string; iconType: string; lat: number; lng: number; };
type StudentItem = { id: string; name: string; email: string; timestamp?: any; [key: string]: any };
type InquiryItem = { id: string; name: string; subject: string; email: string; message: string; timestamp?: string; };

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('news-manage');
  const [loading, setLoading] = useState(false);

  // データリスト
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [featuredList, setFeaturedList] = useState<ProjectItem[]>([]); // top_projects
  const [devList, setDevList] = useState<ProjectItem[]>([]);      // projects (portfolio)
  const [actList, setActList] = useState<ProjectItem[]>([]);      // projects (others)
  const [mapList, setMapList] = useState<MapItem[]>([]);
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const [inquiryList, setInquiryList] = useState<InquiryItem[]>([]);

  // フォーム用State (編集モード管理)
  const [editId, setEditId] = useState<string | null>(null);
  
  // 各フォームの入力値管理
  const [newsForm, setNewsForm] = useState({ date: '', title: '', content: '', image: '', linkWeb: '', linkInsta: '', linkX: '', linkFb: '', directUrl: '', internalUrl: '' });
  const [featForm, setFeatForm] = useState({ title: '', tagColor: 'tag-recruit', tagText: '', image: '', desc: '', url: '', order: 1 });
  const [devForm, setDevForm] = useState({ title: '', status: 'active', order: 0, image: '', desc: '', url: '' });
  const [actForm, setActForm] = useState({ title: '', category: 'dev', status: 'active', order: 0, desc: '', url: '' });
  const [mapForm, setMapForm] = useState({ name: '', desc: '', type: 'dev', lat: 0, lng: 0 });

  // 認証監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadAllData();
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError('ログイン失敗: ' + err.message);
    }
  };

  const loadAllData = () => {
    fetchNews();
    fetchFeatured();
    fetchProjects(); // dev & act
    fetchMap();
    fetchStudents();
    fetchInquiries();
  };

  // --- 1. お知らせ管理 ---
  const fetchNews = async () => {
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    setNewsList(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem)));
  };

  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(editId ? "更新しますか？" : "投稿しますか？")) return;
    
    const data: any = {
      date: newsForm.date,
      title: newsForm.title,
      content: newsForm.content,
      image: newsForm.image,
      links: { web: newsForm.linkWeb, instagram: newsForm.linkInsta, x: newsForm.linkX, facebook: newsForm.linkFb },
      directUrl: newsForm.directUrl,
      internalUrl: newsForm.internalUrl
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "news", editId), data);
        alert("更新しました");
      } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, "news"), data);
        alert("投稿しました");
      }
      setNewsForm({ date: '', title: '', content: '', image: '', linkWeb: '', linkInsta: '', linkX: '', linkFb: '', directUrl: '', internalUrl: '' });
      setEditId(null);
      fetchNews();
    } catch (e:any) { alert("エラー: " + e.message); }
  };

  const editNews = (item: NewsItem) => {
    setEditId(item.id);
    setNewsForm({
      date: item.date, title: item.title, content: item.content || '', image: item.image || '',
      linkWeb: item.links?.web || '', linkInsta: item.links?.instagram || '', linkX: item.links?.x || '', linkFb: item.links?.facebook || '',
      directUrl: item.directUrl || '', internalUrl: item.internalUrl || ''
    });
    setActiveTab('news-manage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNews = async (id: string) => {
    if (confirm("削除しますか？")) { await deleteDoc(doc(db, "news", id)); fetchNews(); }
  };

  // --- 2. 注目プロジェクト (Featured) ---
  const fetchFeatured = async () => {
    const q = query(collection(db, "top_projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    setFeaturedList(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectItem)));
  };

  const saveFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(editId ? "更新しますか？" : "登録しますか？")) return;
    const data: any = {
      title: featForm.title, tagClass: featForm.tagColor, tagName: featForm.tagText,
      image: featForm.image, description: featForm.desc, url: featForm.url, order: Number(featForm.order)
    };
    try {
        if (editId) { await updateDoc(doc(db, "top_projects", editId), data); alert("更新しました"); }
        else { data.timestamp = serverTimestamp(); await addDoc(collection(db, "top_projects"), data); alert("登録しました"); }
        setFeatForm({ title: '', tagColor: 'tag-recruit', tagText: '', image: '', desc: '', url: '', order: 1 });
        setEditId(null); fetchFeatured();
    } catch (e:any) { alert(e.message); }
  };

  const editFeatured = (item: ProjectItem) => {
    setEditId(item.id);
    setFeatForm({
        title: item.title, tagColor: item.tagClass || 'tag-recruit', tagText: item.tagName || '',
        image: item.image || '', desc: item.description || '', url: item.url || '', order: item.order || 1
    });
    setActiveTab('featured');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFeatured = async (id: string) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "top_projects", id)); fetchFeatured(); }};

  // --- 3. プロジェクト (Dev & Activity) ---
  const fetchProjects = async () => {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    const devs: ProjectItem[] = [];
    const acts: ProjectItem[] = [];
    snap.forEach(d => {
        const data = d.data() as ProjectItem;
        data.id = d.id;
        if (data.type === 'portfolio') devs.push(data);
        else acts.push(data);
    });
    setDevList(devs);
    setActList(acts);
  };

  // 開発実績保存
  const saveDev = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(editId ? "更新しますか？" : "登録しますか？")) return;
    const data: any = {
        type: 'portfolio', category: 'dev',
        title: devForm.title, status: devForm.status, order: Number(devForm.order),
        image: devForm.image, description: devForm.desc, url: devForm.url
    };
    try {
        if(editId) { await updateDoc(doc(db, "projects", editId), data); alert("更新しました"); }
        else { data.createdAt = serverTimestamp(); await addDoc(collection(db, "projects"), data); alert("登録しました"); }
        setDevForm({ title: '', status: 'active', order: 0, image: '', desc: '', url: '' });
        setEditId(null); fetchProjects();
    } catch(e:any) { alert(e.message); }
  };

  // 活動プロジェクト保存
  const saveAct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(editId ? "更新しますか？" : "登録しますか？")) return;
    const data: any = {
        type: 'project',
        title: actForm.title, category: actForm.category, status: actForm.status, order: Number(actForm.order),
        description: actForm.desc, url: actForm.url, image: ""
    };
    try {
        if(editId) { await updateDoc(doc(db, "projects", editId), data); alert("更新しました"); }
        else { data.createdAt = serverTimestamp(); await addDoc(collection(db, "projects"), data); alert("登録しました"); }
        setActForm({ title: '', category: 'dev', status: 'active', order: 0, desc: '', url: '' });
        setEditId(null); fetchProjects();
    } catch(e:any) { alert(e.message); }
  };

  const editDev = (item: ProjectItem) => {
      setEditId(item.id);
      setDevForm({ title: item.title, status: item.status||'active', order: item.order||0, image: item.image||'', desc: item.description||'', url: item.url||'' });
      setActiveTab('dev-manage'); window.scrollTo({top:0, behavior:'smooth'});
  };
  const editAct = (item: ProjectItem) => {
      setEditId(item.id);
      setActForm({ title: item.title, category: item.category||'dev', status: item.status||'active', order: item.order||0, desc: item.description||'', url: item.url||'' });
      setActiveTab('act-manage'); window.scrollTo({top:0, behavior:'smooth'});
  };
  const deleteProject = async (id: string) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "projects", id)); fetchProjects(); }};

  // --- 4. マップ管理 ---
  const fetchMap = async () => {
    const snap = await getDocs(collection(db, "activityLocations"));
    setMapList(snap.docs.map(d => ({ id: d.id, ...d.data() } as MapItem)));
  };
  const saveMap = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!confirm(editId?"更新しますか？":"登録しますか？")) return;
      const data = { name: mapForm.name, popup: mapForm.desc, iconType: mapForm.type, lat: Number(mapForm.lat), lng: Number(mapForm.lng) };
      try {
          if(editId) { await updateDoc(doc(db, "activityLocations", editId), data); alert("更新しました"); }
          else { await addDoc(collection(db, "activityLocations"), data); alert("登録しました"); }
          setMapForm({ name: '', desc: '', type: 'dev', lat: 0, lng: 0 }); setEditId(null); fetchMap();
      } catch(e:any) { alert(e.message); }
  };
  const editMap = (item: MapItem) => {
      setEditId(item.id);
      setMapForm({ name: item.name, desc: item.popup, type: item.iconType, lat: item.lat, lng: item.lng });
      setActiveTab('map-manage'); window.scrollTo({top:0, behavior:'smooth'});
  };
  const deleteMap = async (id: string) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "activityLocations", id)); fetchMap(); }};

  // --- 5. 学生リスト (全件取得修正版) ---
  const fetchStudents = async () => {
    // orderByを使わず全件取得してJSでソート (Firestoreのインデックス欠け対策)
    const snap = await getDocs(collection(db, "students"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentItem));
    // 新しい順にソート
    list.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
    });
    setStudentList(list);
  };
  const deleteStudent = async (id: string) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "students", id)); fetchStudents(); }};

  // --- 6. お問い合わせ ---
  const fetchInquiries = async () => {
    const snap = await get(ref(rtdb, 'contacts'));
    if(snap.exists()) {
        const data = snap.val();
        const arr = Object.entries(data).map(([k, v]: any) => ({ id: k, ...v })).reverse();
        setInquiryList(arr);
    } else { setInquiryList([]); }
  };
  const deleteInquiry = async (id: string) => { if(confirm("削除しますか？")) { await remove(ref(rtdb, `contacts/${id}`)); fetchInquiries(); }};


  // --- 画面描画 ---
  if (!user) {
    return (
      <div className="admin-wrapper" style={{ marginTop: '4rem', maxWidth: '400px', margin: '4rem auto' }}>
        <div className="admin-card">
          <h2 style={{ textAlign: 'center' }}>管理者ログイン</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-submit">ログイン</button>
            {loginError && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label }: { id: string, label: string }) => (
    <button 
      className={`tab-btn ${activeTab === id ? 'active' : ''}`} 
      onClick={() => { setActiveTab(id); setEditId(null); }}
    >
      {label}
    </button>
  );

  return (
    <>
      <header>
        <div className="container header-flex">
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>管理者ダッシュボード</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link href="/" target="_blank" style={{ color: 'white', fontSize: '0.9rem', textDecoration: 'underline' }}>
                    <i className="fas fa-external-link-alt"></i> サイトを確認
                </Link>
                <button onClick={() => signOut(auth)} className="logout-btn">ログアウト</button>
            </div>
        </div>
      </header>

      <div className="admin-wrapper">
        <div className="tab-menu">
            <TabButton id="news-manage" label="お知らせ" />
            <TabButton id="featured" label="★注目プロジェクト" />
            <TabButton id="dev-manage" label="開発実績(アプリ)" />
            <TabButton id="act-manage" label="活動プロジェクト" />
            <TabButton id="map-manage" label="活動マップ" />
            <TabButton id="student-manage" label="学生リスト" />
            <TabButton id="inquiry-manage" label="お問い合わせ" />
        </div>

        {/* お知らせ管理 */}
        <div className={`tab-content ${activeTab === 'news-manage' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <h3 style={{ marginTop: 0, color: '#1A71BE' }}>{editId ? 'お知らせを編集' : 'お知らせ投稿'}</h3>
                <form onSubmit={saveNews}>
                    <div className="form-group"><label>日付 <span style={{color:'red'}}>*</span></label><input type="date" value={newsForm.date} onChange={e=>setNewsForm({...newsForm, date:e.target.value})} required /></div>
                    <div className="form-group"><label>タイトル <span style={{color:'red'}}>*</span></label><input type="text" value={newsForm.title} onChange={e=>setNewsForm({...newsForm, title:e.target.value})} required /></div>
                    
                    <div className="form-group">
                        <label>トップ画像 (任意)</label>
                        <div style={{display:'flex', gap:'10px'}}>
                            <input type="text" value={newsForm.image} onChange={e=>setNewsForm({...newsForm, image:e.target.value})} placeholder="画像URL" style={{flex:1}} />
                            <ImageUpload onUpload={(url) => setNewsForm({...newsForm, image: url})} />
                        </div>
                    </div>

                    <div className="form-group"><label>本文</label><textarea value={newsForm.content} onChange={e=>setNewsForm({...newsForm, content:e.target.value})} rows={6} placeholder="本文..." /></div>
                    
                    <div style={{background:'#f9f9f9', padding:'1rem', borderRadius:'4px', marginBottom:'1.5rem'}}>
                        <label style={{marginBottom:'0.5rem', display:'block'}}>関連リンク (任意)</label>
                        <div className="sns-input-group"><i className="fas fa-globe"></i><input type="url" value={newsForm.linkWeb} onChange={e=>setNewsForm({...newsForm, linkWeb:e.target.value})} placeholder="Web" /></div>
                        <div className="sns-input-group"><i className="fab fa-instagram"></i><input type="url" value={newsForm.linkInsta} onChange={e=>setNewsForm({...newsForm, linkInsta:e.target.value})} placeholder="Instagram" /></div>
                        <div className="sns-input-group"><i className="fab fa-twitter"></i><input type="url" value={newsForm.linkX} onChange={e=>setNewsForm({...newsForm, linkX:e.target.value})} placeholder="X" /></div>
                        <div className="sns-input-group"><i className="fab fa-facebook"></i><input type="url" value={newsForm.linkFb} onChange={e=>setNewsForm({...newsForm, linkFb:e.target.value})} placeholder="Facebook" /></div>
                        
                        <div style={{marginTop:'1rem', borderTop:'1px dashed #ccc', paddingTop:'1rem'}}>
                            <label style={{fontSize:'0.9rem'}}>詳細ページなしで移動する場合</label>
                            <div style={{marginBottom:'0.5rem'}}><input type="url" value={newsForm.directUrl} onChange={e=>setNewsForm({...newsForm, directUrl:e.target.value})} placeholder="外部URL (https://...)" /></div>
                            <div><input type="text" value={newsForm.internalUrl} onChange={e=>setNewsForm({...newsForm, internalUrl:e.target.value})} placeholder="内部URL (serviceなど)" /></div>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn-submit" style={{backgroundColor: editId ? '#28a745' : '#1A71BE'}}>{editId ? '更新する' : '投稿する'}</button>
                        {editId && <button type="button" className="btn-cancel" onClick={()=>{setEditId(null); setNewsForm({ date: '', title: '', content: '', image: '', linkWeb: '', linkInsta: '', linkX: '', linkFb: '', directUrl: '', internalUrl: '' });}}>キャンセル</button>}
                    </div>
                </form>
            </div>
            <div className="admin-card">
                <h3>投稿済みお知らせ</h3>
                <ul className="admin-list">
                    {newsList.map(item => (
                        <li key={item.id} className="admin-item">
                            <div className="item-header">
                                <div><span className="item-date">{item.date}</span><div className="item-title">{item.title}</div></div>
                                <div className="btn-group">
                                    <button className="btn-edit" onClick={()=>editNews(item)}>編集</button>
                                    <button className="btn-delete" onClick={()=>deleteNews(item.id)}>削除</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* 注目プロジェクト (Featured) */}
        <div className={`tab-content ${activeTab === 'featured' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <h3 style={{ marginTop: 0, color: '#e74c3c' }}>{editId ? '注目プロジェクトを編集' : '★トップ注目プロジェクト登録'}</h3>
                <form onSubmit={saveFeatured}>
                    <div className="form-group"><label>タイトル</label><input type="text" value={featForm.title} onChange={e=>setFeatForm({...featForm, title:e.target.value})} required /></div>
                    <div className="form-group" style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}><label>タグ色</label>
                            <select value={featForm.tagColor} onChange={e=>setFeatForm({...featForm, tagColor:e.target.value})}>
                                <option value="tag-recruit">赤 (募集中)</option><option value="tag-edu">橙 (教育)</option><option value="tag-dev">青 (開発)</option><option value="tag-other">灰 (その他)</option>
                            </select>
                        </div>
                        <div style={{flex:1}}><label>タグ文字</label><input type="text" value={featForm.tagText} onChange={e=>setFeatForm({...featForm, tagText:e.target.value})} /></div>
                    </div>
                    <div className="form-group">
                        <label>画像</label>
                        <div style={{display:'flex', gap:'10px'}}>
                            <input type="text" value={featForm.image} onChange={e=>setFeatForm({...featForm, image:e.target.value})} style={{flex:1}} />
                            <ImageUpload onUpload={(url) => setFeatForm({...featForm, image: url})} />
                        </div>
                    </div>
                    <div className="form-group"><label>説明</label><textarea value={featForm.desc} onChange={e=>setFeatForm({...featForm, desc:e.target.value})} rows={3} required /></div>
                    <div className="form-group"><label>表示順</label><input type="number" value={featForm.order} onChange={e=>setFeatForm({...featForm, order:Number(e.target.value)})} /></div>
                    <div>
                        <button type="submit" className="btn-submit" style={{backgroundColor:'#e74c3c'}}>{editId?'更新':'トップに表示'}</button>
                        {editId && <button type="button" className="btn-cancel" onClick={()=>{setEditId(null); setFeatForm({ title: '', tagColor: 'tag-recruit', tagText: '', image: '', desc: '', url: '', order: 1 });}}>キャンセル</button>}
                    </div>
                </form>
            </div>
            <div className="admin-card">
                <h3>掲載中の注目プロジェクト</h3>
                <ul className="admin-list">
                    {featuredList.map(item => (
                        <li key={item.id} className="admin-item">
                            <div className="item-header">
                                <div style={{display:'flex', alignItems:'center'}}>
                                    {item.image && <img src={item.image} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'4px', marginRight:'10px'}} />}
                                    <div><span className="item-date">順序:{item.order}</span><div className="item-title" style={{color:'#e74c3c'}}>{item.title}</div></div>
                                </div>
                                <div className="btn-group"><button className="btn-edit" onClick={()=>editFeatured(item)}>編集</button><button className="btn-delete" onClick={()=>deleteFeatured(item.id)}>削除</button></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* 開発実績 (Dev) */}
        <div className={`tab-content ${activeTab === 'dev-manage' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <h3 style={{ marginTop: 0, color: '#1A71BE' }}>{editId ? '実績を編集' : '開発実績の登録'}</h3>
                <form onSubmit={saveDev}>
                    <div className="form-group"><label>アプリ名</label><input type="text" value={devForm.title} onChange={e=>setDevForm({...devForm, title:e.target.value})} required /></div>
                    <div className="form-group" style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}><label>状況</label><select value={devForm.status} onChange={e=>setDevForm({...devForm, status:e.target.value})}><option value="active">公開中</option><option value="completed">終了</option></select></div>
                        <div style={{flex:1}}><label>順序</label><input type="number" value={devForm.order} onChange={e=>setDevForm({...devForm, order:Number(e.target.value)})} /></div>
                    </div>
                    <div className="form-group">
                        <label>画像 (任意)</label>
                        <div style={{display:'flex', gap:'10px'}}>
                            <input type="text" value={devForm.image} onChange={e=>setDevForm({...devForm, image:e.target.value})} style={{flex:1}} />
                            <ImageUpload onUpload={(url) => setDevForm({...devForm, image: url})} />
                        </div>
                    </div>
                    <div className="form-group"><label>説明</label><textarea value={devForm.desc} onChange={e=>setDevForm({...devForm, desc:e.target.value})} rows={3} required /></div>
                    <div className="form-group"><label>URL</label><input type="url" value={devForm.url} onChange={e=>setDevForm({...devForm, url:e.target.value})} /></div>
                    <div>
                        <button type="submit" className="btn-submit" style={{backgroundColor:editId?'#28a745':'#1A71BE'}}>{editId?'更新':'登録'}</button>
                        {editId && <button type="button" className="btn-cancel" onClick={()=>{setEditId(null); setDevForm({ title: '', status: 'active', order: 0, image: '', desc: '', url: '' });}}>キャンセル</button>}
                    </div>
                </form>
            </div>
            <div className="admin-card">
                <h3>登録済み実績</h3>
                <ul className="admin-list">
                    {devList.map(item => (
                        <li key={item.id} className="admin-item">
                            <div className="item-header"><div><div className="item-title">{item.title}</div></div><div className="btn-group"><button className="btn-edit" onClick={()=>editDev(item)}>編集</button><button className="btn-delete" onClick={()=>deleteProject(item.id)}>削除</button></div></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* 活動プロジェクト (Activity) */}
        <div className={`tab-content ${activeTab === 'act-manage' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <h3 style={{ marginTop: 0, color: '#1A71BE' }}>{editId ? '活動を編集' : '活動プロジェクトの登録'}</h3>
                <form onSubmit={saveAct}>
                    <div className="form-group"><label>プロジェクト名</label><input type="text" value={actForm.title} onChange={e=>setActForm({...actForm, title:e.target.value})} required /></div>
                    <div className="form-group" style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}><label>カテゴリ</label><select value={actForm.category} onChange={e=>setActForm({...actForm, category:e.target.value})}><option value="dev">開発</option><option value="edu">教育</option><option value="com">交流</option><option value="other">その他</option></select></div>
                        <div style={{flex:1}}><label>状況</label><select value={actForm.status} onChange={e=>setActForm({...actForm, status:e.target.value})}><option value="active">活動中</option><option value="completed">終了</option></select></div>
                        <div style={{flex:1}}><label>順序</label><input type="number" value={actForm.order} onChange={e=>setActForm({...actForm, order:Number(e.target.value)})} /></div>
                    </div>
                    <div className="form-group"><label>詳細</label><textarea value={actForm.desc} onChange={e=>setActForm({...actForm, desc:e.target.value})} rows={3} required /></div>
                    <div className="form-group"><label>URL</label><input type="url" value={actForm.url} onChange={e=>setActForm({...actForm, url:e.target.value})} /></div>
                    <div>
                        <button type="submit" className="btn-submit" style={{backgroundColor:editId?'#28a745':'#1A71BE'}}>{editId?'更新':'登録'}</button>
                        {editId && <button type="button" className="btn-cancel" onClick={()=>{setEditId(null); setActForm({ title: '', category: 'dev', status: 'active', order: 0, desc: '', url: '' });}}>キャンセル</button>}
                    </div>
                </form>
            </div>
            <div className="admin-card">
                <h3>登録済みプロジェクト</h3>
                <ul className="admin-list">
                    {actList.map(item => (
                        <li key={item.id} className="admin-item">
                            <div className="item-header"><div><div className="item-title">{item.title}</div></div><div className="btn-group"><button className="btn-edit" onClick={()=>editAct(item)}>編集</button><button className="btn-delete" onClick={()=>deleteProject(item.id)}>削除</button></div></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* マップ管理 */}
        <div className={`tab-content ${activeTab === 'map-manage' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <h3 style={{ marginTop: 0, color: '#1A71BE' }}>{editId ? '地点を編集' : 'マップ地点の登録'}</h3>
                <form onSubmit={saveMap}>
                    <div className="form-group"><label>場所名</label><input type="text" value={mapForm.name} onChange={e=>setMapForm({...mapForm, name:e.target.value})} required /></div>
                    <div className="form-group"><label>説明</label><input type="text" value={mapForm.desc} onChange={e=>setMapForm({...mapForm, desc:e.target.value})} required /></div>
                    <div className="form-group"><label>タイプ</label><select value={mapForm.type} onChange={e=>setMapForm({...mapForm, type:e.target.value})}><option value="dev">開発(青)</option><option value="edu">教室(黄)</option><option value="com">交流(赤)</option><option value="partner">協力(緑)</option></select></div>
                    <div className="form-group" style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}><label>緯度</label><input type="number" step="0.000001" value={mapForm.lat} onChange={e=>setMapForm({...mapForm, lat:Number(e.target.value)})} required /></div>
                        <div style={{flex:1}}><label>経度</label><input type="number" step="0.000001" value={mapForm.lng} onChange={e=>setMapForm({...mapForm, lng:Number(e.target.value)})} required /></div>
                    </div>
                    <div>
                        <button type="submit" className="btn-submit" style={{backgroundColor:editId?'#28a745':'#1A71BE'}}>{editId?'更新':'登録'}</button>
                        {editId && <button type="button" className="btn-cancel" onClick={()=>{setEditId(null); setMapForm({ name: '', desc: '', type: 'dev', lat: 0, lng: 0 });}}>キャンセル</button>}
                    </div>
                </form>
            </div>
            <div className="admin-card">
                <h3>登録済み地点</h3>
                <ul className="admin-list">
                    {mapList.map(item => (
                        <li key={item.id} className="admin-item">
                            <div className="item-header"><div><div className="item-title">{item.name}</div><span className="item-date">{item.iconType}</span></div><div className="btn-group"><button className="btn-edit" onClick={()=>editMap(item)}>編集</button><button className="btn-delete" onClick={()=>deleteMap(item.id)}>削除</button></div></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* 学生リスト */}
        <div className={`tab-content ${activeTab === 'student-manage' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <div style={{display:'flex', justifyContent:'space-between'}}><h3>登録学生 ({studentList.length}人)</h3><button className="btn-submit" style={{width:'auto', padding:'5px 15px'}} onClick={fetchStudents}>更新</button></div>
                <ul className="admin-list">
                    {studentList.length === 0 ? <li style={{padding:'1rem'}}>データなし</li> : studentList.map(st => (
                        <li key={st.id} className="admin-item" style={{position:'relative'}}>
                            <button onClick={()=>deleteStudent(st.id)} style={{position:'absolute', top:'10px', right:'10px', background:'#e74c3c', color:'white', border:'none', borderRadius:'4px', padding:'3px 8px', cursor:'pointer'}}>削除</button>
                            <div className="item-header"><div><span className="item-date">{st.timestamp ? new Date(st.timestamp).toLocaleString() : ''}</span><div className="item-title">{st.name}</div></div></div>
                            <div className="item-details">
                                <strong>所属:</strong> {st.university || st.schoolName || st.schoolDetails} {st.faculty} {st.department} {st.grade ? `(${st.grade}年)` : ''}<br/>
                                <strong>Email:</strong> {st.email}<br/>
                                <strong>興味:</strong> {st.interests}<br/>
                                <strong>スキル:</strong> {st.skills}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* お問い合わせ */}
        <div className={`tab-content ${activeTab === 'inquiry-manage' ? '' : 'hidden'}`}>
            <div className="admin-card">
                <div style={{display:'flex', justifyContent:'space-between'}}><h3>お問い合わせ ({inquiryList.length}件)</h3><button className="btn-submit" style={{width:'auto', padding:'5px 15px'}} onClick={fetchInquiries}>更新</button></div>
                <ul className="admin-list">
                    {inquiryList.length === 0 ? <li style={{padding:'1rem'}}>データなし</li> : inquiryList.map(inq => (
                        <li key={inq.id} className="admin-item" style={{position:'relative'}}>
                            <button onClick={()=>deleteInquiry(inq.id)} style={{position:'absolute', top:'10px', right:'10px', background:'#e74c3c', color:'white', border:'none', borderRadius:'4px', padding:'3px 8px', cursor:'pointer'}}>削除</button>
                            <div className="item-header"><div><span className="item-date">{inq.timestamp ? new Date(inq.timestamp).toLocaleString() : ''}</span><div className="item-title">{inq.subject}</div></div></div>
                            <div className="item-details"><strong>{inq.name}</strong><br/><a href={`mailto:${inq.email}`}>{inq.email}</a><div style={{marginTop:'0.5rem', borderTop:'1px dashed #ccc', paddingTop:'0.5rem'}}>{inq.message}</div></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

      </div>
    </>
  );
}