export async function fetchVideos(categoryId: string) {
  if (!categoryId) return [];

  const res = await fetch(`/api/video?id=${categoryId}`);

  console.log(res);

  return res.json();
}
