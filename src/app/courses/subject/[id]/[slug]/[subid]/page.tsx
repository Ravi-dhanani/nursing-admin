import { formatText } from "@/lib/utils";
import PostContent from "./components/PostContent";
import SubjectList from "./components/SubjectList";

// 1. Wrap params and searchParams in Promises
// 2. Remove the '?' from subid (since the folder [subid] makes it required)
type Props = {
  params: Promise<{
    id: string;
    slug: string;
    subid: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
};

export default async function SubjectPage({ params, searchParams }: Props) {
  // 3. Await the promises
  const { id, slug, subid } = await params;
  const resolvedSearchParams = await searchParams;

  const name = resolvedSearchParams?.name
    ? decodeURIComponent(resolvedSearchParams.name)
    : "";

  return (
    <div className="flex h-full bg-white p-4">
      {/* LEFT SIDE */}
      <div className="w-2/5 pr-6">
        <div className="mb-6 inline-block rounded-md border p-3 text-primary">
          {formatText(slug)}
        </div>

        <h1 className="mb-4 text-2xl font-bold text-primary">{name}</h1>
        <PostContent subId={subid} />
      </div>

      {/* RIGHT SIDE */}
      <SubjectList id={id} slug={slug} subject={name} subid={subid} />
    </div>
  );
}
