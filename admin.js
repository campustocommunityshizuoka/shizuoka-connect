// admin.js

import { db, auth, rtdb } from './firebase-config.js';
import { 
    collection, addDoc, serverTimestamp, 
    doc, deleteDoc, updateDoc, getDoc, getDocs, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-button');

const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.remove('hidden');
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        
        fetchNews();      
        fetchProjects(); // 両方を読み込む
        fetchMapLocations();
        fetchStudents();  
        fetchInquiries(); 
    } else {
        loginSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, document.getElementById('login-email').value, document.getElementById('login-password').value);
    } catch (error) {
        alert("ログイン失敗: " + error.message);
    }
});
logoutBtn.addEventListener('click', async () => { if(confirm("ログアウトしますか？")) await signOut(auth); });

// =========================================================================
// お知らせ (News)
// =========================================================================
const newsForm = document.getElementById('news-form');
const newsListContainer = document.getElementById('news-list-container');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
let editingNewsId = null;

newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newsData = {
        date: document.getElementById('news-date').value,
        title: document.getElementById('news-title').value,
        content: document.getElementById('news-content').value || "",
        links: {
            web: document.getElementById('link-web').value || "",
            instagram: document.getElementById('link-insta').value || "",
            x: document.getElementById('link-x').value || "",
            facebook: document.getElementById('link-fb').value || ""
        },
        directUrl: document.getElementById('news-url').value || "",
        internalUrl: document.getElementById('news-internal-url').value || "",
    };
    try {
        if (editingNewsId) {
            if(!confirm("更新しますか？")) return;
            await updateDoc(doc(db, 'news', editingNewsId), newsData);
            alert("更新しました");
        } else {
            if(!confirm("投稿しますか？")) return;
            newsData.createdAt = serverTimestamp();
            await addDoc(collection(db, 'news'), newsData);
            alert("投稿しました");
        }
        resetForm(); fetchNews();
    } catch (error) { alert("エラー: " + error.message); }
});

cancelEditButton.addEventListener('click', resetForm);
function resetForm() {
    newsForm.reset(); editingNewsId = null;
    submitButton.textContent = "投稿する"; submitButton.style.backgroundColor = ""; formTitle.textContent = "お知らせ投稿"; cancelEditButton.classList.add('hidden');
}

async function handleEditNews(id) {
    const docSnap = await getDoc(doc(db, "news", id));
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('news-date').value = data.date;
        document.getElementById('news-title').value = data.title;
        document.getElementById('news-content').value = data.content || "";
        document.getElementById('news-url').value = data.directUrl || "";
        document.getElementById('news-internal-url').value = data.internalUrl || "";
        if(data.links) {
            document.getElementById('link-web').value = data.links.web || "";
            document.getElementById('link-insta').value = data.links.instagram || "";
            document.getElementById('link-x').value = data.links.x || "";
            document.getElementById('link-fb').value = data.links.facebook || "";
        }
        editingNewsId = id; submitButton.textContent = "更新する"; submitButton.style.backgroundColor = "#28a745"; formTitle.textContent = "お知らせを編集"; cancelEditButton.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function fetchNews() {
    newsListContainer.innerHTML = '読み込み中...';
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    if(snapshot.empty) { newsListContainer.innerHTML = 'なし'; return; }
    let html = '<ul class="admin-list">';
    snapshot.forEach(d => {
        const data = d.data();
        html += `<li class="admin-item"><div class="item-header"><div><span class="item-date">${data.date}</span><div class="item-title">${data.title}</div></div><div class="btn-group"><button class="btn-edit" onclick="window.editNews('${d.id}')">編集</button><button class="btn-delete" onclick="window.deleteNews('${d.id}')">削除</button></div></div></li>`;
    });
    newsListContainer.innerHTML = html + '</ul>';
}
window.editNews = handleEditNews;
window.deleteNews = async (id) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "news", id)); if (editingNewsId === id) resetForm(); fetchNews(); }};

