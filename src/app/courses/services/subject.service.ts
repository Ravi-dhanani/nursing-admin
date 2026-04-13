import Parse from "../../../app/components/parse";

export type SubjectType = {
  objectId: string;

  a1_course_id: string;

  eng1_subject_name: string;
  guj1_subject_name: string;

  a2_subject_number: number;

  eng2_synopsis_title: string;
  guj2_synopsis_title: string;

  createdAt: string;
  updatedAt: string;
};

export async function getSubjectsByCourseId(
  courseId: string,
): Promise<SubjectType[]> {
  const Subject = Parse.Object.extend("CourseSubjects");
  const query = new Parse.Query(Subject);

  query.equalTo("a1_course_id", courseId);

  const results = await query.find();

  return results.map((item) => ({
    objectId: item.id as string,

    a1_course_id: item.get("a1_course_id") as string,

    eng1_subject_name: item.get("eng1_subject_name") as string,
    guj1_subject_name: item.get("guj1_subject_name") as string,

    a2_subject_number: item.get("a2_subject_number") as number,

    eng2_synopsis_title: item.get("eng2_synopsis_title") as string,
    guj2_synopsis_title: item.get("guj2_synopsis_title") as string,

    createdAt: item.createdAt?.toISOString() as string,
    updatedAt: item.updatedAt?.toISOString() as string,
  }));
}
