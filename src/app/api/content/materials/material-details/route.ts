import Parse from "@/app/components/parse";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const Materials = Parse.Object.extend("SubTitlesTable");
    const query = new Parse.Query(Materials);

    query.equalTo("a1_title_id", id);

    query.ascending("d1_sort_number");

    const results = await query.find();

    const data = results.map((item) => ({
      objectId: item.id as string,

      a1_title_id: item.get("a1_title_id") as string,
      b1_post_id: item.get("b1_post_id") as string,

      c1_subtitle_eng: item.get("c1_subtitle_eng") as string,
      c2_subtitle_guj: item.get("c2_subtitle_guj") as string,

      d1_sort_number: item.get("d1_sort_number") as number,

      p1_pdf_file: item.get("p1_pdf_file")
        ? {
            __type: item.get("p1_pdf_file"),
            url: item.get("p1_pdf_file").url(),
            name: item.get("p1_pdf_file").name(),
          }
        : null,

      createdAt: item.createdAt?.toISOString() as string,
      updatedAt: item.updatedAt?.toISOString() as string,
    }));

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch material details" },
      { status: 500 },
    );
  }
}
