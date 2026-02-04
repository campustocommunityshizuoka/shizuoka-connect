export function getOptimizedImage(url: string | undefined | null): string | null {
  if (!url) return null;

  // ★重要：CloudinaryのURLでない場合は、即座にそのままのURLを返す
  // これにより、Next.jsのプリロードURLと実際の使用URLが一致します
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // すでに最適化済みなら何もしない
  if (url.includes('/f_auto,q_auto')) {
    return url;
  }

  // CloudinaryのURLなら最適化パラメータを付与
  if (url.includes('res.cloudinary.com/dser57xce/image/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  return url;
}