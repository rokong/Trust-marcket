//frontend/utils/resolveMediaUrl.js
export function resolveMediaUrl(url) {
  if (!url) return "";

  // Already absolute URL (Cloudinary, http, https)
  if (url.startsWith("http")) return url;

  // Legacy local upload
  return `https://trust-market-backend-nsao.onrender.com/uploads/${url}`;
}
