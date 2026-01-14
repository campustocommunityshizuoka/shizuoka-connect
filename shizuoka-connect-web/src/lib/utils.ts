// Cloudinary等の画像最適化ロジック
export function getOptimizedImage(url: string | undefined | null): string | null {
  if (!url) return null;
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/f_auto,q_auto')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
}

// FirestoreのTimestampなどをシリアライズ（JSON化）するためのヘルパー
export function serializeData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}