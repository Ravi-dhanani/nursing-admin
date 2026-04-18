"use client";
import { useLanguage } from "@/common/LanguageContext";
import { useEffect, useState } from "react";
import PostContent from "./PostContent";

export interface Language {
  english: string;
  gujrati: string;
}

export default function ClientWrapper() {
  const [subjectTitle, setSubjectTitle] = useState<Language>({
    english: "",
    gujrati: "",
  });

  const [subjectId, setSubjectId] = useState<Language>({
    english: "",
    gujrati: "",
  });

  const { language } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem("subjectName");
    const postId = localStorage.getItem("subjectId");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSubjectTitle(parsed);
      } catch {
        setSubjectTitle({ english: "", gujrati: "" });
      }
    }

    if (postId) {
      try {
        const parsed = JSON.parse(postId);
        setSubjectId(parsed);
      } catch {
        setSubjectId({ english: "", gujrati: "" });
      }
    }
  }, []);
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-primary">
        {language === "English" ? subjectTitle.english : subjectTitle.gujrati}
      </h1>
      <PostContent
        subId={language === "English" ? subjectId.english : subjectId.gujrati}
      />
    </>
  );
}
