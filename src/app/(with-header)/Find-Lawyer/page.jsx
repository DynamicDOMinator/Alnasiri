"use client";
import { useState, useEffect, Suspense } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegStar, FaUser } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineFileDone } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { IoMdClose } from "react-icons/io";
import { FaLock } from "react-icons/fa";

// Auth Modal Component
const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">تنبيه</h3>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول لعرض رقم الهاتف</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-blue-900 text-white  px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              موافق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for the main content
function FindLawyerContent({ setIsAuthModalOpen }) {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);
  const [visiblePhones, setVisiblePhones] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const searchParams = useSearchParams();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {  isAuthenticated } = useAuth();

  // Auto-show phone numbers for authenticated users
  useEffect(() => {
    // Clean up any old search results from localStorage
    localStorage.removeItem("searchResults");

    if (isAuthenticated && lawyers.length > 0) {
      const allLawyerIds = lawyers.map((lawyer) => lawyer.id);
      setVisiblePhones(new Set(allLawyerIds));
    }
  }, [lawyers, isAuthenticated]);

  const handleShowPhone = (lawyerId) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setVisiblePhones((prev) => {
      const newSet = new Set(prev);
      newSet.add(lawyerId);
      return newSet;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Update URL with new page number
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("page", newPage);
    router.push(`/Find-Lawyer?${currentParams.toString()}`);
  };

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      try {
        // Get filter parameters from URL
        const city = searchParams.get("city");
        const specialty = searchParams.get("specialties");
        const lawyerName = searchParams.get("lawyer_name");
        const page = searchParams.get("page") || 1;

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (city) {
          queryParams.append("city", city);
          queryParams.append("language", "ar");
        }
        if (specialty) {
          queryParams.append("specialties", specialty);
          queryParams.append("language", "ar");
        }
        if (lawyerName) {
          queryParams.append("lawyer_name", lawyerName);
          queryParams.append("language", "ar");
        }

        // Add pagination parameters
        queryParams.append("page", page);
        queryParams.append("per_page", itemsPerPage);

        const response = await axios.get(
          `${BASE_URL}/lawyer/search-lawyer?${queryParams.toString()}`
        );

        if (response.data) {
          if (Array.isArray(response.data.data)) {
            setLawyers(response.data.data);
            setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            setCurrentPage(parseInt(page));
          } else if (Array.isArray(response.data)) {
            setLawyers(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            setCurrentPage(parseInt(page));
          } else {
            setLawyers([]);
            setTotalPages(1);
          }
        }
      } catch (error) {
        setLawyers([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [searchParams, BASE_URL, itemsPerPage]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/speciality/get-all-speciality`
        );
        setSpecialties(response.data);
      } catch (error) {
        setSpecialties([]);
      }
    };

    fetchSpecialties();
  }, [BASE_URL]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/lawyer/get-all-cities`);
        setCities(response.data);
      } catch (error) {
        setCities([]);
      }
    };

    fetchCities();
  }, [BASE_URL]);

  const handleViewProfile = (uuid) => {
    router.push(`/lawyer-profile/${uuid}`);
  };

  const ProfileImage = ({ src, size = 100 }) => {
    if (!src || !isValidUrl(src)) {
      return (
        <div
          className={`bg-gray-100 rounded-full flex items-center justify-center`}
          style={{ width: size, height: size }}
        >
          <FaUser className="text-gray-400" style={{ fontSize: size * 0.5 }} />
        </div>
      );
    }

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={src}
          alt="lawyer profile"
          fill
          className="rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `<div class="bg-gray-100 rounded-full flex items-center justify-center w-full h-full"><svg class="text-gray-400" style="font-size: ${size * 0.5}px" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></div>`;
          }}
        />
      </div>
    );
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl w-28 h-28 border-b-2 border-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="h-[160px] w-full bg-blue-900 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 justify-end max-w-7xl mx-auto">
          {searchParams.get("city") && (
            <>
              <p
                className="text-white text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
                onClick={() => {
                  router.push(`/Find-Lawyer?city=${searchParams.get("city")}`);
                }}
              >
                {searchParams.get("city")}
              </p>
              <p className="text-white text-lg sm:text-xl font-bold text-right mt-3">
                <IoIosArrowBack />
              </p>
            </>
          )}
          {searchParams.get("specialties") && (
            <>
              <p
                className="text-white text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
                onClick={() => {
                  router.push(
                    `/Find-Lawyer?specialties=${searchParams.get("specialties")}`
                  );
                }}
              >
                {searchParams.get("specialties")}
              </p>
              <p className="text-white text-lg sm:text-xl font-bold text-right mt-3">
                <IoIosArrowBack />
              </p>
            </>
          )}
          <h1
            className="text-white text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
            onClick={() => router.push("/")}
          >
            البحث عن محامي
          </h1>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Always show specialties when there's a city parameter */}
          {searchParams.get("city") && specialties.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
                التخصصات
              </h3>
              <div dir="rtl" className="flex flex-wrap gap-4 justify-start">
                {specialties.map((specialty) => (
                  <p
                    key={specialty.id}
                    className="px-4 py-2 bg-gray-100 rounded-full hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-blue-900"
                    onClick={() => {
                      const currentCity = searchParams.get("city");
                      const url = `/Find-Lawyer?specialties=${encodeURIComponent(specialty.name)}${currentCity ? `&city=${currentCity}` : ""}`;
                      router.push(url);
                    }}
                  >
                    {specialty.name}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Always show cities when there's a specialties parameter */}
          {searchParams.get("specialties") && cities.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8 text-right">
                المدن
              </h3>
              <div dir="rtl" className="flex flex-wrap gap-4 justify-start">
                {cities.map((city) => (
                  <p
                    key={city.id}
                    className="px-4 py-2 bg-gray-100 rounded-full hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-blue-900"
                    onClick={() => {
                      const currentSpecialty = searchParams.get("specialties");
                      const url = `/Find-Lawyer?city=${city.name}${currentSpecialty ? `&specialties=${currentSpecialty}` : ""}`;
                      router.push(url);
                    }}
                  >
                    {city.name}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Show both when no parameters are present */}
          {!searchParams.get("city") && !searchParams.get("specialties") && (
            <>
              {specialties.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
                    التخصصات
                  </h3>
                  <div dir="rtl" className="flex flex-wrap gap-4 justify-start">
                    {specialties.map((specialty) => (
                      <p
                        key={specialty.id}
                        className="px-4 py-2 bg-gray-100 rounded-full hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-blue-900"
                        onClick={() => {
                          const url = `/Find-Lawyer?specialties=${encodeURIComponent(specialty.name)}`;
                          router.push(url);
                        }}
                      >
                        {specialty.name}
                      </p>
                    ))}
                  </div>
                </>
              )}

              {cities.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8 text-right">
                    المدن
                  </h3>
                  <div dir="rtl" className="flex flex-wrap gap-4 justify-start">
                    {cities.map((city) => (
                      <p
                        key={city.id}
                        className="px-4 py-2 bg-gray-100 rounded-full hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-blue-900"
                        onClick={() => {
                          const url = `/Find-Lawyer?city=${city.name}`;
                          router.push(url);
                        }}
                      >
                        {city.name}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {lawyers && lawyers.length > 0 ? (
          <div className="space-y-4">
            {lawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                dir="rtl"
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 sm:p-6 rounded-lg shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="shadow-lg rounded-full">
                    <ProfileImage src={lawyer.profile_image_link} size={100} />
                  </div>
                  <div className="text-center sm:text-right">
                    <h2 className="text-lg font-bold">{lawyer.lawyer?.name}</h2>
                    <div className="mt-2 space-y-2">
                      <p className="flex items-center justify-center sm:justify-start gap-1">
                        <span>
                          <FaRegStar />
                        </span>
                        {lawyer.reviews_count || 0} تقيما
                      </p>
                      <p className="flex items-center justify-center sm:justify-start gap-1">
                        <span>
                          <IoLocationSharp />
                        </span>
                        {lawyer.lawyer?.city}
                      </p>
                      <p className="flex items-center justify-center sm:justify-start gap-1">
                        <span>
                          <AiOutlineFileDone />
                        </span>
                        مصرح له منذ
                        <span>{lawyer.lawyer?.experience || 0}</span> سنة
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <div className="flex flex-col gap-2">
                    {isAuthenticated ? (
                      <div className="bg-blue-900 text-white px-4 py-3 rounded flex items-center justify-center gap-2 min-w-[160px]">
                        <span dir="ltr">
                          0{lawyer.call_number || lawyer.lawyer?.phone}
                        </span>
                        <FiPhone />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleShowPhone(lawyer.id)}
                        className="bg-blue-900 text-white px-4 py-3 rounded hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center gap-2 min-w-[160px]"
                      >
                        <FiPhone />
                        {visiblePhones.has(lawyer.id) ? (
                          <span dir="ltr">
                            0{lawyer.call_number || lawyer.lawyer?.phone}
                          </span>
                        ) : (
                          "اظهار رقم الهاتف"
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleViewProfile(lawyer.lawyer?.uuid)}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      عرض الملف الشخصي
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-100 rounded-full p-6 mb-6">
              <BsSearch className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 text-center">
              لا يوجد محامين متاحين
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              لا يوجد محامين متاحين بهذه المعايير. يرجى تعديل معايير البحث
              والمحاولة مرة أخرى.
            </p>
          </div>
        )}

        {/* Pagination */}
        {lawyers.length > 0 && (
          <div
            className="mt-8 flex justify-center gap-2 items-center"
            dir="rtl"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              السابق
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and one page before and after current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNumber
                          ? "bg-blue-900 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function FindLawyer() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-2xl">جاري التحميل...</div>
        </div>
      }
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <FindLawyerContent setIsAuthModalOpen={setIsAuthModalOpen} />
    </Suspense>
  );
}
