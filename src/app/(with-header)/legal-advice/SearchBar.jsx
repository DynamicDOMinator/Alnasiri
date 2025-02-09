"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/search-question-by-title/${encodeURIComponent(query.trim())}`
        );


        if (response.data.questions && response.data.questions.length > 0) {
          // Navigate with search parameter only
          router.push(
            `/legal-advice?search=${encodeURIComponent(query.trim())}`
          );
        } else {
          router.push(
            `/legal-advice?search=${encodeURIComponent(query.trim())}&notFound=true`
          );
        }
      } catch (error) {
       
        router.push(
          `/legal-advice?search=${encodeURIComponent(query.trim())}&notFound=true`
        );
      }
    } else {
      router.push("/legal-advice");
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setNotFound(false); 
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full flex-row-reverse md:flex gap-2"
      >
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
      {notFound && (
        <div className="mt-2 text-right text-red-600">
          لم يتم العثور على نتائج للبحث
        </div>
      )}
    </div>
  );
}
