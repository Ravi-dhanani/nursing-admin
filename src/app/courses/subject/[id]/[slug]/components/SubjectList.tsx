"use client";

import { useLanguage } from "@/common/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SubjectItem = {
  eng1_subject_name: string;
  guj1_subject_name: string;
  eng2_video_title: string;
  eng2_course_desc?: string | null;
  objectId: string | null;
};

interface SubjectListProps {
  id: string;
  slug: string;
  subject: string | null;
}

export default function SubjectList({
  id,
  slug,
  subject: subjectName,
}: SubjectListProps) {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id || hasFetched.current) return;

    hasFetched.current = true;

    const loadSubjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/subjects?courseId=${id}`);
        const data = await res.json();
        setSubjects(data?.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [id]);

  return (
    <div className="h-full w-3/5 overflow-y-auto">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-24 animate-pulse items-center justify-center rounded-md border bg-gray-200"
                >
                  <div className="h-4 w-24 rounded bg-gray-300"></div>
                </div>
              ))
            : subjects?.map((subject, i) => (
                <div
                  key={i}
                  onClick={() => {
                    router.push(
                      `/courses/subject/${id}/${slug}/notes/${subject.objectId}?name=${encodeURIComponent(subjectName ?? "")}`,
                    );

                    localStorage.setItem(
                      "video_title",
                      subject.eng2_video_title || "",
                    );
                  }}
                  className="flex h-24 cursor-pointer items-center justify-center rounded-md border p-2 text-center transition hover:bg-primary hover:font-bold hover:text-white"
                >
                  {language === "English"
                    ? subject.eng1_subject_name
                    : subject.guj1_subject_name}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
