import NoData from "@/common/NoData";
import { formatText } from "@/lib/utils";
import { getPostById } from "./actions";
import SubjectList from "./components/SubjectList";

export type paramsType = Promise<{
  id: string;
  slug: string;
  subject: string;
  subid: string | undefined;
}>;

export default async function SubjectPage(props: { params: paramsType }) {
  const { id, slug, subject, subid } = await props.params;

  const post = await getPostById(subid);

  if (!id || !slug || !subject) {
    return <NoData />;
  }

  return (
    <div className="flex h-screen bg-white p-4">
      {/* LEFT SIDE */}
      <div className="w-2/5 pr-6">
        <div className="mb-6 inline-block rounded-md border p-3 text-primary">
          {formatText(slug)}
        </div>

        <h1 className="mb-4 text-2xl font-bold text-primary">
          {formatText(subject)}
        </h1>
        {post?.content?.rendered ? (
          <div
            dangerouslySetInnerHTML={{
              __html: post.content.rendered,
            }}
          />
        ) : null}
      </div>

      {/* RIGHT SIDE */}
      <SubjectList id={id} />
    </div>
  );
}
