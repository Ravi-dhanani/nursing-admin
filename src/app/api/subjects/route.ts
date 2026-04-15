import Parse from "@/app/components/parse";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return Response.json(
        { success: false, error: "Missing courseId" },
        { status: 400 },
      );
    }

    const Subject = Parse.Object.extend("CourseSubjects");
    const query = new Parse.Query(Subject);

    query.equalTo("a1_course_id", courseId);

    const results = await query.find();

    const data = results.map((item) => ({
      objectId: item.id ?? "",

      a1_course_id: item.get("a1_course_id") ?? "",

      eng1_subject_name: item.get("eng1_subject_name") ?? "",
      guj1_subject_name: item.get("guj1_subject_name") ?? "",

      a2_subject_number: item.get("a2_subject_number") ?? 0,
      eng2_video_title: item.get("eng2_video_title") ?? "",

      eng2_synopsis_title: item.get("eng2_synopsis_title") ?? "",
      guj2_synopsis_title: item.get("guj2_synopsis_title") ?? "",

      createdAt: item.createdAt?.toISOString() ?? "",
      updatedAt: item.updatedAt?.toISOString() ?? "",
    }));

    return Response.json({ success: true, data });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
