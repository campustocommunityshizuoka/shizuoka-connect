"use client";

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false, // サーバーサイドレンダリングを無効化（windowがないため）
  loading: () => <p style={{textAlign: 'center', padding: '2rem'}}>マップを読み込んでいます...</p>
});

export default function MapWrapper() {
  return <LeafletMap />;
}