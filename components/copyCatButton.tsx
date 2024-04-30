"use client";
import { useFormStatus } from "react-dom";
export default function CopyMonthsButton() {
  "use client";
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      value="Copy Categories from Previous Month"
      disabled={pending}
      className="bg-blue-600 h-9 w-100 text-sm p-2 rounded text-white mt-4 cursor-pointer hover:bg-blue-700 transition transition-duration: 500ms;"
      name="submit"
    >
      Copy Categories from Previous Month
    </button>
  );
}
