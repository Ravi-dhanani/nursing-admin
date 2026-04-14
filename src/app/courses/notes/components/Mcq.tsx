"use client";
import { McqQuestion } from "@/app/api/mcq/route";
import { useQuetionsContextHook } from "@/hooks/QuetionsHook";
import { useEffect, useRef, useState } from "react";

export default function Mcq() {
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<McqQuestion[]>([]);

  const [showDesc, setShowDesc] = useState<Record<string, boolean>>({});
  const { paramsId } = useQuetionsContextHook();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMcq = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/mcq?id=${paramsId}&page=${page}&limit=20`);

      const data = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setQuestions((prev) => [...prev, ...data]); // ✅ append
      }
    } catch (error) {
      console.error("Error fetching MCQ:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    setQuestions([]);
    setPage(1);
    setHasMore(true);
  }, [paramsId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1); // ✅ load next page
        }
      },
      {
        threshold: 1,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (!paramsId) return; // ✅ important

    loadMcq();
  }, [paramsId, page]);

  return (
    <div className="space-y-6">
      {questions?.map((q, index) => {
        const options = [
          { key: "A", text: q.eng3_que_option_a },
          { key: "B", text: q.eng4_que_option_b },
          { key: "C", text: q.eng5_que_option_c },
          { key: "D", text: q.eng6_que_option_d },
        ];

        return (
          <div key={index} className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-semibold">
              {index + 1}. {q.eng1_que_title}
            </h3>

            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.key}
                  className={`rounded-md border p-2 ${
                    showAnswer[q.objectId] && opt.key === q.eng8_correct_answer
                      ? "border-green-500 bg-green-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {opt.key}. {opt.text}
                </div>
              ))}
            </div>

            {/* ANSWER BUTTON */}
            <div className="mt-3 flex w-full items-center justify-end gap-4">
              <button
                onClick={() =>
                  setShowAnswer((prev) => ({
                    ...prev,
                    [q.objectId]: !prev[q.objectId],
                  }))
                }
                className="rounded bg-primary px-4 py-2 text-white"
              >
                {showAnswer[q.objectId] ? "Hide Answer" : "View Answer"}
              </button>
              {q.eng9_que_other_desc && (
                <button
                  onClick={() =>
                    setShowDesc((prev) => ({
                      ...prev,
                      [q.objectId]: !prev[q.objectId],
                    }))
                  }
                  className="rounded bg-gray-600 px-4 py-2 text-white"
                >
                  {showDesc[q.objectId]
                    ? "Hide Description"
                    : "Show Description"}
                </button>
              )}
            </div>
            {/* ANSWER TEXT */}
            {showAnswer[q.objectId] && (
              <p className="mt-2 font-medium text-green-600">
                Answer: {q.eng8_correct_answer}
              </p>
            )}

            {/* DESCRIPTION TEXT */}
            {showDesc[q.objectId] && q.eng9_que_other_desc && (
              <div className="mt-3 rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                {q.eng9_que_other_desc}
              </div>
            )}
          </div>
        );
      })}
      <div ref={loaderRef} className="py-6 text-center">
        {loading && "Loading more..."}
        {!hasMore && "No more questions"}
      </div>
    </div>
  );
}
