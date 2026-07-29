export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 text-center shadow">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>

        <p className="mt-3 text-gray-600">
          Need help? Contact our support team.
        </p>

        <div className="mt-6 rounded-lg bg-primary/10 p-4">
          <p className="text-sm text-gray-600">Contact Number</p>

          <a className="mt-2 block text-2xl font-bold text-primary">
            9067070731
          </a>
        </div>

        <p className="mt-5 text-sm text-gray-500">
          Our team will help you with your queries.
        </p>
      </div>
    </div>
  );
}
