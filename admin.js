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
        fetchFeatured(); // 追加
        fetchProjects(); 
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

/* ============================================================
   Cloudinary 設定 & アップロードボタン
   ============================================================ */
const cloudName = "dser57xce";
const uploadPreset = "icko9ktd";

function createUploadWidget(inputId) {
    if (!window.cloudinary) {
        console.error("Cloudinary script not loaded");
        return null;
    }
    return cloudinary.createUploadWidget({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        folder: 'shizuoka_connect',
        clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        
        // ▼▼ クレジット節約のための追加設定 ▼▼
        maxImageWidth: 1200,   // 横幅を最大1200pxに制限 (これ以上はアップロード前に縮小)
        maxImageHeight: 1200,  // 縦幅を最大1200pxに制限
        validateMaxWidthHeight: true, 
        // ▲▲ ここまで ▲▲

    }, (error, result) => {
        if (!error && result && result.event === "success") {
            const input = document.getElementById(inputId);
            if(input) input.value = result.info.secure_url;
        }
    });
}

// 1. 注目プロジェクト用
const featUploadBtn = document.getElementById("upload_widget_feat");
if (featUploadBtn) {
    const w = createUploadWidget("feat-image");
    if(w) featUploadBtn.addEventListener("click", () => w.open(), false);
}

// 2. お知らせ用
const newsUploadBtn = document.getElementById("upload_widget_news");
if (newsUploadBtn) {
    const wNews = createUploadWidget("news-image");
    if(wNews) newsUploadBtn.addEventListener("click", () => wNews.open(), false);
}

// 3. 開発実績用
const devUploadBtn = document.getElementById("upload_widget_dev");
if (devUploadBtn) {
    const wDev = createUploadWidget("dev-image");
    if(wDev) devUploadBtn.addEventListener("click", () => wDev.open(), false);
}


// =========================================================================
// お知らせ (News) - 画像対応
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
        image: document.getElementById('news-image').value || "", // 画像URL追加
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
        document.getElementById('news-image').value = data.image || ""; // 画像読み込み
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
// ★トップ注目プロジェクト (Featured / top_projects)
// =========================================================================
const featForm = document.getElementById('feat-form');
const featListContainer = document.getElementById('feat-list-container');
const featSubmit = document.getElementById('feat-submit-button');
const featCancel = document.getElementById('feat-cancel-edit');
const featTitle = document.getElementById('feat-form-title');
let editingFeatId = null;

if(featForm) {
    featForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('feat-title').value,
            tagClass: document.getElementById('feat-tag-color').value,
            tagName: document.getElementById('feat-tag-text').value,
            image: document.getElementById('feat-image').value,
            description: document.getElementById('feat-desc').value,
            url: document.getElementById('feat-url').value,
            order: parseInt(document.getElementById('feat-order').value) || 0,
            timestamp: serverTimestamp()
        };
        try {
            if (editingFeatId) {
                if(!confirm("更新しますか？")) return;
                delete data.timestamp;
                await updateDoc(doc(db, 'top_projects', editingFeatId), data);
                alert("更新しました");
            } else {
                await addDoc(collection(db, 'top_projects'), data);
                alert("トップページに追加しました");
            }
            resetFeatForm(); fetchFeatured();
        } catch (error) { alert("エラー: " + error.message); }
    });
}

if(featCancel) featCancel.addEventListener('click', resetFeatForm);

function resetFeatForm() {
    featForm.reset(); editingFeatId = null;
    featSubmit.textContent = "トップに表示する"; featSubmit.style.backgroundColor = "#e74c3c"; featTitle.textContent = "★トップ注目プロジェクトの登録"; featCancel.classList.add('hidden');
}

