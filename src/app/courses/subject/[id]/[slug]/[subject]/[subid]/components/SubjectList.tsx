"use client";

import { useRouter } from "next/navigation";

type SubjectItem = {
  eng1_subject_name: string;
  eng2_course_desc?: string | null;
  objectId: string | null;
};

interface SubjectListProps {
  subjects: SubjectItem[] | null | undefined;
}

export default function SubjectList({ subjects }: SubjectListProps) {
  const router = useRouter();

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
