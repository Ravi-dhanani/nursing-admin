import { QuetionsHook } from "@/hooks/QuetionsHook";
import SubjectQuestionList from "./components/SubjectQuestionList";

// 1. The type MUST match every [folder] in your screenshot path
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

// 2. The function MUST be async
export default async function Page({ params, searchParams }: PageProps) {
  // 3. Await the params before destructuring
  const { objectId, slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!objectId) return null;

  const name = resolvedSearchParams?.name
    ? decodeURIComponent(resolvedSearchParams.name)
    : "";

  return (
    <QuetionsHook paramsId={objectId}>
      <SubjectQuestionList courseName={slug} subjectName={name} />
    </QuetionsHook>
  );
}
