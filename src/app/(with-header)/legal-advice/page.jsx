"use client";
import { useState } from "react";

// SearchBar Component
function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
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
      <button
        type="submit"
        className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-1.5 
                 bg-gray-800 text-white rounded-lg hover:bg-gray-700 
                 transition-colors duration-200"
      >
        بحث
      </button>
    </form>
  );
}

// QuestionCard Component
function QuestionCard({ title, date }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="text-sm text-gray-500">
            <div className="font-medium">Q&A</div>
            <div className="mt-1">{date}</div>
          </div>
          <h3 className="text-lg font-medium text-right flex-1 mr-4">
            {title}
          </h3>
        </div>
        <div className="text-right">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            اقرأ إجابات كاملة وناقش
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LegalAdvicePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const dummyQuestions = [
    {
      id: 1,
      title:
        "إذا كان لدي قرض سيارة مشترك وتقدمت طلب إفلاس، هل سيؤثر ذلك على الضمان الخاص بالشخص الآخر أو يظهر في تقريره الائتماني؟",
      date: "السعودية | الرياض | 21 ديسمبر 2024",
    },
    {
      id: 2,
      title:
        "إذا كان لدي قرض سيارة مشترك وتقدمت طلب إفلاس، هل سيؤثر ذلك على الضمان الخاص بالشخص الآخر أو يظهر في تقريره الائتماني؟",
      date: "السعودية | الرياض | 21 ديسمبر 2024",
    },
    {
      id: 3,
      title:
        "إذا كان لدي قرض سيارة مشترك وتقدمت طلب إفلاس، هل سيؤثر ذلك على الضمان الخاص بالشخص الآخر أو يظهر في تقريره الائتماني؟",
      date: "السعودية | الرياض | 21 ديسمبر 2024",
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-[300px] bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg mb-8">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-3xl font-bold mb-4">
            النصائح القانونية - عنوان رئيسي
          </h1>
          <p className="text-lg mb-8">
            النصائح هي وسيلة قانونية للمساعدة في الإجابات التي لم يتمكنوا قادرين
            على العثور عليها مسبقاً
          </p>
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="ابحث في الأسئلة" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-right">
          أسئلة حول الإفلاس!
        </h2>
        <div className="space-y-4">
          {dummyQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              title={question.title}
              date={question.date}
            />
          ))}
        </div>

        <div className="flex justify-center items-center space-x-2 mt-8 rtl:space-x-reverse">
          <button className="px-4 py-2 bg-gray-800 text-white rounded">
            1
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">2</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">3</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">4</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">5</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">6</button>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">7</button>
          <span>...</span>
          <button className="px-4 py-2 hover:bg-gray-100 rounded">10</button>
        </div>
      </div>
    </div>
  );
}
