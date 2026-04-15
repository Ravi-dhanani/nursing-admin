type Post = {
  content: {
    rendered: string;
  };
};

export async function getPostById(id?: string): Promise<Post | null> {
  try {
    if (!id) return null;

    const res = await fetch(
      `https://mynursingapp.in/wp-json/wp/v2/posts/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (!data?.content?.rendered) return null;

    return data;
  } catch (error) {
    return null;
  }
}
