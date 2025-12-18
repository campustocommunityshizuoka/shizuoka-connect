// about-map.js

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    
    const mapElement = document.getElementById('activity-map');
    if (!mapElement) return;

    // 1. 地図の初期設定
    const map = L.map('activity-map', {
        center: [34.7108, 137.7261], 
        zoom: 12,                    
        scrollWheelZoom: false,      // ★変更: スクロールでのズームを無効化 (画面スクロールの邪魔をしない)
        dragging: true,              
        doubleClickZoom: true,       
        boxZoom: true,
        keyboard: true,
        zoomControl: true            
    });

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
        com: createCustomIcon('fas fa-users', 'marker-com'),
        partner: createCustomIcon('far fa-building', 'marker-partner')
    };

    let allMarkers = [];
    let featureGroup;

    try {
        const snapshot = await getDocs(collection(db, "activityLocations"));
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.lat && data.lng && data.iconType) {
                const icon = icons[data.iconType] || icons.com;
                const marker = L.marker([data.lat, data.lng], { icon: icon })
                    .bindPopup(`<b>${data.name}</b><br>${data.popup}`);
                
                marker.addTo(map);
                marker.category = data.iconType;
                allMarkers.push(marker);
            }
        });

        if (allMarkers.length > 0) {
            featureGroup = L.featureGroup(allMarkers);
        }

    } catch (error) { console.error("Map Error:", error); }

    // about-map.js の後半部分を修正

    // =========================================================
    // ★エリア切り替え機能 (修正版)
    // =========================================================
    const regionBtns = document.querySelectorAll('.region-btn');
    
    const regions = {
        chuo:   { lat: 34.7038, lng: 137.7347, zoom: 13 },
        hamana: { lat: 34.7950, lng: 137.7650, zoom: 12 },
        tenryu: { lat: 34.8800, lng: 137.8144, zoom: 11 }
    };

    regionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // ボタンの見た目を切り替え
            regionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const val = btn.dataset.region;

            if (val === 'all') {
                // ★修正: 自動調整をやめて、「浜松市全体」が見える固定の位置・ズームを設定
                // center: [緯度34.85, 経度137.78], zoom: 10 (市全域が見える広さ)
                map.setView([34.8500, 137.7800], 10, { animate: true, duration: 1.0 });
                
            } else if (regions[val]) {
                // 各区へ移動
                const r = regions[val];
                map.setView([r.lat, r.lng], r.zoom, { animate: true, duration: 1.0 });
            }
        });
    });

    // =========================================================
    // カテゴリ絞り込み機能 (既存のまま)
    // =========================================================
    const filterBtns = document.querySelectorAll('.map-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterType = btn.dataset.filter;

            allMarkers.forEach(marker => {
                if (filterType === 'all' || marker.category === filterType) {
                    if (!map.hasLayer(marker)) marker.addTo(map);
                } else {
                    if (map.hasLayer(marker)) map.removeLayer(marker);
                }
            });
        });
    });
});