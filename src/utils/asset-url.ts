const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8080';

export function resolveAssetUrl(url?: string | null) {
  if (!url) {
    return '';
  }

  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  if (url.startsWith('/uploads/') || url.startsWith('/images/')) {
    return `${backendUrl}${url}`;
  }

  return url;
}
