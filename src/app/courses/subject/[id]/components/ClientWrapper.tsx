"use client";

import { useLanguage } from "@/common/LanguageContext";
import NoData from "@/common/NoData";
import { useEffect, useState } from "react";
import PostContent from "./PostContent";

export interface Language {
  english: string;
  gujrati: string;
}

export default function ClientWrapper() {
  const { language } = useLanguage();

  const [subjectTitle, setSubjectTitle] = useState<Language | null>(null);
  const [subjectId, setSubjectId] = useState<Language | null>(null);

  useEffect(() => {
    const storedTitle = localStorage.getItem("subjectName");
    const storedId = localStorage.getItem("subjectId");

    if (storedTitle) {
      try {
        setSubjectTitle(JSON.parse(storedTitle));
      } catch {
        setSubjectTitle(null);
      }
    }

    if (storedId) {
      try {
        setSubjectId(JSON.parse(storedId));
      } catch {
        setSubjectId(null);
      }
    }
  }, []);

  const activeSubId =
    language === "English" ? subjectId?.english : subjectId?.gujrati;

  return (
    <>
      <h1 className="mb-4 select-none text-2xl font-bold text-primary">
        {language === "English" ? subjectTitle?.english : subjectTitle?.gujrati}
      </h1>

      {activeSubId ? (
        <PostContent subId={activeSubId} />
      ) : (
        <NoData title="No Course content available" />
      )}
    </>
  );
}
