import Parse from "../../../components/parse";

export type McqQuestion = {
  objectId: string;

  a1_subject_id: string;
  a2_que_number: number;

  eng1_que_title: string;
  guj1_que_title: string;

  eng3_que_option_a: string;
  eng4_que_option_b: string;
  eng5_que_option_c: string;
  eng6_que_option_d: string;

  guj3_que_option_a: string;
  guj4_que_option_b: string;
  guj5_que_option_c: string;
  guj6_que_option_d: string;

  eng8_correct_answer: string;
  guj8_correct_answer: string;

  eng9_que_other_desc?: string;
  guj9_que_other_desc?: string;

  createdAt: string;
  updatedAt: string;
};

export async function getMcqById(id: string): Promise<McqQuestion[]> {
  const McqModel = Parse.Object.extend("SubjectQuestions");
  const query = new Parse.Query(McqModel);

  query.equalTo("a1_subject_id", id);

  const results = await query.find();

  return results.map((item) => ({
    objectId: item.id,

    a1_subject_id: item.get("a1_subject_id"),
    a2_que_number: item.get("a2_que_number"),

    eng1_que_title: item.get("eng1_que_title"),
    guj1_que_title: item.get("guj1_que_title"),

    eng3_que_option_a: item.get("eng3_que_option_a"),
    eng4_que_option_b: item.get("eng4_que_option_b"),
    eng5_que_option_c: item.get("eng5_que_option_c"),
    eng6_que_option_d: item.get("eng6_que_option_d"),

    guj3_que_option_a: item.get("guj3_que_option_a"),
    guj4_que_option_b: item.get("guj4_que_option_b"),
    guj5_que_option_c: item.get("guj5_que_option_c"),
    guj6_que_option_d: item.get("guj6_que_option_d"),

    eng8_correct_answer: item.get("eng8_correct_answer"),
    guj8_correct_answer: item.get("guj8_correct_answer"),

    eng9_que_other_desc: item.get("eng9_que_other_desc"),
    guj9_que_other_desc: item.get("guj9_que_other_desc"),

    createdAt: item.createdAt?.toISOString() || "",
    updatedAt: item.updatedAt?.toISOString() || "",
  }));
}
