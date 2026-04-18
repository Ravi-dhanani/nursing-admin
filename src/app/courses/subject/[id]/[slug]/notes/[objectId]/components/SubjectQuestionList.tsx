"use client";

import {
  McqIcon,
  SynofcycIcon,
  VideoIcon,
} from "@/app/profile/_components/icons";
import { useLanguage } from "@/common/LanguageContext";
import { formatText } from "@/lib/utils";
import { useEffect, useState } from "react";
import BackButton from "../../../components/BackButton";
import { Language } from "../../../components/ClientWrapper";
import Mcq from "./Mcq";
import Synopsis from "./Synopsis";
import VideoPage from "./Video";

interface SubjectQuestionListType {
  courseName: string;
}
export default function SubjectQuestionList({
  courseName,
}: SubjectQuestionListType) {
  const [activeTab, setActiveTab] = useState("mcq");
  const [tabs, setTabs] = useState<any[]>([]);
  const [subjectTitle, setSubjectTitle] = useState<Language>({
    english: "",
    gujrati: "",
  });

  useEffect(() => {
    const videoTitle = localStorage.getItem("video_title");

    const baseTabs = [
      { id: "mcq", label: "MCQ", icon: <McqIcon /> },
      { id: "synopsis", label: "Synopsis", icon: <SynofcycIcon /> },
    ];

    if (videoTitle) {
      baseTabs.splice(1, 0, {
        id: "video",
        label: videoTitle,
        icon: <VideoIcon />,
      });
    } else if (videoTitle !== null) {
      baseTabs.splice(1, 0, {
        id: "video",
        label: "Video",
        icon: <VideoIcon />,
      });
    }

    setTabs(baseTabs);
  }, []);

  const { language } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem("subjectName");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSubjectTitle(parsed);
      } catch {
        setSubjectTitle({ english: "", gujrati: "" });
      }
    }
  }, []);
  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        <BackButton />

        <div className="mb-6 rounded-lg bg-white p-3">
          <h1 className="text-2xl font-bold text-black">
            {formatText(courseName)}
          </h1>
          <p className="mt-1 text-sm text-black">
            {language === "English"
              ? subjectTitle.english
              : subjectTitle.gujrati}
          </p>
        </div>
      </div>
      {/* TAB HEADER */}
      <div className="mb-4 inline-flex w-full gap-2 rounded-xl border-2 bg-white p-3">
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
      <div className="relative h-full">
        <div className="mt-4">
          {activeTab === "mcq" && <Mcq />}
          {activeTab === "video" && <VideoPage />}
          {activeTab === "synopsis" && <Synopsis />}
        </div>
      </div>
    </div>
  );
}
