import { formatText } from "@/lib/utils";
import BackButton from "./components/BackButton";
import ClientWrapper from "./components/ClientWrapper";
import SubjectList from "./components/SubjectList";

// 1. Wrap params and searchParams in Promises
// 2. Remove the '?' from subid (since the folder [subid] makes it required)
type Props = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
};

export default async function SubjectPage({ params, searchParams }: Props) {
  // 3. Await the promises
  const { id, slug } = await params;
  const resolvedSearchParams = await searchParams;

  const name = resolvedSearchParams?.name
    ? decodeURIComponent(resolvedSearchParams.name)
    : "";

  return (
    <div className="flex flex-col gap-4">
      <BackButton />
      <div className="flex h-full bg-white p-4">
        {/* LEFT SIDE */}
        <div className="w-2/5 pr-6">
          <div className="mb-6 inline-block rounded-md border p-3 text-primary">
            {formatText(slug)}
          </div>

          <ClientWrapper />
        </div>

        {/* RIGHT SIDE */}
        <SubjectList id={id} slug={slug} subject={name} />
      </div>
    </div>
  );
}
