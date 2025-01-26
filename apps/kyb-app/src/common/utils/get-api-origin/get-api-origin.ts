export const getApiOrigin = () => {
  const url = new URL(import.meta.env.VITE_API_URL);

  return url.origin;
};
