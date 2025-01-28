"use client";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegStar, FaUser } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineFileDone } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";

import { BsSearch } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa6";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

const getMapEmbedUrl = (mapUrl) => {
  try {
    if (!mapUrl) return null;
    const coordsMatch = mapUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      const [_, lat, lng] = coordsMatch;
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=15`;
    }
    return null;
  } catch (error) {
    console.error("Error processing map URL:", error);
    return null;
  }
};

const ProfileImage = ({ src, size = 100 }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || !isValidUrl(src) || hasError) {
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
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default function LawyerProfile() {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        const uuid = params.id;
        console.log("Fetching lawyer profile with UUID:", uuid);
        const response = await axios.get(
          `${BASE_URL}/lawyer/getLawyerProfileByUUID/${uuid}`
        );
        console.log("API Response:", response.data);
        setLawyer(response.data);
      } catch (error) {
        console.error("Error fetching lawyer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLawyerProfile();
    }
  }, [params.id]);

  const handleViewProfile = (uuid) => {
    router.push(`/lawyer-profile/${uuid}`);
  };

  const getFirstSpecialty = () => {
    try {
      if (!lawyer?.office?.specialties?.length) return null;
      return lawyer.office.specialties[0].name;
    } catch (error) {
      console.error("Error getting first specialty:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl w-28 h-28 border-b-2 border-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <BsSearch className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          لم يتم العثور على المحامي
        </h2>
        <p className="text-gray-500">
          عذراً، لم نتمكن من العثور على المحامي المطلوب.
        </p>
      </div>
    );
  }

  const firstSpecialty = getFirstSpecialty();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="h-[160px] w-full bg-blue-900 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 justify-end max-w-7xl mx-auto">
          {lawyer.city && (
            <>
              <p
                className="text-white text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
                onClick={() => router.push(`/Find-Lawyer?city=${lawyer.city}`)}
              >
                {lawyer.city}
              </p>
              <p className="text-white text-lg sm:text-xl font-bold text-right mt-3">
                <IoIosArrowBack />
              </p>
            </>
          )}
          {firstSpecialty && (
            <>
              <p
                className="text-white text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
                onClick={() =>
                  router.push(`/Find-Lawyer?specialties=${firstSpecialty}`)
                }
              >
                {firstSpecialty}
              </p>
              <p className="text-white text-lg sm:text-xl font-bold text-right mt-3">
                <IoIosArrowBack />
              </p>
            </>
          )}
          <h1
            className="text-white text-lg sm:text-xl font-bold text-right mt-3 cursor-pointer hover:text-blue-200 transition-colors"
            onClick={() => router.push("/Find-Lawyer")}
          >
            البحث عن محامي
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div
          dir="rtl"
          className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border-2 p-4 sm:p-6 rounded-lg shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className=" border-2 px-4 py-10">
              <ProfileImage src={lawyer.profile_image_link} size={120} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-center md:text-right">
                {lawyer.name}
              </h2>
              <div className="flex flex-col gap-2 mt-2">
                <p className="flex items-center justify-center sm:justify-start gap-1">
                  <span>
                    <FaRegStar />
                  </span>
                  {lawyer.reviews_count || 0} تقيما
                </p>
                <p className="flex items-center gap-2 ">
                  <span>
                    <IoLocationSharp />
                  </span>
                  {lawyer.city}
                </p>

                <p className="flex items-center justify-center sm:justify-start gap-1">
                  <span>
                    <AiOutlineFileDone />
                  </span>
                  مصرح له منذ
                  <span>{lawyer.experience || 0}</span> سنة
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col gap-3">
            {lawyer.phone && (
              <button
                onClick={() => (window.location.href = `tel:${lawyer.phone}`)}
                className="bg-blue-900 text-white px-6 py-3 rounded flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
              >
                <span>0{lawyer.phone}</span>
                <FiPhone />
              </button>
            )}
          </div>
        </div>

        {lawyer.office?.bio && (
          <div className="mt-6 ">
            <h3 className="text-xl border-r-4 border-blue-900 pr-2 font-semibold mb-7 text-right">
              <span> {lawyer.name} </span>
              عن
            </h3>
            <div className="bg-white p-6  rounded-lg shadow-lg">
              <div>
                <p className="text-lg flex items-center justify-end gap-2 font-semibold mb-4 text-right">
                  السيره الذاتية
                  <span className="text-white rounded-full  bg-orange-400 px-3 py-3">
                    <FaUserTie />
                  </span>
                </p>
                <p className="text-gray-600 text-right leading-relaxed">
                  {lawyer.office.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {lawyer.experience && (
          <div className="mt-6 ">
            <h3 className="text-xl border-r-4 border-blue-900 pr-2 font-semibold mb-7 text-right">
              رخصة المحاماه
            </h3>
            <div className="bg-white p-6  rounded-lg shadow-lg">
              <div>
                <p className="text-lg flex border-b-2 pb-4 items-center justify-end gap-2 font-semibold mb-4 text-right">
                  سنة <span>{lawyer.experience}</span> محامي صرح له منذ{" "}
                  <span>
                    {" "}
                    <AiOutlineFileDone />{" "}
                  </span>
                </p>
                <p className="flex items-center  flex-row-reverse gap-2 text-gray-600">
                  <span>
                    <IoLocationSharp />
                  </span>
                  {lawyer.city}
                </p>
              </div>
            </div>
          </div>
        )}

        {lawyer.office?.google_map && (
          <div className="mt-10">
            <h3 className="text-xl pb-2 border-r-4 border-blue-900 pr-2 font-semibold mb-4 text-right">
              موقع المكتب
            </h3>
            <div>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src={getMapEmbedUrl(lawyer.office.google_map)}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-10">
          <h3 className="text-xl pb-2 border-r-4 border-blue-900 pr-2 font-semibold mb-4 text-right">
            التقييمات
            <span className="px-1">{lawyer.reviews_count}</span>
            {lawyer.reviews_count < 3 ? "تقييم" : "تقييمات"}
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {lawyer.reviews_count > 0 ? (
              <div>
                {lawyer.reviews_data.map((review, index) => (
                  <div key={index} className="mb-4">
                    {/* Add review display here when you have review data */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                لا توجد تقييمات حتى الآن
              </p>
            )}
          </div>
        </div>

        {/* Answers Section */}
        <div className="mt-10">
          <h3 className="text-xl pb-2 border-r-4 border-blue-900 pr-2 font-semibold mb-4 text-right">
            التفاعل
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center flex flex-col text-lg font-semibold">
              <span className="px-1">{lawyer.answers_count}</span>
              {lawyer.answers_count < 3 ? "إجابة" : "إجابات"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
