import Parse from "@/app/components/parse";

export type SynopsisItem = {
  eng1_synp_title: string;
  guj1_synp_title: string;
  eng1_synp_link: string;
  guj1_synp_link: string;
  a1_unit_number: number;
  a1_subject_id: string;
  createdAt: string; // or Date
  updatedAt: string;
  objectId: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const synopsisCategoryId = searchParams.get("synopsisId");

    if (!synopsisCategoryId) {
      return Response.json(
        { success: false, error: "Missing synopsisId" },
        { status: 400 },
      );
    }

    const Synopsis = Parse.Object.extend("Synopsis");
    const query = new Parse.Query(Synopsis);

    query.equalTo("a1_subject_id", synopsisCategoryId);

    const results = await query.find();

    const data = results.map((item) => ({
      objectId: item.id as string,

      eng1_synp_title: item.get("eng1_synp_title") as string,
      guj1_synp_title: item.get("guj1_synp_title") as string,

      eng1_synp_link: item.get("eng1_synp_link") as string,
      guj1_synp_link: item.get("guj1_synp_link") as string,
      a1_unit_number: item.get("a1_unit_number") as number,

      a1_subject_id: item.get("a1_subject_id") as string,

      createdAt: item.createdAt?.toISOString() as string,
      updatedAt: item.updatedAt?.toISOString() as string,
    }));

    return Response.json(data);
  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
