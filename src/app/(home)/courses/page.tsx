"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Category {
  category: string;
  subjects: string[];
}

export default function CoursesPage() {
  const router = useRouter();

  const data: Category[] = [
    {
      category: "GNM (ENGLISH)",
      subjects: [
        "SUBJECT NOTES",
        "PAPER SOLUTION",
        "PRACTICAL VIVA",
        "IMPORTANT QUESTIONS",
        "MODEL PAPERS",
        "PREVIOUS YEAR PAPERS",
        "SHORT NOTES",
        "LONG QUESTIONS",
        "CASE STUDIES",
        "ASSIGNMENTS",
        "LAB MANUAL",
        "CLINICAL PROCEDURES",
        "MCQ QUESTIONS",
        "REVISION NOTES",
        "EXAM GUIDELINES",
      ],
    },
    {
      category: "GNM (ENGLISH + GUJ)",
      subjects: [
        "NOTES",
        "VIVA QUESTIONS",
        "PRACTICAL GUIDE",
        "IMPORTANT QUESTIONS",
        "MODEL PAPERS",
        "OLD PAPERS",
        "SHORT ANSWERS",
        "LONG ANSWERS",
        "CASE STUDIES",
        "ASSIGNMENTS",
        "LAB WORK",
        "CLINICAL PRACTICE",
        "MCQ SET",
        "REVISION MATERIAL",
        "EXAM PREPARATION",
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<number>(0);

  const selectedCategory = data[activeCategory];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="sticky top-0 h-screen w-64 overflow-y-auto border-r bg-gray-200 p-4">
        <div className="space-y-3">
          {data.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`ansition-all w-full rounded-md border px-4 py-3 text-left duration-200 ${
                activeCategory === index
                  ? "border-l-4 border-primary bg-white font-semibold text-primary shadow"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4 will-change-transform">
          {/* TITLE */}
          <h2 className="text-lg font-semibold text-gray-700">
            {selectedCategory.category}
          </h2>

          {/* SUBJECT LIST */}
          {selectedCategory.subjects.map((subject, index) => (
            <div
              key={index}
              onClick={() =>
                router.push(
                  `/courses/${encodeURIComponent(selectedCategory.category)}/${encodeURIComponent(subject)}`,
                )
              }
              className="group cursor-pointer rounded-md border border-l-4 border-transparent bg-white px-6 py-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:scale-[1.02] hover:border-primary hover:text-primary hover:shadow-md"
            >
              <span className="transition-all duration-300 group-hover:font-medium">
                {subject}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
