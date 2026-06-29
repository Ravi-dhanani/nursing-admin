import Parse from "@/app/components/parse";

export type Material = {
  b1_content_type: string;
  a1_eng_title: string;
  a2_guj_title: string;
  c1_sort_number: number;
  createdAt: string;
  updatedAt: string;
  objectId: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("type");

    const Materials = Parse.Object.extend("TitlesTable");

    const query1 = new Parse.Query(Materials);
    query1.equalTo("d1_content_type", 1);

    const query2 = new Parse.Query(Materials);
    query2.equalTo("d1_content_type", 3);

    const query3 = new Parse.Query(Materials);
    query3.doesNotExist("d1_content_type");

    const query = Parse.Query.or(query1, query2, query3);

    query.equalTo("b1_content_type", contentType);

    query.ascending("c1_sort_number");

    const results = await query.find();

    const data: Material[] = results.map((item) => ({
      objectId: item.id as string,

      b1_content_type: item.get("b1_content_type") as string,
      a1_eng_title: item.get("a1_eng_title") as string,
      a2_guj_title: item.get("a2_guj_title") as string,
      c1_sort_number: item.get("c1_sort_number") as number,

      createdAt: item.createdAt?.toISOString() as string,
      updatedAt: item.updatedAt?.toISOString() as string,
    }));

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch materials" },
      { status: 500 },
    );
  }
}
