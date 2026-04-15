"use client";
import { McqQuestion } from "@/app/api/mcq/route";
import Loading from "@/common/Loading";
import NoData from "@/common/NoData";
import { useQuetionsContextHook } from "@/hooks/QuetionsHook";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Mcq() {
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [showDesc, setShowDesc] = useState<Record<string, boolean>>({});
  const { paramsId } = useQuetionsContextHook();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMcq = useCallback(
    async (isInitial: boolean = false) => {
      if (!paramsId || loading || (!hasMore && !isInitial)) return;

      setLoading(true);
      const currentPage = isInitial ? 1 : page;

      try {
        const res = await fetch(
          `/api/mcq?id=${paramsId}&page=${currentPage}&limit=20`,
        );
        const result = await res.json();
        const newQuestions = result.data || [];

        setQuestions((prev) =>
          isInitial ? newQuestions : [...prev, ...newQuestions],
        );
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Error fetching MCQ:", error);
      } finally {
        setLoading(false);
      }
    },
    [paramsId, page, hasMore, loading],
  );

  useEffect(() => {
    if (!paramsId) return;

    // Reset state
    setQuestions([]);
    setPage(1);
    setHasMore(true);
    setShowAnswer({});
    setShowDesc({});

    // Load first page immediately
    loadMcq(true);
  }, [paramsId]);

  useEffect(() => {
    if (page > 1) {
      loadMcq();
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }, // Trigger as soon as the loader enters view
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 700) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!questions.length && !loading) return <NoData title="No MCQ Available" />;

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
          <div
            key={`${q.objectId}-${index}`}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="mb-3 font-semibold">
              {index + 1}. {q.eng1_que_title}
            </h3>

            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.key}
                  className={`rounded-md border p-2 transition-colors ${
                    showAnswer[q.objectId] && opt.key === q.eng8_correct_answer
                      ? "border-green-500 bg-green-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-2 font-bold">{opt.key}.</span> {opt.text}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  setShowAnswer((p) => ({ ...p, [q.objectId]: !p[q.objectId] }))
                }
                className="rounded bg-primary px-4 py-2 text-sm text-white"
              >
                {showAnswer[q.objectId] ? "Hide Answer" : "View Answer"}
              </button>

              {q.eng9_que_other_desc && (
                <button
                  onClick={() =>
                    setShowDesc((p) => ({ ...p, [q.objectId]: !p[q.objectId] }))
                  }
                  className="rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  {showDesc[q.objectId]
                    ? "Hide Description"
                    : "Show Description"}
                </button>
              )}
            </div>

            {showAnswer[q.objectId] && (
              <p className="mt-3 rounded border border-green-200 bg-green-50 p-2 font-bold text-green-700">
                Correct Answer: {q.eng8_correct_answer}
              </p>
            )}

            {showDesc[q.objectId] && q.eng9_que_other_desc && (
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-gray-800">
                <p className="mb-1 font-semibold">Explanation:</p>
                {q.eng9_que_other_desc}
              </div>
            )}
          </div>
        );
      })}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-primary px-4 py-3 text-white shadow-lg transition hover:scale-105"
        >
          ↑ Top
        </button>
      )}
      <div
        ref={loaderRef}
        className="flex items-center justify-center bg-white py-10 font-bold italic text-primary"
      >
        {loading ? <Loading /> : !hasMore ? "No more MCQ available..." : null}
      </div>
    </div>
  );
}
