import { QuetionsHook } from "@/hooks/QuetionsHook";
import SubjectQuestionList from "../components/SubjectQuestionList";

export type paramsType = Promise<{ id: string }>;

export default async function Page(props: { params: paramsType }) {
  const { id } = await props.params; // ✅ NO await

  // const mcqList = await getMcqById(id);

  if (!id) return;
  return (
    <QuetionsHook paramsId={id}>
      <SubjectQuestionList />
    </QuetionsHook>
  );
}
