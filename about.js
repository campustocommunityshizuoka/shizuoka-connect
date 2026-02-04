// about.js

import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    initMap();
});

// --------------------------------------------------
// 1. 活動実績の動的読み込み
// --------------------------------------------------
async function loadActivities() {
    const container = document.getElementById('activities-container');
    if (!container) return;

    try {
        const q = query(collection(db, "activities"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<p style="text-align:center; width:100%;">現在、登録された活動はありません。</p>';
            return;
        }

        container.innerHTML = ''; // クリア

        querySnapshot.forEach(doc => {
            const data = doc.data();
            
            // アイコン設定
            let iconClass = "fas fa-star";
            let colorClass = "community"; // デフォルト
            if (data.type === "development") { iconClass = "fas fa-laptop-code"; colorClass = "development"; }
            if (data.type === "education") { iconClass = "fas fa-chalkboard-teacher"; colorClass = "education"; }
            if (data.type === "community") { iconClass = "fas fa-users"; colorClass = "community"; }

            // 実績リスト生成
            let listHtml = '';
            if (data.achievements && data.achievements.length > 0) {
                listHtml = `
                <div class="achievement-box">
                    <h4><i class="fas fa-check-circle"></i> 実績</h4>
                    <ul>
                        ${data.achievements.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>`;
            }

            const html = `
            <div class="activity-card">
              <div class="act-header">
                <div class="act-icon ${colorClass}"><i class="${iconClass}"></i></div>
                <h3>${data.title}</h3>
              </div>
              <p class="act-desc">${data.description}</p>
              ${listHtml}
            </div>
            `;
            container.innerHTML += html;
        });

    } catch (error) {
        console.error("活動読み込みエラー:", error);
        container.innerHTML = '<p>読み込みに失敗しました。</p>';
    }
}

// --------------------------------------------------
// 2. 天気予報風マップの表示
// --------------------------------------------------
function initMap() {
    const mapElement = document.getElementById('activity-map');
    if (!mapElement) return;

    const map = L.map('activity-map').setView([34.85, 138.15], 9);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    function createCustomIcon(iconClass, colorClass) {
        return L.divIcon({
            className: `weather-icon-marker ${colorClass}`,
            html: `<i class="${iconClass}"></i>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -25]
        });
    }

    const icons = {
        dev: createCustomIcon('fas fa-laptop-code', 'marker-dev'),
        edu: createCustomIcon('fas fa-chalkboard-teacher', 'marker-edu'),
        com: createCustomIcon('fas fa-users', 'marker-com')
    };

    const locations = [
        { lat: 34.9756, lng: 138.3828, icon: icons.com, popup: "<b>静岡拠点</b><br>交流会・イベント" },
        { lat: 34.7108, lng: 137.7261, icon: icons.edu, popup: "<b>浜松拠点</b><br>プログラミング教室" },
        { lat: 35.1614, lng: 138.6763, icon: icons.dev, popup: "<b>富士・沼津エリア</b><br>開発合宿" },
        { lat: 34.7698, lng: 138.0148, icon: icons.dev, popup: "<b>西部開発サテライト</b>" }
    ];

    locations.forEach(loc => {
        L.marker([loc.lat, loc.lng], { icon: loc.icon }).addTo(map).bindPopup(loc.popup);
    });
}