async function fetchFeatured() {
    if(!featListContainer) return;
    featListContainer.innerHTML = '読み込み中...';
    try {
        const q = query(collection(db, "top_projects"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        if(snapshot.empty) { featListContainer.innerHTML = '登録なし'; return; }
        let html = '<ul class="admin-list">';
        snapshot.forEach(d => {
            const data = d.data();
            const imgHtml = data.image ? `<img src="${data.image}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; margin-right:10px;">` : '';
            html += `<li class="admin-item"><div class="item-header"><div style="display:flex; align-items:center;">${imgHtml}<div><span class="item-date">順序:${data.order}</span><div class="item-title" style="color:#e74c3c;">${data.title}</div></div></div><div class="btn-group"><button class="btn-edit" onclick="window.editFeat('${d.id}')">編集</button><button class="btn-delete" onclick="window.deleteFeat('${d.id}')">削除</button></div></div></li>`;
        });
        featListContainer.innerHTML = html + '</ul>';
    } catch(e) { featListContainer.innerHTML = 'エラー'; }
}

window.editFeat = async (id) => {
    const tabBtn = document.querySelector('button[data-target="featured"]');
    if(tabBtn) tabBtn.click();
    const docSnap = await getDoc(doc(db, "top_projects", id));
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('feat-title').value = data.title;
        document.getElementById('feat-tag-color').value = data.tagClass;
        document.getElementById('feat-tag-text').value = data.tagName;
        document.getElementById('feat-image').value = data.image || "";
        document.getElementById('feat-desc').value = data.description;
        document.getElementById('feat-url').value = data.url || "";
        document.getElementById('feat-order').value = data.order || 0;
        editingFeatId = id; featSubmit.textContent = "更新する"; featSubmit.style.backgroundColor = "#28a745"; featTitle.textContent = "注目プロジェクトを編集"; featCancel.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
window.deleteFeat = async (id) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "top_projects", id)); if (editingFeatId === id) resetFeatForm(); fetchFeatured(); }};


// =========================================================================
// 開発実績 & 活動プロジェクト
// =========================================================================

// --- 開発実績フォーム ---
const devForm = document.getElementById('dev-form');
const devSubmit = document.getElementById('dev-submit-button');
const devCancel = document.getElementById('dev-cancel-edit');
const devTitle = document.getElementById('dev-form-title');
let editingDevId = null;

if(devForm) {
    devForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            type: 'portfolio',
            category: 'dev',
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
}

if(devCancel) devCancel.addEventListener('click', resetDevForm);
function resetDevForm() {
    devForm.reset(); editingDevId = null; document.getElementById('dev-order').value = 0;
    devSubmit.textContent = "登録する"; devSubmit.style.backgroundColor = ""; devTitle.textContent = "開発実績の登録"; devCancel.classList.add('hidden');
}

// --- 活動プロジェクトフォーム ---
const actForm = document.getElementById('act-form');
const actSubmit = document.getElementById('act-submit-button');
const actCancel = document.getElementById('act-cancel-edit');
const actTitle = document.getElementById('act-form-title');
let editingActId = null;

if(actForm) {
    actForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            type: 'project',
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
}

if(actCancel) actCancel.addEventListener('click', resetActForm);
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
        resetFunc(); fetchProjects();
    } catch (error) { alert("エラー: " + error.message); }
}

// 共通読み込み関数
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
            
            const buttons = `<div class="btn-group">
                <button class="btn-edit" onclick="window.editProject('${id}')">編集</button>
                <button class="btn-delete" onclick="window.deleteProject('${id}')">削除</button>
            </div>`;

            const itemHtml = `<li class="admin-item">
                <div class="item-header">
                    <div><span class="item-date">順序:${orderNum} / ${statusLabel}</span><div class="item-title">${data.title}</div></div>
                    ${buttons}
                </div>
            </li>`;

            if (data.type === 'portfolio') { devHtml += itemHtml; } else { actHtml += itemHtml; }
        });

        devContainer.innerHTML = devHtml + '</ul>';
        actContainer.innerHTML = actHtml + '</ul>';
    } catch(e) { devContainer.innerHTML = 'エラー'; actContainer.innerHTML = 'エラー'; }
}

