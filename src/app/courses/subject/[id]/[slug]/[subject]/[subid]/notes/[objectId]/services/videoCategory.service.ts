export async function fetchVideoCategories(subjectId?: string) {
  if (!subjectId) return;

  const res = await fetch(`/api/video-category?id=${subjectId}`);

  if (!res.ok) throw new Error("Failed to fetch categories");

  return res.json();
}
