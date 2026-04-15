import { NextRequest, NextResponse } from "next/server";

export type Post = {
  content: {
    rendered: string;
  };
};

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `https://mynursingapp.in/wp-json/wp/v2/posts/${id}`,
      {
        cache: "no-store",
      },
    );

    const data: Post = await res.json();

    if (!data?.content?.rendered) {
      return NextResponse.json({ error: "No content found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
