"use client";

import { useState, useRef, useCallback, useEffect } from 'react'; // useEffectを追加
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
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetRef = useRef<any>(null);

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
        scriptSource: "https://upload-widget.cloudinary.com/global/all.js" 
      }, (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success:", result.info.secure_url);
          onUpload(result.info.secure_url);
        }
      });
      setIsLoaded(true);
    }
  }, [onUpload]);

  // ★ここが修正ポイント！
  // マウント時にすでにCloudinaryが読み込まれていたら、即座に初期化する
  useEffect(() => {
    if (window.cloudinary) {
      initializeWidget();
    }
  }, [initializeWidget]);

  const handleOpen = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      initializeWidget();
      // 少し待ってから開く
      setTimeout(() => {
          if(widgetRef.current) widgetRef.current.open();
      }, 500);
    }
  };

  return (
    <>
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive"
        onLoad={initializeWidget}
      />
      
      <button 
        type="button" 
        onClick={handleOpen} 
        className="btn-preview" 
        style={{
            width: 'auto', 
            whiteSpace: 'nowrap',
            opacity: isLoaded ? 1 : 0.6,
            cursor: isLoaded ? 'pointer' : 'wait'
        }}
        // ★ここも変更：万が一フラグが立たなくても、window.cloudinaryがあれば押せるようにする
        disabled={!isLoaded && !window.cloudinary} 
      >
        {isLoaded || (typeof window !== 'undefined' && window.cloudinary) ? label : "準備中..."}
      </button>
    </>
  );
}