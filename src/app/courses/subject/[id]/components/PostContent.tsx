"use client";
import { Post } from "@/app/api/post/route";
import Loading from "@/common/Loading";
import { useEffect, useState } from "react";

interface PostContentTypes {
  subId: string | undefined;
}
export default function PostContent({ subId }: PostContentTypes) {
  const [post, setPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!subId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/post?id=${encodeURIComponent(subId)}`, {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // Prevents aggressive edge caching on Vercel
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch post: ${res.statusText}`);
        }

        const data: Post = await res.json();

        if (isMounted) {
          setPost(data);
        }
      } catch (err) {
        console.error("Error fetching post content:", err);
        if (isMounted) {
          setPost(null);
          setError("Failed to load content.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [subId]);

  console.log(post, "post");

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {post?.content?.rendered ? (
        <div
          className="pointer-events-none select-none"
          style={{
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
          }}
          dangerouslySetInnerHTML={{
            __html: post.content.rendered,
          }}
        />
      ) : null}
    </div>
  );
}
