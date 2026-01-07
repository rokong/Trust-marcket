export const resolveMediaUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  return `https://trust-market-backend-nsao.onrender.com/uploads/${url}`;
};
