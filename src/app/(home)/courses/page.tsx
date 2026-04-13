import Loading from "@/common/Loading";
import { Suspense } from "react";
import CoursesPage from "./Courses";
import { getCourses } from "./services/subject.service";

export default async function Page() {
  const courses = await getCourses();

  return (
    <Suspense fallback={<Loading />}>
      <CoursesPage courses={courses} />
    </Suspense>
  );
}
