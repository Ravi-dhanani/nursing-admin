"use client";
import { useEffect, useRef, useState } from "react";

const allQuestions = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  question: `Question ${i + 1}: What is the correct answer?`,
  options: ["Option A", "Option B", "Option C", "Option D"],
  answer: "Option B",
}));

export default function Mcq() {
  const [visibleCount, setVisibleCount] = useState(20);
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 20);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {allQuestions.slice(0, visibleCount).map((q, index) => (
        <div key={q.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold">{q.question}</h3>

          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <div
                key={i}
                className={`rounded-md border p-2 ${
                  showAnswer[q.id] && opt === q.answer
                    ? "border-green-500 bg-green-100"
                    : "hover:bg-gray-100"
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
          <div className="mt-3 flex w-full items-center justify-between">
            {showAnswer[q.id] ? (
              <span className="font-medium text-green-600">
                Answer: {q.answer}
              </span>
            ) : (
              <span />
            )}

            <button
              onClick={() =>
                setShowAnswer((prev) => ({
                  ...prev,
                  [q.id]: !prev[q.id],
                }))
              }
              className="rounded bg-primary px-4 py-2 text-white"
            >
              {showAnswer[q.id] ? "Hide Answer" : "View Answer"}
            </button>
          </div>
        </div>
      ))}

      <div ref={loaderRef} className="flex h-10 items-center justify-center">
        <span className="text-gray-500">Loading more...</span>
      </div>
    </div>
  );
}
