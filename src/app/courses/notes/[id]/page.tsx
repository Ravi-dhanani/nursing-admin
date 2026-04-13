import SubjectQuestionList from "../components/SubjectQuestionList";
import { getMcqById } from "../services/mcq.service";

export type paramsType = Promise<{ id: string }>;

export default async function Page(props: { params: paramsType }) {
  const { id } = await props.params; // ✅ NO await

  const mcqList = await getMcqById(id);

  return <SubjectQuestionList mcqList={mcqList ?? []} />;
}
