"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/speciality/get-all-speciality`
        );
        setSpecialties(response.data);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };
    fetchSpecialties();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    let searchParams = new URLSearchParams();
    
    if (query.trim()) {
      searchParams.append('search', query.trim());
    }
    
    if (selectedSpecialty) {
      const selectedSpecialtyObj = specialties.find(s => s.id.toString() === selectedSpecialty);
      if (selectedSpecialtyObj) {
        searchParams.append('speciality', selectedSpecialtyObj.name);
      }
    }

    if (!query.trim() && selectedSpecialty) {
      router.push(`/legal-advice?${searchParams.toString()}`);
      return;
    }

    if (query.trim()) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/search-question-by-title/${encodeURIComponent(query.trim())}`
        );

        if (response.data.questions && response.data.questions.length > 0) {
          router.push(`/legal-advice?${searchParams.toString()}`);
        } else {
          searchParams.append('notFound', 'true');
          router.push(`/legal-advice?${searchParams.toString()}`);
        }
      } catch (error) {
        searchParams.append('notFound', 'true');
        router.push(`/legal-advice?${searchParams.toString()}`);
      }
    }
  }, [query, selectedSpecialty, specialties, router]);

  useEffect(() => {
    if (selectedSpecialty) {
      handleSubmit();
    }
  }, [selectedSpecialty, handleSubmit]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setNotFound(false);
  };

  return (
    <div className="w-full space-y-4">
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
        <button 
          className="px-10 py-3 w-full md:w-auto mt-2 md:mt-0 bg-white border border-blue-800 text-blue-800 rounded-lg hover:bg-gray-100 
                   transition-colors duration-200"
          onClick={() => router.push("/Askquestion")}
        >
          أسال محامي 
        </button>
      </form>

      

<div className="text-right text-blue-700">
تصفح الموضوعات القانونية
</div>



      {/* Specialties Grid */}
      <div dir="rtl" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 text-right">
        {specialties.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => {
              setSelectedSpecialty(specialty.id.toString());
            }}
            className={`p-3 text-sm rounded-lg border transition-colors duration-200 
                      ${selectedSpecialty === specialty.id.toString()
                        ? 'bg-blue-800 text-white border-blue-800'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-blue-800'
                      }`}
          >
            {specialty.name}
          </button>
        ))}
      </div>

<div className="text-center py-10">
  <button className="bg-white border text-lg hover:bg-gray-100 border-blue-800  text-blue-800 px-4 py-2 rounded-lg"
  onClick={() => router.push("/legal-specializations")}
  >
  شرح التخصصات القانونية
  </button>
</div>

      {notFound && (
        <div className="mt-2 text-right text-red-600">
          لم يتم العثور على نتائج للبحث
        </div>
      )}
    </div>
  );
}

export default function LeadTopics() {
  return (
    <div className="pt-36 py-10 min-h-screen px-5 md:px-0">
      <div>
        <h1 className="text-2xl font-bold text-center mb-5">
          ! ابحث عن استشارة قانونية
        </h1>
        <p className="text-center text-gray-500">
          اقرأ مقالات ونصائح من المحامين، بالإضافة إلى أسئلة وأجوبة حسب الموضوع
        </p>
        <div className="max-w-3xl mx-auto mt-8">
          <SearchBar placeholder="ابحث عن سؤال قانوني" />
        </div>
      </div>
    </div>
  );
}
