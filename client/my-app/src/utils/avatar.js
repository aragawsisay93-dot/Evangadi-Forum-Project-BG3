const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5500";

export const toAvatarUrl = (avatarUrl, v) => {
  if (!avatarUrl) return "/default-avatar.png";
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;

  const path = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
  const url = `${BASE_URL}${path}`;

  return v ? `${url}?v=${v}` : url; // ✅ fixes “not changing” due to cache
};
