"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Search() {
  const [speciality, setSpecialties] = useState([]);
  const [city, setCity] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchName, setSearchName] = useState("");

  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const featchSpecialties = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/speciality/get-all-speciality`
        );
        const speciality = res.data.map((speciality) => speciality.name);
        setSpecialties(speciality);
      } catch (error) {}
    };
    featchSpecialties();

    const featchCities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/lawyer/get-all-cities`);
        const cityNames = res.data.map((city) => city.name);
        setCity(cityNames);
      } catch (error) {}
    };
    featchCities();
  }, [BASE_URL]);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (selectedCity && selectedCity.trim()) {
      searchParams.append("city", selectedCity.trim());
    }

    if (selectedSpecialty && selectedSpecialty.trim()) {
      searchParams.append("specialties", selectedSpecialty.trim());
    }

    if (searchName && searchName.trim()) {
      const encodedName = encodeURIComponent(searchName.trim());
      searchParams.append("lawyer_name", encodedName);
      searchParams.append("language", "ar");
    }

    if (searchParams.toString()) {
      router.push(`/Find-Lawyer?${searchParams.toString()}`);
    }
  };

  return (
    <div>
      <div>
        <p className="text-xl font-bold text-right px-3 lg:px-0">
          هل تحتاج الي مساعدة الان ؟ ابحث عن محامي   
        </p>
        </div>
      <div className="mt-5">
        <select
          className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="">أختر التخصص</option>
          {speciality.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5">
        <select
          className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">اختر المدينة</option>
          {city.map((cityName, index) => (
            <option key={index} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </div>
      <div></div>

      <div>
        <button
          onClick={handleSearch}
          className="text-white w-[90%] py-3 my-5 hover:bg-blue-800 bg-blue-900 rounded-lg"
        >
          ابدأ البحث
        </button>
      </div>
    </div>
  );
}
