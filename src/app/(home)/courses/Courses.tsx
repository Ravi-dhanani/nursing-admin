"use client";

import { CourseType } from "@/app/api/courses/route";
import { useLanguage } from "@/common/LanguageContext";
import { createSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Courses() {
  const router = useRouter();

  const [activeTag, setActiveTag] = useState<string>("");
  const [activeSubject, setActiveSubject] = useState<string>("");

  const { language } = useLanguage();

  const [courses, setCourses] = useState<CourseType[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/courses");
        const data = await res.json();

        setCourses(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const uniqueTags = [
    ...new Set(courses.map((item: CourseType) => item.o9_course_tag)),
  ];

  const selectedTag = activeTag || uniqueTags[0] || "";

  const filteredCourses = courses?.filter(
    (item: CourseType) => item?.o9_course_tag === selectedTag,
  );

  useEffect(() => {
    const savedTag = sessionStorage.getItem("activeTag");
    const savedSubject = sessionStorage.getItem("activeSubject");

    if (savedTag) setActiveTag(savedTag);
    if (savedSubject) setActiveSubject(savedSubject);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <div className="w-full border-b bg-gray-200 p-3 md:sticky md:top-0 md:h-screen md:w-80 md:overflow-y-auto md:border-b-0 md:border-r md:p-4">
        <div className="flex gap-3 overflow-x-auto md:flex-col md:space-y-3 md:overflow-visible">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 min-w-[150px] animate-pulse rounded-md bg-gray-300 md:w-full"
                />
              ))
            : uniqueTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveTag(tag);
                    setActiveSubject("");
                  }}
                  className={`min-w-[200px] rounded-md border px-4 py-3 text-left transition-all md:w-full ${
                    activeTag
                      ? activeTag === tag
                        ? "border-l-4 border-primary bg-white font-semibold text-primary shadow"
                        : "bg-white hover:bg-gray-100"
                      : index === 0
                        ? "border-l-4 border-primary bg-white font-semibold text-primary shadow"
                        : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* TITLE */}
          <h2 className="text-lg font-semibold text-gray-700 sm:text-xl">
            {selectedTag}
          </h2>

          {/* SUBJECT LIST */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-md border bg-white px-5 py-4"
                >
                  <div className="h-4 w-1/2 rounded bg-gray-300" />
                </div>
              ))}
            </div>
          ) : (
            filteredCourses?.map((subject: CourseType) => (
              <div
                key={subject.objectId}
                onClick={() => {
                  sessionStorage.setItem("activeTag", selectedTag);

                  sessionStorage.setItem("activeSubject", subject.objectId);

                  localStorage.setItem(
                    "free-videos-limit",
                    JSON.stringify(subject.o5_free_videos),
                  );

                  localStorage.setItem(
                    "free-mcq-limit",
                    JSON.stringify(subject.o3_free_mcq),
                  );

                  localStorage.setItem(
                    "free-synopsis-limit",
                    JSON.stringify(subject.o4_free_synopsis),
                  );

                  localStorage.setItem(
                    "subjectName",
                    JSON.stringify({
                      english: subject.eng1_course_name,
                      gujrati: subject.guj1_course_name,
                    }),
                  );

                  localStorage.setItem(
                    "subjectId",
                    JSON.stringify({
                      english: subject.eng2_course_desc,
                      gujrati: subject.guj2_course_desc,
                    }),
                  );
                  router.push(
                    `/courses/subject/${subject.objectId}?iapid=${subject.o1_course_iap_id}&name=${createSlug(
                      language === "English"
                        ? subject.eng1_course_name
                        : subject.guj1_course_name,
                    )}&course_name=${encodeURIComponent(
                      subject.o9_course_tag,
                    )}`,
                  );
                }}
                className={`group cursor-pointer rounded-lg border bg-white px-5 py-4 shadow-sm transition-all duration-300 sm:px-6 ${
                  activeSubject === subject.objectId
                    ? "border-primary text-primary shadow-md"
                    : "hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-md"
                }`}
              >
                <span className="select-none text-sm font-medium sm:text-base">
                  {language === "English"
                    ? subject.eng1_course_name
                    : subject.guj1_course_name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
