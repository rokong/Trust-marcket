export const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url; // Cloudinary
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${url}`; // legacy local
};
