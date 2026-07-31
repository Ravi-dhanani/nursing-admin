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

  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // 1. Get Subject Title
    const storedTitle = localStorage.getItem("subjectName");
    if (storedTitle) {
      try {
        const parsed = JSON.parse(storedTitle);
        if (typeof parsed === "object" && parsed !== null) {
          setSubjectTitle(parsed);
        } else {
          setSubjectTitle({ english: String(parsed), gujrati: String(parsed) });
        }
      } catch {
        setSubjectTitle({ english: storedTitle, gujrati: storedTitle });
      }
    }

    // 2. Get Subject ID (Check subjectId first, fallback to subId or iapid)
    const postId =
      localStorage.getItem("subjectId") ||
      localStorage.getItem("subId") ||
      localStorage.getItem("postId");

    if (postId) {
      try {
        const parsed = JSON.parse(postId);
        if (typeof parsed === "object" && parsed !== null) {
          setSubjectId({
            english: String(parsed.english || parsed.id || ""),
            gujrati: String(
              parsed.gujrati || parsed.gujarati || parsed.english || "",
            ),
          });
        } else {
          setSubjectId({ english: String(parsed), gujrati: String(parsed) });
        }
      } catch {
        setSubjectId({ english: postId, gujrati: postId });
      }
    }

    setIsLoaded(true);
  }, []);

  const activeSubId =
    language === "English"
      ? subjectId.english || subjectId.gujrati
      : subjectId.gujrati || subjectId.english;

  return (
    <>
      <h1 className="mb-4 select-none text-2xl font-bold text-primary">
        {language === "English" ? subjectTitle.english : subjectTitle.gujrati}
      </h1>

      {isLoaded ? (
        activeSubId ? (
          <PostContent subId={activeSubId} />
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            <strong>No subject ID found in LocalStorage.</strong>
            <br />
            Please go back and select a subject again.
          </div>
        )
      ) : (
        <div>Loading post content...</div>
      )}
    </>
  );
}
