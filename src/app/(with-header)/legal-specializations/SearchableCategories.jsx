"use client";
import { useState, useRef, useEffect, useMemo } from "react";

export default function SearchableCategories({ categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const categoryRefs = useRef({});

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const searchLower = searchQuery.toLowerCase();
      return (
        category.title.toLowerCase().includes(searchLower) ||
        category.mainDescription.toLowerCase().includes(searchLower) ||
        category.details.some(detail => detail.toLowerCase().includes(searchLower))
      );
    });
  }, [categories, searchQuery]);

  useEffect(() => {
    if (searchQuery && filteredCategories.length > 0) {
      const firstMatch = filteredCategories[0];
      categoryRefs.current[firstMatch.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [searchQuery, filteredCategories]);

  return (
    <>
      {/* Search Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative max-w-xl ml-auto">
          <input
            type="text"
            placeholder="البحث عن:"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
          />
          <div className="mt-2 text-sm text-gray-500 text-right">
            إعاقة، حضانة ولي، الولاية، الحجر ورفع الحجر، إرث، أو شي نسب، تقسيم مستحقات
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-right mb-4">
                  {category.title}
                </h2>
                <p className="text-blue-800 font-semibold text-right mb-4">
                  {category.mainDescription}
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600 text-right">
                    {category.details.join("، ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
