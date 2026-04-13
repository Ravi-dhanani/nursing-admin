"use client";
import Parse from "../../app/components/parse";

export default function TestPage() {
  const testParse = async () => {
    try {
      const TestObject = Parse.Object.extend("TestObject");
      const obj = new TestObject();

      obj.set("message", "Parse is working 🚀");

      const result = await obj.save();

      alert("Parse connected successfully!");
    } catch (error) {
      alert("Parse NOT working");
    }
  };

  return (
    <div className="p-10">
      <button
        onClick={testParse}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Test Parse Connection
      </button>
    </div>
  );
}
