"use client";

import ContentDetails from "@/app/content/components/ContentDetails";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  return <ContentDetails id={id} />;
}