// =========================================================================
// ★機能分割: 開発実績 (dev-manage) と 活動プロジェクト (act-manage)
// =========================================================================

// --- 開発実績フォーム (Portfolio) ---
const devForm = document.getElementById('dev-form');
const devSubmit = document.getElementById('dev-submit-button');
const devCancel = document.getElementById('dev-cancel-edit');
const devTitle = document.getElementById('dev-form-title');
let editingDevId = null;

devForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        type: 'portfolio', // ★識別用
        category: 'dev',   // 開発実績はdev固定
        title: document.getElementById('dev-title').value,
        status: document.getElementById('dev-status').value,
        order: parseInt(document.getElementById('dev-order').value) || 0,
        image: document.getElementById('dev-image').value,
        description: document.getElementById('dev-desc').value,
        url: document.getElementById('dev-url').value || "",
        createdAt: serverTimestamp()
    };
    await saveProject(data, editingDevId, resetDevForm);
});

devCancel.addEventListener('click', resetDevForm);
function resetDevForm() {
    devForm.reset(); editingDevId = null; document.getElementById('dev-order').value = 0;
    devSubmit.textContent = "登録する"; devSubmit.style.backgroundColor = ""; devTitle.textContent = "開発実績の登録"; devCancel.classList.add('hidden');
}

// --- 活動プロジェクトフォーム (Project) ---
const actForm = document.getElementById('act-form');
const actSubmit = document.getElementById('act-submit-button');
const actCancel = document.getElementById('act-cancel-edit');
const actTitle = document.getElementById('act-form-title');
let editingActId = null;

actForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        type: 'project', // ★識別用
        category: document.getElementById('act-category').value,
        title: document.getElementById('act-title').value,
        status: document.getElementById('act-status').value,
        order: parseInt(document.getElementById('act-order').value) || 0,
        description: document.getElementById('act-desc').value,
        url: document.getElementById('act-url').value || "",
        image: "", 
        createdAt: serverTimestamp()
    };
    await saveProject(data, editingActId, resetActForm);
});

actCancel.addEventListener('click', resetActForm);
function resetActForm() {
    actForm.reset(); editingActId = null; document.getElementById('act-order').value = 0;
    actSubmit.textContent = "登録する"; actSubmit.style.backgroundColor = ""; actTitle.textContent = "活動プロジェクトの登録"; actCancel.classList.add('hidden');
}

// 共通保存関数
async function saveProject(data, id, resetFunc) {
    try {
        if (id) {
            if(!confirm("更新しますか？")) return;
            delete data.createdAt;
            await updateDoc(doc(db, 'projects', id), data);
            alert("更新しました");
        } else {
            await addDoc(collection(db, 'projects'), data);
            alert("登録しました");
        }
        resetFunc();
        fetchProjects();
    } catch (error) { alert("エラー: " + error.message); }
}

// 共通読み込み関数 (typeで振り分け)
async function fetchProjects() {
    const devContainer = document.getElementById('dev-list-container');
    const actContainer = document.getElementById('act-list-container');
    devContainer.innerHTML = '読み込み中...';
    actContainer.innerHTML = '読み込み中...';

    try {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);

        let devHtml = '<ul class="admin-list">';
        let actHtml = '<ul class="admin-list">';
        
        snapshot.forEach(d => {
            const data = d.data();
            const id = d.id;
            const orderNum = data.order !== undefined ? data.order : '-';
            const statusLabel = data.status === 'completed' ? '<span style="color:#666">[完了]</span>' : '<span style="color:green">[活動中]</span>';
            
            let catLabel = 'その他';
            if(data.category === 'dev') catLabel = '開発';
            else if(data.category === 'edu') catLabel = '教育';
            else if(data.category === 'com') catLabel = '交流';

            const buttons = `<div class="btn-group">
                <button class="btn-edit" onclick="window.editProject('${id}')">編集</button>
                <button class="btn-delete" onclick="window.deleteProject('${id}')">削除</button>
            </div>`;

            const itemHtml = `<li class="admin-item">
                <div class="item-header">
                    <div><span class="item-date">順序:${orderNum} / ${statusLabel} [${catLabel}]</span><div class="item-title">${data.title}</div></div>
                    ${buttons}
                </div>
                <div class="item-details">${data.description}</div>
            </li>`;

            // ★typeで判定
            if (data.type === 'portfolio') {
                devHtml += itemHtml;
            } else {
                actHtml += itemHtml;
            }
        });

        devContainer.innerHTML = devHtml + '</ul>';
        actContainer.innerHTML = actHtml + '</ul>';

        if (snapshot.empty) {
            devContainer.innerHTML = '登録なし';
            actContainer.innerHTML = '登録なし';
        }

    } catch(e) { console.error(e); devContainer.innerHTML = 'エラー'; actContainer.innerHTML = 'エラー'; }
}

