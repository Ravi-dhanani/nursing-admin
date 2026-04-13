"use client";
import { useState } from "react";
import { McqQuestion } from "../services/mcq.service";

type Props = {
  mcqQuestion: McqQuestion[];
};

export default function Mcq({ mcqQuestion }: Props) {
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [showDesc, setShowDesc] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      {mcqQuestion?.map((q, index) => {
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
    </div>
  );
}
