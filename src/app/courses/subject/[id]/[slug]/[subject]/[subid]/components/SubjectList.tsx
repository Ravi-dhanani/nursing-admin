"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SubjectItem = {
  eng1_subject_name: string;
  eng2_course_desc?: string | null;
  objectId: string | null;
};

interface SubjectListProps {
  id: string;
}

export default function SubjectList({ id }: SubjectListProps) {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  console.log(subjects);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch(`/api/subjects?courseId=${id}`);

        const data = await res.json();

        setSubjects(data?.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    loadCourses();
  }, []);
  return (
    <div className="h-full w-3/5 overflow-y-auto">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-6">
          {subjects?.map((subject, i) => (
            <div
              key={i}
              onClick={() => {
                router.push(`/courses/notes/${subject.objectId}`);
              }}
              className="flex h-24 cursor-pointer items-center justify-center rounded-md border p-2 text-center hover:bg-primary hover:text-white"
            >
              {subject.eng1_subject_name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
