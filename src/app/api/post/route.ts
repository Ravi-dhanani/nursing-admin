// import { NextRequest, NextResponse } from "next/server";

// export type Post = {
//   content: {
//     rendered: string;
//   };
// };

// export async function GET(req: NextRequest) {
//   try {
//     const id = req.nextUrl.searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Post ID is required" },
//         { status: 400 },
//       );
//     }

//     const res = await fetch(
//       `https://mynursingapp.in/wp-json/wp/v2/posts/${id}`,
//       {
//         cache: "no-store",
//       },
//     );

//     const data: Post = await res.json();

//     if (!data?.content?.rendered) {
//       return NextResponse.json({ error: "No content found" }, { status: 404 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }

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

    const wpRes = await fetch(
      `https://mynursingapp.in/wp-json/wp/v2/posts/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          // User-Agent prevents WordPress/Cloudflare/Wordfence from blocking Vercel
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        cache: "no-store",
      },
    );

    // If WordPress responded with non-200 (404, 403, 500, etc.)
    if (!wpRes.ok) {
      const errorText = await wpRes.text();
      console.error(
        `[Vercel Server] WP Fetch failed for ID ${id}. Status: ${wpRes.status}. Response: ${errorText}`,
      );
      return NextResponse.json(
        { error: `WordPress API returned status ${wpRes.status}` },
        { status: wpRes.status },
      );
    }

    const data: Post = await wpRes.json();

    if (!data?.content?.rendered) {
      console.error(`[Vercel Server] No content.rendered for ID ${id}:`, data);
      return NextResponse.json({ error: "No content found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Vercel Server] Unexpected API route error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
