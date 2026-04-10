interface Props {
  params: Promise<{
    category: string;
    subject: string;
  }>;
}

export default async function SubjectPage({ params }: Props) {
  const { category, subject } = await params;
  const subjects = [
    "ANATOMY & PHYSIOLOGY",
    "FIRST AID",
    "MICROBIOLOGY",
    "PSYCHOLOGY",
    "NUTRITION",
    "COMMUNITY HEALTH",
    "PHARMACOLOGY",
    "MEDICAL SURGICAL",
    "CHILD HEALTH",
    "MENTAL HEALTH",
    "OBSTETRICS",
    "ENGLISH",
    "ANATOMY & PHYSIOLOGY",
    "FIRST AID",
    "MICROBIOLOGY",
    "PSYCHOLOGY",
    "NUTRITION",
    "COMMUNITY HEALTH",
    "PHARMACOLOGY",
    "MEDICAL SURGICAL",
    "CHILD HEALTH",
    "MENTAL HEALTH",
    "OBSTETRICS",
    "ENGLISH",
  ];

  return (
    <div className="flex h-screen bg-white p-4">
      {/* LEFT SIDE */}
      <div className="w-2/5 pr-6">
        <div className="mb-6 inline-block rounded-md border p-3 text-primary">
          {category}
        </div>

        <h1 className="mb-4 text-3xl font-bold text-primary">{subject}</h1>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="h-full w-3/5 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-6">
            {subjects.map((subject, i) => (
              <div
                key={i}
                className="flex h-24 cursor-pointer items-center justify-center rounded-md border p-2 text-center hover:bg-primary hover:text-white"
              >
                {subject}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
