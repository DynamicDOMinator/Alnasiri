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

// Separate component for the main content
function FindLawyerContent() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);

      const city = searchParams.get("city");
      const lawyerName = searchParams.get("lawyer_name");
      const specialties = searchParams.get("specialties");

      if (city || lawyerName || specialties) {
        try {
          const response = await axios.get(`${BASE_URL}/lawyer/search-lawyer`, {
            params: {
              city: city || null,
              lawyer_name: lawyerName || null,
              specialties: specialties || null,
            },
            validateStatus: function (status) {
              return (status >= 200 && status < 300) || status === 404;
            },
          });

          if (response.status === 404 || !response.data) {
            setLawyers([]);
          } else {
            setLawyers(Array.isArray(response.data) ? response.data : []);
          }
        } catch (error) {
          setLawyers([]);
        }
      } else {
        setLawyers([]);
      }

      setLoading(false);
    };

    fetchLawyers();
  }, [searchParams, BASE_URL]);

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
            e.target.style.display = 'none';
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
    } catch (_) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[160px] w-full bg-blue-900 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 justify-end max-w-7xl mx-auto">
          <p className="text-white text-lg sm:text-2xl font-bold text-right mt-3">
            {searchParams.get("city") || "جميع المدن"}
          </p>
          <p className="text-white text-lg sm:text-2xl font-bold text-right mt-3">
            <IoIosArrowBack />
          </p>
          <h1 className="text-white text-lg sm:text-2xl font-bold text-right mt-3">
            البحث عن محامي
          </h1>
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
                    <ProfileImage src={lawyer.profile_image} size={100} />
                  </div>
                  <div className="text-center sm:text-right">
                    <h2 className="text-lg font-bold">{lawyer.lawyer?.name}</h2>
                    <div className="mt-2 space-y-2">
                      <p className="flex items-center justify-center sm:justify-start gap-1">
                        <span>
                          <FaRegStar />
                        </span>
                        {lawyer.review_count} تقيما
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
                        محامي مصرح له{" "}
                        <span>{lawyer.lawyer?.experience || 0}</span> سنة
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <div className="bg-blue-900 py-2 px-4 rounded text-center">
                    <p className="text-white">اتصال للمشاورة</p>
                    <div
                      className="flex items-center justify-center text-white"
                      dir="ltr"
                    >
                      <FiPhone className="mx-2" />
                      <span>+966</span>
                      <span>{lawyer.call_number || lawyer.lawyer?.phone}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewProfile(lawyer.lawyer_uuid)}
                    className="flex items-center gap-1 py-2 px-4 border-2 mt-4 w-full justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span>
                      <CiUser />
                    </span>
                    الملف الشخصي
                  </button>
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
            <button
              onClick={() => window.history.back()}
              className="mt-6 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              العودة للبحث
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function FindLawyer() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    }>
      <FindLawyerContent />
    </Suspense>
  );
}