window.editProject = async (id) => {
    const docSnap = await getDoc(doc(db, "projects", id));
    if (!docSnap.exists()) return;
    const data = docSnap.data();

    if (data.type === 'portfolio') {
        document.querySelector('[data-target="dev-manage"]').click();
        editingDevId = id;
        document.getElementById('dev-title').value = data.title;
        document.getElementById('dev-status').value = data.status || 'active';
        document.getElementById('dev-order').value = data.order || 0;
        document.getElementById('dev-image').value = data.image || "";
        document.getElementById('dev-desc').value = data.description;
        document.getElementById('dev-url').value = data.url || "";
        devSubmit.textContent = "更新する"; devSubmit.style.backgroundColor = "#28a745"; devTitle.textContent = "開発実績を編集"; devCancel.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.querySelector('[data-target="act-manage"]').click();
        editingActId = id;
        document.getElementById('act-title').value = data.title;
        document.getElementById('act-category').value = data.category || 'other';
        document.getElementById('act-status').value = data.status || 'active';
        document.getElementById('act-order').value = data.order || 0;
        document.getElementById('act-desc').value = data.description;
        document.getElementById('act-url').value = data.url || "";
        actSubmit.textContent = "更新する"; actSubmit.style.backgroundColor = "#28a745"; actTitle.textContent = "活動プロジェクトを編集"; actCancel.classList.remove('hidden');
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
// 地図 & 学生 & お問い合わせ (既存)
// =========================================================================
const mapForm = document.getElementById('map-form');
const mapListContainer = document.getElementById('map-list-container');
const mapSubmitButton = document.getElementById('map-submit-button');
const mapCancelButton = document.getElementById('map-cancel-edit');
const mapFormTitle = document.getElementById('map-form-title');
let editingMapId = null;

if(mapForm) {
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
}

if(mapCancelButton) mapCancelButton.addEventListener('click', resetMapForm);
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
            let typeLabel = data.iconType === 'dev' ? '開発' : data.iconType === 'edu' ? '教室' : data.iconType === 'partner' ? '協力' : '交流';
            html += `<li class="admin-item"><div class="item-header"><div><div class="item-title">${data.name}</div><span class="item-date">${typeLabel}</span></div><div class="btn-group"><button class="btn-edit" onclick="window.editMap('${d.id}')">編集</button><button class="btn-delete" onclick="window.deleteMap('${d.id}')">削除</button></div></div></li>`;
        });
        mapListContainer.innerHTML = html + '</ul>';
    } catch(e) { mapListContainer.innerHTML = 'エラー'; }
}
window.editMap = handleEditMap;
window.deleteMap = async (id) => { if(confirm("削除しますか？")) { await deleteDoc(doc(db, "activityLocations", id)); if (editingMapId === id) resetMapForm(); fetchMapLocations(); }};

const refreshStudentsBtn = document.getElementById('refresh-students');
if (refreshStudentsBtn) refreshStudentsBtn.addEventListener('click', fetchStudents);

async function fetchStudents() {
    const c = document.getElementById('student-list'); c.innerHTML = '<li style="padding:1rem;">読み込み中...</li>';
    try {
        const s = await getDocs(collection(db, "students"));
        if(s.empty) { c.innerHTML = '<li style="padding:1rem;">データなし</li>'; return; }
        const arr = []; s.forEach(d => arr.push(d.data())); 
        arr.sort((a,b) => (b.timestamp ? new Date(b.timestamp) : 0) - (a.timestamp ? new Date(a.timestamp) : 0));
        c.innerHTML = ''; arr.forEach(d => {
            c.innerHTML += `<li class="admin-item"><div class="item-header"><div><span class="item-date">${d.timestamp ? new Date(d.timestamp).toLocaleString() : ''}</span><div class="item-title">${d.name} 様</div></div></div><div class="item-details"><strong>メール: </strong>${d.email}<br><strong>スキル: </strong>${d.skills}</div></li>`;
        });
    } catch(e) { c.innerHTML = 'エラーが発生しました'; }
}

const refreshInquiriesBtn = document.getElementById('refresh-inquiries');
if (refreshInquiriesBtn) refreshInquiriesBtn.addEventListener('click', fetchInquiries);

async function fetchInquiries() {
    const c = document.getElementById('inquiry-list'); c.innerHTML = '<li style="padding:1rem;">読み込み中...</li>';
    try {
        const s = await get(ref(rtdb, 'contacts'));
        if (!s.exists()) { c.innerHTML = '<li style="padding:1rem;">なし</li>'; return; }
        const arr = Object.entries(s.val()).reverse();
        c.innerHTML = ''; arr.forEach(([k, v]) => {
            c.innerHTML += `<li class="admin-item"><div class="item-header"><div><span class="item-date">${v.timestamp ? new Date(v.timestamp).toLocaleString() : ''}</span><div class="item-title">${v.subject}</div></div></div><div class="item-details"><strong>${v.name}</strong><br><a href="mailto:${v.email}">${v.email}</a><br><div style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px dashed #ccc;">${v.message.replace(/\n/g, '<br>')}</div></div></li>`;
        });
    } catch (e) { c.innerHTML = 'エラーが発生しました'; }
}