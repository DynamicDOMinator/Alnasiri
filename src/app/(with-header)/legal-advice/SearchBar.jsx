"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Add search parameter to URL and reset page to 1
      router.push(
        `/legal-advice?search=${encodeURIComponent(query.trim())}&page=1`
      );
    } else {
      // If search is empty, reset to first page without search
      router.push("/legal-advice?page=1");
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex-row-reverse md:flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-6 py-3 pr-12 text-right rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent
                   placeholder-gray-400 bg-white text-gray-900"
          dir="rtl"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button
        type="submit"
        className="px-16 py-3 w-full md:w-auto mt-2 md:mt-0 bg-blue-800 text-white rounded-lg hover:bg-blue-700 
                 transition-colors duration-200"
      >
        بحث
      </button>
    </form>
  );
}
