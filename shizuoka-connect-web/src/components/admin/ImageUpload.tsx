"use client";

import { useEffect, useRef } from 'react';
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
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // スクリプトが読み込まれた後にウィジェットを初期化
    if (window.cloudinary && !widgetRef.current) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget({
        cloudName: "dser57xce", // admin.jsより
        uploadPreset: "icko9ktd", // admin.jsより
        sources: ['local', 'url', 'camera'],
        multiple: false,
        folder: 'shizuoka_connect',
        clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        maxImageWidth: 1200,
        maxImageHeight: 1200,
        validateMaxWidthHeight: true,
      }, (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUpload(result.info.secure_url);
        }
      });
    }
  }, []);

  const handleOpen = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      alert("アップローダーを読み込み中です。もう一度押してください。");
    }
  };

  return (
    <>
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        onLoad={() => {
            // ロード完了時に再初期化を試みる
            if (window.cloudinary && !widgetRef.current) {
                // 上記useEffectと同じ初期化処理
                const widget = window.cloudinary.createUploadWidget({
                    cloudName: "dser57xce",
                    uploadPreset: "icko9ktd",
                    sources: ['local', 'url', 'camera'],
                    multiple: false,
                    folder: 'shizuoka_connect',
                    clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
                    maxImageWidth: 1200,
                    maxImageHeight: 1200,
                    validateMaxWidthHeight: true,
                }, (error: any, result: any) => {
                    if (!error && result && result.event === "success") {
                        onUpload(result.info.secure_url);
                    }
                });
                widgetRef.current = widget;
            }
        }}
      />
      <button type="button" onClick={handleOpen} className="btn-preview" style={{width:'auto', whiteSpace:'nowrap'}}>
        {label}
      </button>
    </>
  );
}