// 編集ボタンの振り分け
window.editProject = async (id) => {
    const docSnap = await getDoc(doc(db, "projects", id));
    if (!docSnap.exists()) return;
    const data = docSnap.data();

    if (data.type === 'portfolio') {
        // 開発実績タブへ
        document.querySelector('[data-target="dev-manage"]').click();
        editingDevId = id;
        document.getElementById('dev-title').value = data.title;
        document.getElementById('dev-status').value = data.status || 'active';
        document.getElementById('dev-order').value = data.order || 0;
        document.getElementById('dev-image').value = data.image || "";
        document.getElementById('dev-desc').value = data.description;
        document.getElementById('dev-url').value = data.url || "";
        
        devSubmit.textContent = "更新する";
        devSubmit.style.backgroundColor = "#28a745";
        devTitle.textContent = "開発実績を編集";
        devCancel.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
        // 活動プロジェクトタブへ
        document.querySelector('[data-target="act-manage"]').click();
        editingActId = id;
        document.getElementById('act-title').value = data.title;
        document.getElementById('act-category').value = data.category || 'other';
        document.getElementById('act-status').value = data.status || 'active';
        document.getElementById('act-order').value = data.order || 0;
        document.getElementById('act-desc').value = data.description;
        document.getElementById('act-url').value = data.url || "";

        actSubmit.textContent = "更新する";
        actSubmit.style.backgroundColor = "#28a745";
        actTitle.textContent = "活動プロジェクトを編集";
        actCancel.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.deleteProject = async (id) => {
    if(confirm("削除しますか？")) {
        await deleteDoc(doc(db, "projects", id));
        if (editingDevId === id) resetDevForm();
        if (editingActId === id) resetActForm();
        fetchProjects();
    }
};

// =========================================================================
// 地図管理
// =========================================================================
const mapForm = document.getElementById('map-form');
const mapListContainer = document.getElementById('map-list-container');
const mapSubmitButton = document.getElementById('map-submit-button');
const mapCancelButton = document.getElementById('map-cancel-edit');
const mapFormTitle = document.getElementById('map-form-title');
let editingMapId = null;

mapForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mapData = {
        name: document.getElementById('map-name').value,
        popup: document.getElementById('map-desc').value,
        iconType: document.getElementById('map-type').value,
        lat: parseFloat(document.getElementById('map-lat').value),
        lng: parseFloat(document.getElementById('map-lng').value)
    };
    try {
        if (editingMapId) {
            if(!confirm("更新しますか？")) return;
            await updateDoc(doc(db, 'activityLocations', editingMapId), mapData);
            alert("更新しました");
        } else {
            await addDoc(collection(db, 'activityLocations'), mapData);
            alert("登録しました");
        }
        resetMapForm(); fetchMapLocations();
    } catch (error) { alert("エラー: " + error.message); }
});

mapCancelButton.addEventListener('click', resetMapForm);
function resetMapForm() {
    mapForm.reset(); editingMapId = null;
    mapSubmitButton.textContent = "地点を登録"; mapSubmitButton.style.backgroundColor = ""; mapFormTitle.textContent = "マップ地点の登録"; mapCancelButton.classList.add('hidden');
}

