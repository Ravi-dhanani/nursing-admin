"use client";

import { CourseType } from "@/app/api/courses/route";
import { useLanguage } from "@/common/LanguageContext";
import { createSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Courses() {
  const router = useRouter();

  const [activeTag, setActiveTag] = useState<string>("");

  const { language } = useLanguage();

  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch("/api/courses");

        const data = await res.json();

        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = courses?.filter(
    (item: CourseType) => item?.o9_course_tag === activeTag,
  );

  const uniqueTags = [
    ...new Set(courses.map((item: CourseType) => item.o9_course_tag)),
  ];

  useEffect(() => {
    if (uniqueTags.length > 0 && !activeTag) {
      setActiveTag(uniqueTags[0]);
    }
  }, [uniqueTags, activeTag]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="sticky top-0 h-screen w-80 overflow-y-auto border-r bg-gray-200 p-4">
        <div className="space-y-3">
          {uniqueTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => setActiveTag(tag)}
              className={`ansition-all w-full rounded-md border px-4 py-3 text-left duration-200 ${
                activeTag === tag
                  ? "border-l-4 border-primary bg-white font-semibold text-primary shadow"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4 will-change-transform">
          {/* TITLE */}
          <h2 className="text-lg font-semibold text-gray-700">{activeTag}</h2>

          {/* SUBJECT LIST */}
          {filteredCourses?.map((subject: CourseType, index: number) => (
            <div
              key={index}
              onClick={() => {
                router.push(
                  `/courses/subject/${subject.objectId}/${createSlug(subject.o9_course_tag)}/${createSlug(subject.eng1_course_name)}/${subject?.eng2_course_desc}`,
                );
              }}
              className="group cursor-pointer rounded-md border border-l-4 border-transparent bg-white px-6 py-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:scale-[1.02] hover:border-primary hover:text-primary hover:shadow-md"
            >
              <span className="transition-all duration-300 group-hover:font-medium">
                {language == "en"
                  ? subject.eng1_course_name
                  : subject.guj1_course_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
