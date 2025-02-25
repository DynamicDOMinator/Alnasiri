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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [activeTab, setActiveTab] = useState("cities");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/question/get-all-questions-for-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.data) {
          const transformedData = response.data.data
            .map((item) => {
              if (item.data_type === "Question") {
                return {
                  uuid: item.question.uuid,
                  type: "chance",
                  created_at: item.question.created_at,
                  user: item.question.user,
                  question_title: item.question.question_title,
                  question_content: item.question.question_content,
                  case_specialization: item.question.case_specialization,
                  city: item.question.question_city,
                  answers_count: 0,
                  sell_number: 0,
                };
              } else if (item.data_type === "UnsignedLead") {
                return {
                  uuid: item.lead.uuid,
                  type: "chance",
                  created_at: item.lead.created_at,
                  name: item.lead.name,
                  details: item.lead.details,
                  city: item.lead.city,
                  sell_number: item.lead.sell_number,
                  answers_count: 0,
                };
              }
              return null;
            })
            .filter(Boolean);

          setQuestions(transformedData);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [BASE_URL]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/lawyer/get-all-cities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          const uniqueCities = response.data.filter(
            (city, index, self) =>
              index === self.findIndex((c) => c.name === city.name)
          );
          setCities(uniqueCities);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [BASE_URL]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/speciality/get-all-speciality`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setSpecialties(response.data);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, [BASE_URL]);

  const handleSelectQuestion = (e, uuid) => {
    e.stopPropagation();
    if (selectedQuestions.includes(uuid)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== uuid));
    } else {
      setSelectedQuestions([...selectedQuestions, uuid]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/question/hide-question`,
        {
          question_uuid: selectedQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successful deletion, remove the items from the local state
      const updatedQuestions = questions.filter(
        (question) => !selectedQuestions.includes(question.uuid)
      );
      setQuestions(updatedQuestions);
      setSelectedQuestions([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Error deleting questions:", error);
      // You might want to add error handling UI here
    }
  };

  const handleAnswerQuestion = (uuid) => {
    router.push(`/Lawyer-dashboard/FreeQuestions/${uuid}`);
  };

  const handleQuestionClick = (uuid) => {
    router.push(`/Lawyer-dashboard/FreeQuestions/${uuid}`);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  const handleFilter = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);

      const response = await axios.get(
        `${BASE_URL}/question/search-question-by-city-and-specialization`,
        {
          city: selectedCities.length > 0 ? selectedCities : null,
          specialization:
            selectedSpecialties.length > 0 ? selectedSpecialties : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data) {
        const transformedData = response.data.data
          .map((item) => {
            if (item.data_type === "Question") {
              return {
                uuid: item.question.uuid,
                type: "chance",
                created_at: item.question.created_at,
                user: item.question.user,
                question_title: item.question.question_title,
                question_content: item.question.question_content,
                case_specialization: item.question.case_specialization,
                city: item.question.question_city,
                answers_count: 0,
                sell_number: 0,
              };
            } else if (item.data_type === "UnsignedLead") {
              return {
                uuid: item.lead.uuid,
                type: "chance",
                created_at: item.lead.created_at,
                name: item.lead.name,
                details: item.lead.details,
                city: item.lead.city,
                sell_number: item.lead.sell_number,
                answers_count: 0,
              };
            }
            return null;
          })
          .filter(Boolean);

        setQuestions(transformedData);
      }
    } catch (error) {
      console.error("Error filtering questions:", error);
    } finally {
      setIsLoading(false);
      setIsFilterOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center  bg-white">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
        </div>
      ) : (
        <div
          dir="rtl"
          className="lg:max-w-3xl lg:mt-8 md:max-w-xl px-3 mb-32 lg:px-0 md:px-0 mx-auto relative"
        >
          <div className="sticky top-0 bg-white z-50 pb-2">
            <div className="lg:pt-10 pt-5">
              <div className="flex lg:flex-col justify-center lg:items-right relative">
                <h1 className="lg:text-3xl text-xl font-bold text-right mb-4">
                  الأسئلة المجانية
                </h1>
              </div>
            </div>
            <div
              dir="ltr"
              className="flex items-center justify-between flex-row-reverse pb-2"
            >
              <div className="flex items-center justify-end px-5 lg:px-0 gap-2">
                {isSelectionMode && selectedQuestions.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="font-bold flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
                  >
                    حذف ({selectedQuestions.length})
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
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="font-bold flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-full"
                >
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
                onClick={(e) => {
                  if (!isSelectionMode) {
                    handleQuestionClick(item.uuid);
                  }
                }}
                className={`relative border-2  border-gray-300 rounded-lg w-full md:px-10 px-3 py-6 mb-4 ${
                  item.type === "chance"
                    ? "cursor-pointer hover:border-blue-500"
                    : ""
                } ${selectedQuestions.includes(item.uuid) ? "border-blue-500" : ""}`}
              >
                {isSelectionMode && (
                  <div
                    className="absolute lg:top-3 top-1 pb-2 right-3 z-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5  cursor-pointer"
                      checked={selectedQuestions.includes(item.uuid)}
                      onChange={(e) => handleSelectQuestion(e, item.uuid)}
                    />
                  </div>
                )}
                <div className="flex  justify-between items-center">
                  <p className="flex items-center">
                    {item.created_at
                      ? formatDate(item.created_at)
                      : "تاريخ غير متوفر"}
                  </p>
                  <p className="font-semibold">
                    {item.user
                      ? item.user.name.split(" ")[0]
                      : item.name?.split(" ")[0] || "مستخدم غير معروف"}
                  </p>
                </div>

                {item.type ? (
                  <>
                    <p className="font-semibold text-right break-words whitespace-normal">
                      {item.question_title
                        ? item.question_title.length > 50
                          ? `${item.question_title.substring(0, 50)}...`
                          : item.question_title
                        : ""}
                    </p>
                    <p className="text-right text-gray-500 break-words whitespace-normal ">
                      {item.question_content
                        ? item.question_content.length > 50
                          ? `${item.question_content.substring(0, 50)}...`
                          : item.question_content
                        : item.details || ""}
                    </p>
                    <div className="flex items-center justify-end mt-2 gap-2">
                      {item.case_specialization && (
                        <p className=" bg-gray-100 px-2 py-1 rounded-md text-black ">
                          {item.case_specialization}
                        </p>
                      )}
                      <p className=" bg-gray-100 px-2 py-1 rounded-md text-black ">
                        {item.city || item.question_city}
                      </p>
                    </div>
                    <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-5">
                      <button
                        onClick={() => handleAnswerQuestion(item.uuid)}
                        className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
                      >
                        اجب عن السؤال
                      </button>
                      <p className="flex items-center ml-auto lg:ml-0 gap-1 lg:text-lg   text-gray-700">
                        {(!item.answers_count && !item.sell_number) ||
                        item.answers_count === 0 ? (
                          <>
                            كن اول من يجاوب علي العميل
                            <FaLongArrowAltLeft className="text-black" />
                          </>
                        ) : (
                          <>
                            <span>تواصل مع العميل</span>
                            {item.sell_number}
                          </>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20 text-center">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <IoSearchOutline className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                لا توجد أسئلة حتى الآن
              </h3>
              <p className="text-gray-500 mb-6">
                لم يتم العثور على أي أسئلة في الوقت الحالي
              </p>
            </div>
          )}
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 md:w-[550px] w-[90%] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-xl font-bold">تصفية النتائج</h3>
            </div>

            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 text-center ${activeTab === "cities" ? "border-b-2 border-blue-500 text-blue-500 font-bold" : "text-gray-500"}`}
                onClick={() => setActiveTab("cities")}
              >
                المدن
              </button>
              <button
                className={`flex-1 py-2 text-center ${activeTab === "specialties" ? "border-b-2 border-blue-500 text-blue-500 font-bold" : "text-gray-500"}`}
                onClick={() => setActiveTab("specialties")}
              >
                التخصصات
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === "cities" ? (
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-end gap-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <label className="cursor-pointer flex-1 text-right">
                        {city.name}
                      </label>
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer accent-blue-500"
                        checked={selectedCities.includes(city.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities([...selectedCities, city.name]);
                          } else {
                            setSelectedCities(
                              selectedCities.filter((c) => c !== city.name)
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {specialties.map((specialty) => (
                    <div
                      key={specialty.id}
                      className="flex items-center justify-end gap-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <label className="cursor-pointer flex-1 text-right">
                        {specialty.name}
                      </label>
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer accent-blue-500"
                        checked={selectedSpecialties.includes(specialty.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSpecialties([
                              ...selectedSpecialties,
                              specialty.name,
                            ]);
                          } else {
                            setSelectedSpecialties(
                              selectedSpecialties.filter(
                                (s) => s !== specialty.name
                              )
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCities([]);
                    setSelectedSpecialties([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  إعادة تعيين
                </button>
              </div>
              <button
                onClick={handleFilter}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                تطبيق
                {selectedCities.length > 0 || selectedSpecialties.length > 0 ? (
                  <span className="bg-blue-600 px-2 py-0.5 rounded-full text-sm">
                    {selectedCities.length + selectedSpecialties.length}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
