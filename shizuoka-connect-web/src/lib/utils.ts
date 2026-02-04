// src/lib/utils.ts
export function getOptimizedImage(url: string | undefined | null): string | null {
  if (!url) return null;
  // すでにCloudinaryのURLで、かつ最適化済みなら何もしない
  if (url.includes('res.cloudinary.com') && url.includes('/f_auto,q_auto')) {
      return url;
  }
  // CloudinaryのURLなら最適化パラメータを付与（サイズ指定は一旦外して安定させる）
  if (url.includes('res.cloudinary.com/dser57xce/image/upload/')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  return url;
}