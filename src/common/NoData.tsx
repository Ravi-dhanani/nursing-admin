import Image from "next/image";

export default function NoData({ title }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white py-20 text-center">
      <div className="mb-5">
        <Image
          src={"/assets/images/empty.svg"}
          height={200}
          width={200}
          alt="no-data"
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-700">
        {title ? title : "No Data Found"}
      </h2>

      <p className="mt-2 text-gray-500">There is nothing to display here.</p>
    </div>
  );
}
