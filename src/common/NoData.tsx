export default function NoData() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        width="180"
        height="180"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
      >
        {/* Circle */}
        <circle cx="100" cy="100" r="90" stroke="#E5E7EB" strokeWidth="4" />

        {/* Folder */}
        <path
          d="M60 80 H140 V130 H60 Z"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="#F9FAFB"
        />
        <path
          d="M60 80 L80 60 H120 L140 80"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="none"
        />

        {/* X mark */}
        <line
          x1="80"
          y1="95"
          x2="120"
          y2="115"
          stroke="#EF4444"
          strokeWidth="3"
        />
        <line
          x1="120"
          y1="95"
          x2="80"
          y2="115"
          stroke="#EF4444"
          strokeWidth="3"
        />
      </svg>

      <h2 className="text-xl font-semibold text-gray-700">No Data Found</h2>

      <p className="mt-2 text-gray-500">There is nothing to display here.</p>
    </div>
  );
}
