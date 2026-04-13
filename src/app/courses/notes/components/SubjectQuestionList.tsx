"use client";

import { tabs } from "@/services/tabs";
import { useState } from "react";
import { McqQuestion } from "../services/mcq.service";
import Mcq from "./Mcq";
import Synofcyc from "./Synofcyc";
import Video from "./Video";

type Props = {
  mcqList: McqQuestion[];
};
export default function SubjectQuestionList({ mcqList }: Props) {
  const [activeTab, setActiveTab] = useState("mcq");

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">GNM Nursing Course</h1>
        <p className="mt-1 text-sm text-gray-500">
          Subject: Anatomy & Physiology
        </p>
      </div>
      {/* TAB HEADER */}
      <div className="mb-5 inline-flex w-full gap-2 rounded-xl border-2 bg-white p-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-5 py-3 transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT (Smooth Transition) */}
      <div className="relative h-[calc(100vh-200px)] overflow-y-auto">
        <div className="mt-4">
          {activeTab === "mcq" && <Mcq mcqQuestion={mcqList} />}
          {activeTab === "video" && <Video />}
          {activeTab === "synofcyc" && <Synofcyc />}
        </div>
      </div>
    </div>
  );
}
