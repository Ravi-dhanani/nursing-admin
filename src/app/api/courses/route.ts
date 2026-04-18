import Parse from "@/app/components/parse";

export type CourseType = {
  objectId: string;

  eng1_course_name: string;
  guj1_course_name: string;

  o1_course_iap_id: string;
  a1_course_number: number;

  is_active: number;
  o2_course_validity: number;

  o3_free_mcq: number;
  o4_free_synopsis: number;
  o5_free_videos: number;

  o6_which_type: string;
  o9_course_tag: string;

  p1_tag_order: number;

  t1_original_price: number;
  t2_offer_price: number;

  eng2_course_desc: string;
  guj2_course_desc: string;

  a2_is_item_active: boolean;

  createdAt: string;
  updatedAt: string;
};

export async function GET() {
  const Course = Parse.Object.extend("AllCourses");
  const query = new Parse.Query(Course);

  query.equalTo("o6_which_type", "COURSE");

  query.equalTo("a2_is_item_active", true);
  query.ascending("a1_course_number");

  const results = await query.find();

  const data = results.map((item) => ({
    objectId: item.id as string,

    eng1_course_name: item.get("eng1_course_name") as string,
    guj1_course_name: item.get("guj1_course_name") as string,

    o1_course_iap_id: item.get("o1_course_iap_id") as string,
    a1_course_number: item.get("a1_course_number") as number,

    is_active: item.get("is_active") as number,
    o2_course_validity: item.get("o2_course_validity") as number,

    o3_free_mcq: item.get("o3_free_mcq") as number,
    o4_free_synopsis: item.get("o4_free_synopsis") as number,
    o5_free_videos: item.get("o5_free_videos") as number,

    o6_which_type: item.get("o6_which_type") as string,
    o9_course_tag: item.get("o9_course_tag") as string,

    p1_tag_order: item.get("p1_tag_order") as number,

    t1_original_price: item.get("t1_original_price") as number,
    t2_offer_price: item.get("t2_offer_price") as number,

    eng2_course_desc: item.get("eng2_course_desc") as string,
    guj2_course_desc: item.get("guj2_course_desc") as string,

    a2_is_item_active: item.get("a2_is_item_active") as boolean,

    createdAt: item.createdAt?.toISOString() as string,
    updatedAt: item.updatedAt?.toISOString() as string,
  }));

  return Response.json(data);
}
