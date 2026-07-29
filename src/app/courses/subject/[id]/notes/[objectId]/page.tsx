import { QuetionsHook } from "@/hooks/QuetionsHook";
import SubjectQuestionList from "./components/SubjectQuestionList";

type PageProps = {
  params: Promise<{
    id: string;
    subid: string;
    objectId: string;
  }>;
  searchParams: Promise<{
    name?: string;
    course_name?: string;
    subject_name?: string;
  }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { objectId } = await params;
  const resolvedSearchParams = await searchParams;

  const course_name = resolvedSearchParams?.course_name
    ? decodeURIComponent(resolvedSearchParams.course_name)
    : "";

  const subject_name = resolvedSearchParams?.subject_name
    ? decodeURIComponent(resolvedSearchParams?.subject_name)
    : "";

  if (!objectId) return null;
  return (
    <QuetionsHook paramsId={objectId}>
      <SubjectQuestionList
        courseName={course_name}
        subject_name={subject_name}
      />
    </QuetionsHook>
  );
}
