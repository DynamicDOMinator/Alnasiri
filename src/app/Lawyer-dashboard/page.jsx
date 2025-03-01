"use client";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { BsWallet2 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Foras() {
  const router = useRouter();
  const [seenLeads, setSeenLeads] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    case_specialization: [],
    city: [],
    sell_number: [],
  });
  const [activeTab, setActiveTab] = useState("cities");
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const contactNumbers = [
    { id: 1, value: 0, label: "لم يتم التواصل" },
    { id: 2, value: 1, label: "مرة واحدة" },
    { id: 3, value: 2, label: "مرتين" },
    { id: 4, value: 3, label: "ثلاث مرات" },
    { id: 5, value: 4, label: "أربع مرات" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    if (saved) {
      const parsedLeads = JSON.parse(saved);
      const cleanLeads = [...new Set(parsedLeads.filter((id) => id !== null))];
      setSeenLeads(cleanLeads);
      localStorage.setItem("seenLeads", JSON.stringify(cleanLeads));
    }
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/leads/get-all-leads-for-user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              exclude_hidden: true,
            },
          }
        );

        const normalizedLeads = response.data.data.map((item) => {
          const leadData = item.lead;
          const uniqueId = `${item.data_type}-${leadData.id}`;

          // Common fields for both Lead and UnsignedLead types
          const baseFields = {
            id: uniqueId,
            originalId: item.id,
            uuid: leadData.uuid,
            dataType: item.data_type,
            name:
              item.data_type === "Lead" ? leadData.user?.name : leadData.name,
            city:
              item.data_type === "Lead"
                ? leadData.question_city
                : leadData.city,
            time:
              item.data_type === "Lead"
                ? leadData.question_time
                : leadData.time,
            price: leadData.price,
            sellNumber: Number(leadData.sell_number),
            createdAt: leadData.created_at,
            status: leadData.status,
            reviewed: leadData.reviewed,
            phone: item.data_type === "Lead" ? "" : leadData.phone, // Phone is only available for UnsignedLead
            exclusive: leadData.exclusive,
          };

          if (item.data_type === "Lead") {
            return {
              ...baseFields,
              questionTitle: leadData.question_title,
              questionContent: leadData.question_content,
              caseSpecialization: leadData.case_specialization,
              contactMethod: leadData.contact_method,
            };
          } else {
            return {
              ...baseFields,
              questionTitle: "",
              questionContent: leadData.details,
            };
          }
        });

        setLeads(normalizedLeads);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (BASE_URL) {
      fetchLeads();
    }
  }, [BASE_URL]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/lawyer/get-all-cities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        const response = await axios.get(
          `${BASE_URL}/speciality/get-all-speciality`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const handleLeadClick = (uuid) => {
    const updatedSeenLeads = [...new Set([...seenLeads, uuid])];
    setSeenLeads(updatedSeenLeads);
    localStorage.setItem("seenLeads", JSON.stringify(updatedSeenLeads));
    router.push(`/Lawyer-dashboard/lead-details/${uuid}`);
  };

  const handleSelectLead = (e, leadUuid) => {
    e.stopPropagation();
    if (selectedLeads.includes(leadUuid)) {
      setSelectedLeads(selectedLeads.filter((uuid) => uuid !== leadUuid));
    } else {
      setSelectedLeads([...selectedLeads, leadUuid]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.post(
        `${BASE_URL}/leads/hide-lead`,
        {
          lead_uuid: selectedLeads,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedLeads = leads.filter(
        (lead) => !selectedLeads.includes(lead.uuid)
      );
      setLeads(updatedLeads);
      setIsSelectionMode(false);
      setSelectedLeads([]);
    } catch (error) {
      console.error("Error hiding leads:", error);
    }
  };

  const handleFilter = async (selectedFilters) => {
    try {
      console.log("Sending filter data to API:", {
        case_specialization: selectedFilters.case_specialization.length
          ? selectedFilters.case_specialization
          : null,
        city: selectedFilters.city.length ? selectedFilters.city : null,
        sell_number: selectedFilters.sell_number.length
          ? selectedFilters.sell_number
          : null,
      });

      const response = await axios.get(`${BASE_URL}/leads/filter-leads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          case_specialization: selectedFilters.case_specialization.length
            ? selectedFilters.case_specialization
            : null,
          city: selectedFilters.city.length ? selectedFilters.city : null,
          sell_number: selectedFilters.sell_number.length
            ? selectedFilters.sell_number
            : null,
        },
      });

      console.log("API Response:", response.data);

      // Transform the filtered leads data based on the new response format
      const normalizedLeads = response.data.filtered_leads.map((item) => {
        const leadData = item.attributes;
        const uniqueId = `${item.data_type}-${leadData.id}`;

        // Get name based on data type
        const name =
          item.data_type === "LawyerChance"
            ? leadData.user?.name || "مجهول"
            : leadData.name || "مجهول";

        return {
          id: uniqueId,
          originalId: item.id,
          uuid: leadData.uuid,
          dataType: item.data_type,
          name: name,
          city:
            item.data_type === "LawyerChance"
              ? leadData.question_city
              : leadData.city,
          time:
            item.data_type === "LawyerChance"
              ? leadData.question_time
              : leadData.time,
          price: leadData.price,
          sellNumber: Number(leadData.sell_number),
          createdAt: leadData.created_at,
          status: leadData.status,
          reviewed: leadData.reviewed,
          questionTitle:
            item.data_type === "LawyerChance" ? leadData.question_title : "",
          questionContent:
            item.data_type === "LawyerChance"
              ? leadData.question_content
              : leadData.details,
          caseSpecialization:
            item.data_type === "LawyerChance"
              ? leadData.case_specialization
              : null,
          contactMethod:
            item.data_type === "LawyerChance" ? leadData.contact_method : null,
          exclusive: "عادي", // or handle this based on your needs
        };
      });

      setLeads(normalizedLeads);
      setShowFilterModal(false);
    } catch (error) {
      console.error("Error filtering leads:", error);
    }
  };

  return (
    <div className="w-full pb-24 md:pb-7 max-w-3xl mx-auto relative cairo-font">
      <div className="sticky top-0 w-full max-w-3xl bg-white z-10">
        <p className="lg:text-right text-center py-5 lg:bg-transparent lg:shadow-none shadow-md lg:pt-16 text-xl md:text-3xl font-bold">
          فرص
        </p>
        <div className="flex items-center  justify-between py-1 flex-row-reverse bg-white ">
          <div className="flex items-center justify-end px-5 lg:px-0 gap-2">
            {isSelectionMode && selectedLeads.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="font-bold flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
              >
                حذف ({selectedLeads.length})
              </button>
            )}
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedLeads([]);
              }}
              className="font-bold flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-full"
            >
              {isSelectionMode ? "إلغاء" : "تحديد"}
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="font-bold flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-full"
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
          <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
            فرص <span>{leads.length}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center px-4 md:px-5 lg:px-0 pt-2 pb-20 lg:pb-0">
        {isLoading ? (
          <div className="fixed inset-0 flex justify-center items-center  bg-white">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
          </div>
        ) : leads.length > 0 ? (
          leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => !isSelectionMode && handleLeadClick(lead.uuid)}
              className="relative border-2 border-gray-300 max-w-3xl rounded-lg w-full md:px-10 px-3 pt-4 pb-3 cursor-pointer hover:border-blue-500 transition-colors [direction:ltr]"
            >
              {isSelectionMode && (
                <input
                  type="checkbox"
                  className="absolute top-3 right-3 h-5 w-5 cursor-pointer"
                  checked={selectedLeads.includes(lead.uuid)}
                  onChange={(e) => handleSelectLead(e, lead.uuid)}
                />
              )}
              {seenLeads.includes(lead.uuid) && (
                <span className="absolute top-3 md:left-8 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  تم المشاهدة
                </span>
              )}
              <div className="flex justify-between mt-4 items-center pt-2">
                <p className="flex items-center">
                  {new Date(lead.createdAt).toLocaleDateString("ar-EG", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="font-semibold">
                  {lead.name ? lead.name.split(" ")[0] : "مجهول"}
                </p>
              </div>
              <p className="text-right text-gray-500 break-words whitespace-normal">
                {lead.questionContent.length > 50
                  ? `...${lead.questionContent.substring(0, 50)}`
                  : lead.questionContent}
              </p>
              <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-2 text-white">
                {((lead.dataType === "Lead" && lead.exclusive === "حصري") ||
                  (lead.dataType === "UnsignedLead" &&
                    lead.exclusive === "حصري")) && (
                  <p className="bg-green-700 py-1 px-6 rounded-md">حصري</p>
                )}
                {((lead.dataType === "Lead" && lead.time === "urgent") ||
                  (lead.dataType === "UnsignedLead" &&
                    lead.time === "urgent")) && (
                  <p className="bg-red-500 py-1 px-6 rounded-md">عاجل</p>
                )}

                {lead.caseSpecialization && (
                  <p className="bg-gray-200 text-black py-1 px-6 rounded-md">
                    {lead.caseSpecialization || "غير محدد"}
                  </p>
                )}

                <LuPhone className="text-black text-2xl" />
              </div>
              <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeadClick(lead.uuid);
                  }}
                  className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
                >
                  تواصل مع العميل
                </button>
                <p
                  dir="rtl"
                  className="flex flex-row-reverse items-center ml-auto lg:ml-0 gap-2 md:text-lg  text-gray-500"
                >
                  {lead.sellNumber === 0
                    ? "لم يتم التواصل مع العميل"
                    : `${lead.sellNumber} تواصل مع العميل`}
                  <span>
                    <BsWallet2 />
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <BiSearchAlt2 className="w-24 h-24 text-gray-400" />
            <p className="mt-4 text-xl font-semibold">لا توجد نتائج</p>
            <p className="mt-2">لم يتم العثور على أي فرص تطابق معايير البحث</p>
          </div>
        )}
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 md:w-[550px] w-[90%] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowFilterModal(false)}
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

            <div className="flex flex-row-reverse border-b mb-4">
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "cities"
                    ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("cities")}
              >
                المدن
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "specialties"
                    ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("specialties")}
              >
                التخصصات
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "contacts"
                    ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("contacts")}
              >
                عدد مرات التواصل
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
                        checked={filters.city.includes(city.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              city: [...filters.city, city.name],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              city: filters.city.filter((c) => c !== city.name),
                            });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : activeTab === "specialties" ? (
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
                        checked={filters.case_specialization.includes(
                          specialty.name
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              case_specialization: [
                                ...filters.case_specialization,
                                specialty.name,
                              ],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              case_specialization:
                                filters.case_specialization.filter(
                                  (s) => s !== specialty.name
                                ),
                            });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {contactNumbers.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex  items-center justify-end gap-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <label className="cursor-pointer flex-1 text-right">
                        {contact.label}
                      </label>
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer accent-blue-500"
                        checked={filters.sell_number.includes(contact.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              sell_number: [
                                ...filters.sell_number,
                                contact.value,
                              ],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              sell_number: filters.sell_number.filter(
                                (n) => n !== contact.value
                              ),
                            });
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
                    setFilters({
                      case_specialization: [],
                      city: [],
                      sell_number: [],
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  إعادة تعيين
                </button>
              </div>
              <button
                onClick={() => handleFilter(filters)}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                تطبيق
                {(filters.city.length > 0 ||
                  filters.case_specialization.length > 0 ||
                  filters.sell_number.length > 0) && (
                  <span className="bg-blue-600 px-2 py-0.5 rounded-full text-sm">
                    {filters.city.length +
                      filters.case_specialization.length +
                      filters.sell_number.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
