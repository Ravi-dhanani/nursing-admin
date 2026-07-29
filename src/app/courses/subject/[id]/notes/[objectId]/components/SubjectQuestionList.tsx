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
  subject_name: string;
}
export default function SubjectQuestionList({
  courseName,
  subject_name,
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
    <div className="p-0 sm:p-2">
      <div className="flex flex-col gap-4">
        <BackButton />

        <div className="mb-3 rounded-xl border bg-white p-3 shadow-sm">
          <h1 className="select-none text-xl font-bold text-gray-900 md:text-2xl">
            {formatText(courseName)}
          </h1>

          <div className="mt-2 space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Subject:</span>
              <span>
                {language === "English"
                  ? subjectTitle.english
                  : subjectTitle.gujrati}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Topic:</span>
              <span>{formatText(subject_name)}</span>
            </div>
          </div>
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
            <span className="w-12 overflow-hidden truncate font-medium md:w-auto">
              {tab.label}
            </span>
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