async function handleEditMap(id) {
    const docSnap = await getDoc(doc(db, "activityLocations", id));
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('map-name').value = data.name;
        document.getElementById('map-desc').value = data.popup;
        document.getElementById('map-type').value = data.iconType;
        document.getElementById('map-lat').value = data.lat;
        document.getElementById('map-lng').value = data.lng;
        editingMapId = id; mapSubmitButton.textContent = "地点を更新"; mapSubmitButton.style.backgroundColor = "#28a745"; mapFormTitle.textContent = "地点を編集"; mapCancelButton.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function fetchMapLocations() {
    mapListContainer.innerHTML = '読み込み中...';
    try {
        const snapshot = await getDocs(collection(db, "activityLocations"));
        if(snapshot.empty) { mapListContainer.innerHTML = '登録なし'; return; }
        let html = '<ul class="admin-list">';
        snapshot.forEach(d => {
            const data = d.data();
            let typeLabel = data.iconType === 'dev' ? '開発(青)' : data.iconType === 'edu' ? '教室(黄)' : data.iconType === 'partner' ? '協力(緑)' : '交流(赤)';
            html += `<li class="admin-item"><div class="item-header"><div><div class="item-title">${data.name}</div><span class="item-date">${typeLabel}</span></div><div class="btn-group"><button class="btn-edit" onclick="window.editMap('${d.id}')">編集</button><button class="btn-delete" onclick="window.deleteMap('${d.id}')">削除</button></div></div><div class="item-details">${data.popup}</div></li>`;
        });
        mapListContainer.innerHTML = html + '</ul>';
    } catch(e) { mapListContainer.innerHTML = 'エラー'; }
}
window.editMap = handleEditMap;
window.deleteMap = async (id) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "activityLocations", id)); if (editingMapId === id) resetMapForm(); fetchMapLocations(); }};

// 学生・お問い合わせ
document.getElementById('refresh-students').addEventListener('click', fetchStudents);
async function fetchStudents() {
    const c = document.getElementById('student-list'); c.innerHTML = '<li style="padding:1rem;">読み込み中...</li>';
    try {
        const s = await getDocs(collection(db, "students"));
        if(s.empty) { c.innerHTML = '<li style="padding:1rem;">データなし</li>'; return; }
        const arr = []; s.forEach(d=>arr.push(d.data())); arr.sort((a,b)=>(b.timestamp?new Date(b.timestamp):0)-(a.timestamp?new Date(a.timestamp):0));
        c.innerHTML = ''; arr.forEach(d=>{
            c.innerHTML += `<li class="admin-item"><div class="item-header"><div><span class="item-date">${d.timestamp?new Date(d.timestamp).toLocaleString():''}</span><div class="item-title">${d.name} 様</div></div></div><div class="item-details"><strong>${d.email}</strong><br>${d.skills}</div></li>`;
        });
    } catch(e) { c.innerHTML = 'エラー'; }
}

document.getElementById('refresh-inquiries').addEventListener('click', fetchInquiries);
async function fetchInquiries() {
    const c = document.getElementById('inquiry-list'); c.innerHTML = '<li style="padding:1rem;">読み込み中...</li>';
    try {
        const s = await get(ref(rtdb, 'contacts'));
        if(!s.exists()) { c.innerHTML = '<li style="padding:1rem;">なし</li>'; return; }
        const d = s.val(); const arr = Object.entries(d).reverse();
        c.innerHTML = ''; arr.forEach(([k,v])=>{
            c.innerHTML += `<li class="admin-item"><div class="item-header"><div><span class="item-date">${v.timestamp?new Date(v.timestamp).toLocaleString():''}</span><div class="item-title">${v.subject}</div></div></div><div class="item-details"><strong>${v.name}</strong><br>${v.message.replace(/\n/g,'<br>')}</div></li>`;
        });
    } catch(e) { c.innerHTML = 'エラー'; }
}