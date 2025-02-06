"use client";
import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { BsWallet2 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Image from "next/image";

export default function FreeQuestions() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/question/mix`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [BASE_URL]);

  const handleSelectQuestion = (e, uuid) => {
    e.stopPropagation();
    if (selectedQuestions.includes(uuid)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== uuid));
    } else {
      setSelectedQuestions([...selectedQuestions, uuid]);
    }
  };

  const handleDeleteSelected = () => {
    setSelectedQuestions([]);
    setIsSelectionMode(false);
  };

  const handleAnswerQuestion = (uuid) => {
    router.push(`/Lawyer-dashboard/FreeQuestions/${uuid}`);
  };

  const handleQuestionClick = (uuid) => {
    router.push(`/Lawyer-dashboard/lead-details/${uuid}`);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="min-h-screen relative">
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
        </div>
      ) : (
        <div
          dir="rtl"
          className="lg:max-w-3xl lg:mt-8 md:max-w-xl px-3 mb-32 lg:px-0 md:px-0 mx-auto relative"
        >
          <div className="sticky top-0 bg-white pb-2">
            <div className="pt-10">
              <div className="flex lg:flex-col items-right relative">
                <h1 className="text-3xl font-bold text-right mb-4">الأسئلة المجانية</h1>
              </div>
            </div>
            <div dir="ltr" className="flex items-center justify-between  flex-row-reverse pb-2">
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
        
      </div>
          </div>

          {questions.length > 0 ? (
            questions.map((item) => (
              <div
              dir="ltr"
                key={item.uuid}
                onClick={() => item.type === "chance" && handleQuestionClick(item.uuid)}
                className={`border-2 border-gray-300 rounded-lg w-full md:px-10 px-3 py-6 mb-4 ${
                  item.type === "chance" ? "cursor-pointer hover:border-blue-500" : ""
                }`}
              >
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    className="absolute top-3 right-3 h-5 w-5 cursor-pointer"
                    checked={selectedQuestions.includes(item.uuid)}
                    onChange={(e) => handleSelectQuestion(e, item.uuid)}
                  />
                )}
                <div className="flex  justify-between items-center">
                  <p className="flex items-center">
                    {item.created_at ? formatDate(item.created_at) : 'تاريخ غير متوفر'}
                  </p>
                  <p className="font-semibold">{item.user ? item.user.name : item.name || 'مستخدم غير معروف'}</p>
                </div>
                
                {item.type === "question" ? (
                  <>
                    <p className="font-semibold text-right">{item.question_title || 'بدون عنوان'}</p>
                    <p className="text-right text-gray-500">
                      {item.question_content ? (
                        item.question_content.length > 50
                          ? `${item.question_content.substring(0, 50)}...`
                          : item.question_content
                      ) : item.details || 'لا يوجد محتوى'}
                    </p>
                    <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-2 text-white">
                      <div className="flex items-center gap-2 bg-gray-500 px-3 py-1 rounded-full">
                        <FaLocationDot />
                        <span>{item.question_city || item.city || 'المدينة غير محددة'}</span>
                      </div>
                      {item.contact_method === "phone" && (
                        <div className="flex items-center gap-2 bg-gray-500 px-3 py-1 rounded-full">
                          <LuPhone />
                          <span>{item.user ? item.user.phone : item.phone || 'رقم الهاتف غير متوفر'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
                      <button 
                        onClick={() => handleAnswerQuestion(item.uuid)}
                        className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
                      >
                        اجب عن السؤال
                      </button>
                      <p className="flex items-center gap-1 text-lg text-gray-700">
                        كن اول من يجاوب علي العميل
                        <span>
                          <FaLongArrowAltLeft className="text-black" />
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-right">بحث عن {item.case_specialization || 'غير محدد'}</p>
                    <p className="text-right text-gray-500">
                      {item.question_content ? (
                        item.question_content.length > 50
                          ? `${item.question_content.substring(0, 50)}...`
                          : item.question_content
                      ) : item.details || 'لا يوجد محتوى'}
                    </p>
                    <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-2 text-white">
                      {[
                        item.question_time === 'urgent' ? 'عاجل' : null,
                        item.contact_method === 'call' ? 'حصري' : null,
                        item.case_specialization
                      ]
                        .filter(Boolean)
                        .map((tag, index) => (
                          <p
                            key={index}
                            className={`py-1 px-6 rounded-md ${
                              tag === "عاجل"
                                ? "bg-red-500"
                                : tag === "حصري"
                                  ? "bg-green-700"
                                  : "bg-gray-300 text-black"
                            }`}
                          >
                            {tag}
                          </p>
                        ))}
                    </div>
                    <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuestionClick(item.uuid);
                        }}
                        className="bg-blue-500 mr-auto w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
                      >
                        تواصل مع العميل
                      </button>
                      <p
                        dir="rtl"
                        className="flex flex-row-reverse items-center gap-2 text-lg text-gray-500"
                      >
                        {item.sell_number === 0
                          ? "لم يتم التواصل مع العميل"
                          : `${item.sell_number} تواصل مع العميل`}
                        <span>
                          <BsWallet2 />
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20 text-center">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <IoSearchOutline className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">لا توجد أسئلة حتى الآن</h3>
              <p className="text-gray-500 mb-6">لم يتم العثور على أي أسئلة في الوقت الحالي</p>
            </div>
          )}
        </div>
      )}
    
    </div>
  );
}
