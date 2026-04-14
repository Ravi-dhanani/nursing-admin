export async function fetchVideos(categoryId: string) {
  if (!categoryId) return [];

  const res = await fetch(`/api/video?id=${categoryId}`);

  return res.json();
}
