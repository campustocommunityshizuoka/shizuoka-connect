"use client";

import { useState, useRef, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    cloudinary: any;
  }
}

type Props = {
  onUpload: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ onUpload, label = "画像選択" }: Props) {
  const [isLoaded, setIsLoaded] = useState(false); // 読み込み完了フラグ
  const widgetRef = useRef<any>(null);

  // ウィジェットの初期化ロジックを一箇所にまとめる
  const initializeWidget = useCallback(() => {
    if (window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget({
        cloudName: "dser57xce",
        uploadPreset: "icko9ktd",
        sources: ['local', 'url', 'camera'],
        multiple: false,
        folder: 'shizuoka_connect',
        clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        maxImageWidth: 1200,
        maxImageHeight: 1200,
        validateMaxWidthHeight: true,
        // Cloudflare等のセキュリティ対策で source を指定
        scriptSource: "https://upload-widget.cloudinary.com/global/all.js" 
      }, (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success:", result.info.secure_url);
          onUpload(result.info.secure_url);
        } else if (error) {
          console.error("Cloudinary Error:", error);
          alert("アップロードエラーが発生しました");
        }
      });
      
      setIsLoaded(true); // 準備完了
      console.log("Cloudinary Widget Initialized");
    }
  }, [onUpload]);

  const handleOpen = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      // 万が一ボタンが押せても、まだなら初期化を試みる
      initializeWidget();
      if(widgetRef.current) {
          widgetRef.current.open();
      } else {
          alert("アップローダーを読み込んでいます...少々お待ちください");
      }
    }
  };

  return (
    <>
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive" // 読み込み優先度を調整
        onLoad={initializeWidget}   // 読み込み完了時に初期化を実行
        onError={(e) => {
            console.error("Script load error", e);
            alert("画像アップロード機能の読み込みに失敗しました。広告ブロック等を解除してください。");
        }}
      />
      
      <button 
        type="button" 
        onClick={handleOpen} 
        className="btn-preview" 
        style={{
            width: 'auto', 
            whiteSpace: 'nowrap',
            opacity: isLoaded ? 1 : 0.6, // 読み込み中は薄くする
            cursor: isLoaded ? 'pointer' : 'wait'
        }}
        disabled={!isLoaded} // 読み込み完了まで押せないようにする（連打防止）
      >
        {isLoaded ? label : "準備中..."}
      </button>
    </>
  );
}