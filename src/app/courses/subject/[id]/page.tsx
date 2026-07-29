// import { formatText } from "@/lib/utils";
// import BackButton from "./components/BackButton";
// import ClientWrapper from "./components/ClientWrapper";
// import SubjectList from "./components/SubjectList";

// type Props = {
//   params: Promise<{
//     id: string;
//   }>;
//   searchParams: Promise<{
//     name?: string;
//     course_name?: string;
//     iapid?: string;
//   }>;
// };

// export default async function SubjectPage({ params, searchParams }: Props) {
//   const { id } = await params;
//   const resolvedSearchParams = await searchParams;

//   const name = resolvedSearchParams?.name
//     ? decodeURIComponent(resolvedSearchParams.name)
//     : "";

//   const iapid = resolvedSearchParams?.iapid
//     ? decodeURIComponent(resolvedSearchParams.iapid)
//     : "";

//   const course_name = resolvedSearchParams?.course_name
//     ? decodeURIComponent(resolvedSearchParams.course_name)
//     : "";

//   return (
//     <div className="flex flex-col gap-4">
//       <BackButton />
//       <div className="flex h-full bg-white p-4">
//         {/* LEFT SIDE */}
//         <div className="w-2/5 pr-6">
//           <div className="mb-6 inline-block select-none rounded-md border p-3 text-primary">
//             {formatText(course_name)}
//           </div>

//           <ClientWrapper />
//         </div>

//         {/* RIGHT SIDE */}
//         <SubjectList
//           id={id}
//           slug={formatText(course_name)}
//           iapid={iapid}
//           subject={name}
//         />
//       </div>
//     </div>
//   );
// }

import { formatText } from "@/lib/utils";
import BackButton from "./components/BackButton";
import ClientWrapper from "./components/ClientWrapper";
import SubjectList from "./components/SubjectList";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    name?: string;
    course_name?: string;
    iapid?: string;
  }>;
};

export default async function SubjectPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const name = resolvedSearchParams?.name
    ? decodeURIComponent(resolvedSearchParams.name)
    : "";

  const iapid = resolvedSearchParams?.iapid
    ? decodeURIComponent(resolvedSearchParams.iapid)
    : "";

  const course_name = resolvedSearchParams?.course_name
    ? decodeURIComponent(resolvedSearchParams.course_name)
    : "";

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <BackButton />

      <div className="flex flex-col gap-4 bg-white p-3 sm:p-4 lg:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-2/5 lg:pr-6">
          <div className="mb-4 inline-block select-none rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary sm:text-base">
            {formatText(course_name)}
          </div>

          <div className="rounded-lg border bg-gray-50 p-2">
            <ClientWrapper />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <SubjectList
          id={id}
          slug={formatText(course_name)}
          iapid={iapid}
          subject={name}
        />
      </div>
    </div>
  );
}
