import { QuetionsHook } from "@/hooks/QuetionsHook";
import SubjectQuestionList from "./components/SubjectQuestionList";

export type paramsType = Promise<{
  objectId: string;
  slug: string;
  subject: string;
}>;

export default async function Page(props: { params: paramsType }) {
  const { objectId, slug, subject } = await props.params; // ✅ NO await
  if (!objectId) return;
  return (
    <QuetionsHook paramsId={objectId}>
      <SubjectQuestionList courseName={slug} subjectName={subject} />
    </QuetionsHook>
  );
}
