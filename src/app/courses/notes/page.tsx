"use client";
import { useState } from "react";
import Mcq from "./components/Mcq";
import Synofcyc from "./components/Synofcyc";
import Video from "./components/Video";

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState("mcq");

  const tabs = [
    {
      id: "mcq",
      label: "MCQ",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file-spreadsheet-icon lucide-file-spreadsheet"
        >
          <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
          <path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <path d="M8 13h2" />
          <path d="M14 13h2" />
          <path d="M8 17h2" />
          <path d="M14 17h2" />
        </svg>
      ),
    },
    {
      id: "video",
      label: "Video",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file-play-icon lucide-file-play"
        >
          <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
          <path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <path d="M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z" />
        </svg>
      ),
    },
    {
      id: "synofcyc",
      label: "Synofcyc",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-rows4-icon lucide-rows-4"
        >
          <rect width={18} height={18} x={3} y={3} rx={2} />
          <path d="M21 7.5H3" />
          <path d="M21 12H3" />
          <path d="M21 16.5H3" />
        </svg>
      ),
    },
  ];

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
          {activeTab === "mcq" && <Mcq />}
          {activeTab === "video" && <Video />}
          {activeTab === "synofcyc" && <Synofcyc />}
        </div>
      </div>
    </div>
  );
}
