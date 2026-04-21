"use client";

import { Material } from "@/app/api/content/materials/route";
import { useLanguage } from "@/common/LanguageContext";
import NoData from "@/common/NoData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();

  const router = useRouter();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("/api/content/materials?type=Materials");
        const data = await res.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (!materials.length && !loading)
    return <NoData title="No Materials Available" />;

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="mb-6 text-2xl font-bold text-black">Materials</h1>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? // Skeleton Loader (show 6 boxes)
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-300 p-6"
              >
                <div className="mb-4 h-5 w-2/3 rounded bg-gray-300"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="mt-6 h-1 w-full rounded bg-gray-200"></div>
              </div>
            ))
          : materials.map((item) => (
              <div
                key={item.objectId}
                onClick={() => {
                  router.push(
                    `/content/materials/material-details/${item.objectId}`,
                  );

                  localStorage.setItem(
                    "material-name",
                    JSON.stringify({
                      english: item.a1_eng_title,
                      gujrati: item.a2_guj_title,
                    }),
                  );
                }}
                className="group cursor-pointer rounded-2xl border border-gray-300 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-lg"
              >
                <h2 className="mb-2 text-lg font-semibold text-black transition-colors duration-300 group-hover:text-white">
                  {language === "English"
                    ? item.a1_eng_title
                    : item.a2_guj_title}
                </h2>

                <p className="text-sm text-gray-500 group-hover:text-white">
                  {item.b1_content_type}
                </p>

                <div className="mt-4 h-1 w-0 rounded bg-white transition-all duration-300 group-hover:w-full"></div>
              </div>
            ))}
      </div>
    </div>
  );
}
