"use client";
import { Post } from "@/app/api/post/route";
import { useEffect, useState } from "react";

interface PostContentTypes {
  subId: string | undefined;
}
export default function PostContent({ subId }: PostContentTypes) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!subId) return;
        const res = await fetch(`/api/post?id=${subId}`);

        const data: Post = await res.json();

        setPost(data);
      } catch (error) {
        console.error(error);
        setPost(null);
      }
    };

    if (subId) load();
  }, [subId]);
  return (
    <div>
      {post?.content?.rendered ? (
        <div
          dangerouslySetInnerHTML={{
            __html: post.content.rendered,
          }}
        />
      ) : null}
    </div>
  );
}
