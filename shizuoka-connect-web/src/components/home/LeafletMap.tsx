"use client";

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// デフォルトアイコンのパス修正 (Next.js/Leafletでの表示ズレ対策)
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function LeafletMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [activeRegion, setActiveRegion] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const markersRef = useRef<{marker: L.Marker, type: string}[]>([]);

  // 地域の座標定義
  const regions: Record<string, { lat: number, lng: number, zoom: number }> = {
    chuo: { lat: 34.7108, lng: 137.7261, zoom: 13 },
    hamana: { lat: 34.7963, lng: 137.7341, zoom: 12 },
    tenryu: { lat: 34.9612, lng: 137.8139, zoom: 11 }
  };

  useEffect(() => {
    // Leafletアイコンの初期設定
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: iconMarker.src,
        iconRetinaUrl: iconRetina.src,
        shadowUrl: iconShadow.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // マップ初期化
    if (!mapRef.current) {
        const map = L.map('activity-map', {
            center: [34.8500, 137.7800], // 全体が見える位置
            zoom: 10,                    
            scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            maxZoom: 19
        }).addTo(map);

        mapRef.current = map;
        loadMarkers(map);
    }
  }, []);

  const loadMarkers = async (map: L.Map) => {
    try {
        // ★修正点: コレクション名を "activityLocations" に変更
        const snapshot = await getDocs(collection(db, "activityLocations"));
        
        // カスタムアイコン作成関数
        const createCustomIcon = (iconClass: string, colorClass: string) => {
            return L.divIcon({
                className: `weather-icon-marker ${colorClass}`,
                html: `<i class="${iconClass}"></i>`,
                iconSize: [44, 44],
                iconAnchor: [22, 22],
                popupAnchor: [0, -25]
            });
        };

        const icons: any = {
            dev: createCustomIcon('fas fa-laptop-code', 'marker-dev'),
            edu: createCustomIcon('fas fa-chalkboard-teacher', 'marker-edu'),
            com: createCustomIcon('fas fa-users', 'marker-com'),
            partner: createCustomIcon('far fa-building', 'marker-partner')
        };

        snapshot.forEach(doc => {
            const d = doc.data();
            // ★修正点: データのフィールド名を元のJSに合わせて確認
            if(d.lat && d.lng) {
                // iconType がない場合は 'partner' や 'com' をデフォルトに
                const type = d.iconType || 'partner'; 
                const icon = icons[type] || icons.partner;

                const marker = L.marker([d.lat, d.lng], { icon: icon })
                    .bindPopup(`<b>${d.name || '名称未設定'}</b><br>${d.popup || ''}`);
                
                marker.addTo(map);
                markersRef.current.push({ marker, type });
            }
        });
    } catch (e) {
        console.error("Map Load Error", e);
    }
  };

  // フィルタリング処理
  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
    if (!mapRef.current) return;

    if (region === 'all') {
        mapRef.current.setView([34.8500, 137.7800], 10, { animate: true, duration: 1.0 });
    } else if (regions[region]) {
        const r = regions[region];
        mapRef.current.setView([r.lat, r.lng], r.zoom, { animate: true, duration: 1.0 });
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (!mapRef.current) return;

    markersRef.current.forEach(({ marker, type }) => {
        if (filter === 'all' || type === filter) {
            mapRef.current?.addLayer(marker);
        } else {
            mapRef.current?.removeLayer(marker);
        }
    });
  };

  return (
    <>
      <div className="map-region-selector" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="region-buttons-container">
            {['all', 'chuo', 'hamana', 'tenryu'].map(r => (
                <button 
                    key={r} 
                    className={`region-btn ${activeRegion === r ? 'active' : ''}`}
                    onClick={() => handleRegionChange(r)}
                >
                    {r === 'all' ? '全体' : r === 'chuo' ? '中央区' : r === 'hamana' ? '浜名区' : '天竜区'}
                </button>
            ))}
        </div>
      </div>

      <div className="map-filters">
        <button className={`map-filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>すべて</button>
        <button className={`map-filter-btn ${activeFilter === 'dev' ? 'active' : ''}`} onClick={() => handleFilterChange('dev')}><i className="fas fa-laptop-code"></i> 開発</button>
        <button className={`map-filter-btn ${activeFilter === 'edu' ? 'active' : ''}`} onClick={() => handleFilterChange('edu')}><i className="fas fa-chalkboard-teacher"></i> 教室</button>
        <button className={`map-filter-btn ${activeFilter === 'partner' ? 'active' : ''}`} onClick={() => handleFilterChange('partner')}><i className="far fa-building"></i> 協力企業</button>
      </div>

      <div className="weather-map-container">
        <div id="activity-map" style={{ height: '400px', width: '100%' }}></div>
      </div>
    </>
  );
}