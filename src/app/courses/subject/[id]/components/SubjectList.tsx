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
  o1_course_iap_id: string;
};

interface SubjectListProps {
  id: string;
  slug: string;
  subject: string | null;
  iapid: string | null;
}

export default function SubjectList({
  id,
  slug,
  iapid,
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
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [id]);

  console.log(slug);

  return (
    <div className="h-full w-full overflow-y-auto lg:w-3/5">
      <div className="p-4">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2">
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
                    localStorage.setItem("iapid", String(iapid));

                    localStorage.setItem(
                      "video_title",
                      subject.eng2_video_title || "",
                    );
                    router.push(
                      `/courses/subject/${id}/notes/${subject.objectId}?name=${encodeURIComponent(subjectName ?? "")}&course_name=${encodeURIComponent(slug)}&subject_name=${encodeURIComponent(
                        language === "English"
                          ? subject.eng1_subject_name
                          : subject.guj1_subject_name,
                      )}`,
                    );
                  }}
                  className="flex h-24 cursor-pointer select-none items-center justify-center rounded-md border p-2 text-center transition hover:bg-primary hover:font-bold hover:text-white"
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
