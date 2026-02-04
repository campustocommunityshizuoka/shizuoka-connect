// src/lib/utils.ts
export function getOptimizedImage(url: string | undefined | null): string | null {
  if (!url) return null;
  
  // CloudinaryのURLではない場合はそのまま返す
  if (!url.includes('res.cloudinary.com')) return url;

  // すでに最適化パラメータが入っている場合は二重に付与しない
  if (url.includes('/f_auto,q_auto/')) return url;

  // 通常のアップロードURLに最適化パラメータを挿入
  if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  
  return url;
}