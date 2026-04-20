import { QuetionsHook } from "@/hooks/QuetionsHook";
import SubjectQuestionList from "./components/SubjectQuestionList";

type PageProps = {
  params: Promise<{
    id: string;
    slug: string;
    subid: string;
    objectId: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { objectId, slug } = await params;

  if (!objectId) return null;

  return (
    <QuetionsHook paramsId={objectId}>
      <SubjectQuestionList courseName={slug} />
    </QuetionsHook>
  );
}
