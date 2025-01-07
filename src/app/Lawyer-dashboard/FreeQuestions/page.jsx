"use client";
import { useState } from "react";
import Image from "next/image";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function FreeQuestions() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      date: { month: "ديسمبر", day: "17" },
      name: "أحمد السيد",
      title: "بحث عن قضية جنائة",
      description: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
    },
    {
      id: 2,
      date: { month: "ديسمبر", day: "15" },
      name: "محمد عبدالله",
      title: "استشارة قانونية في قضية عمالية",
      description: "اريد استشارة بخصوص حقوقي القانونية في حالة الفصل التعسفي",
    },
    {
      id: 3,
      date: { month: "ديسمبر", day: "14" },
      name: "سارة احمد",
      title: "استشارة في قضية احوال شخصية",
      description: "اريد معرفة حقوقي القانونية في قضية حضانة الاطفال",
    },
  ]);

  const handleSelectQuestion = (e, questionId) => {
    e.stopPropagation();
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleDeleteSelected = () => {
    const updatedQuestions = questions.filter(
      (question) => !selectedQuestions.includes(question.id)
    );
    setQuestions(updatedQuestions);
    setIsSelectionMode(false);
    setSelectedQuestions([]);
  };

  return (
    <div className="w-full pb-24 lg:pb-0 max-w-3xl mx-auto relative">
      {/* Sticky header */}
      <div className="sticky top-0 w-full max-w-3xl bg-white z-10">
        <p className="lg:text-right text-center py-5 lg:bg-transparent lg:shadow-none shadow-md lg:pt-16 text-lg md:text-3xl font-bold">
          الاسالة المجانية
        </p>
        <div className="flex items-center justify-between  flex-row-reverse bg-white pb-5">
          <div className="flex items-center justify-end px-5 lg:px-0 gap-2">
            {isSelectionMode && (
              <button
                onClick={handleDeleteSelected}
                className="font-bold flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
              >
                حذف المحدد ({selectedQuestions.length})
              </button>
            )}
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedQuestions([]);
              }}
              className="font-bold flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-full"
            >
              {isSelectionMode ? "إلغاء" : "تحديد"}
            </button>
            <button className="font-bold flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-full">
              فلتر{" "}
              <span>
                <Image
                  src="/images/filter.png"
                  height={15}
                  width={15}
                  alt="فلتر"
                />
              </span>
            </button>
          </div>
          <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
            فرص <span>5</span>
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col gap-5 justify-center items-center pb-10 px-4 lg:px-0">
        {questions.map((question) => (
          <div
            key={question.id}
            className="relative border-2 border-gray-300 rounded-lg w-full md:px-10 px-3 py-6"
          >
            {isSelectionMode && (
              <input
                type="checkbox"
                className="absolute top-3 right-3 h-5 w-5 cursor-pointer"
                checked={selectedQuestions.includes(question.id)}
                onChange={(e) => handleSelectQuestion(e, question.id)}
              />
            )}
            <div className="flex justify-between items-center">
              <p className="flex items-center">
                {question.date.month} <span>{question.date.day}</span>
              </p>
              <p className="font-semibold">{question.name}</p>
            </div>
            <p className="text-right font-semibold">{question.title}</p>
            <p className="text-right  text-gray-500">{question.description}</p>
            <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
              <button className="bg-orange-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-orange-600">
                اجب عن السوال
              </button>
              <p className="flex items-center gap-1 text-lgl text-gray-700">
                كن اول من يجاوب علي العميل
                <span>
                  <FaLongArrowAltLeft className="text-black" />
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* end of the diplaying leads  */}
    </div>
  );
}
