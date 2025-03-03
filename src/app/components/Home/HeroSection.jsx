"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [step, setStep] = useState(1);
  const [speciality, setSpecialties] = useState([]);
  const [city, setCity] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const specialtyRef = useRef(null);
  const cityRef = useRef(null);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/speciality/get-all-speciality`);
        const speciality = res.data.map((speciality) => speciality.name);
        setSpecialties(speciality);
      } catch (error) {}
    };
    fetchSpecialties();

    const fetchCities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/lawyer/get-all-cities`);
        const cityNames = res.data.map((city) => city.name);
        setCity(cityNames);
      } catch (error) {}
    };
    fetchCities();
  }, [BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target)) {
        setIsSpecialtyOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSpecialties = speciality.filter(spec => 
    spec.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  const filteredCities = city.filter(cityName => 
    cityName.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (selectedCity && selectedCity.trim()) {
      searchParams.append("city", selectedCity.trim());
      searchParams.append("language", "ar");
    }

    if (selectedSpecialty && selectedSpecialty.trim()) {
      searchParams.append("specialties", selectedSpecialty.trim());
      searchParams.append("language", "ar");
    }

    if (searchName && searchName.trim()) {
      searchParams.append("lawyer_name", searchName.trim());
      searchParams.append("language", "ar");
    }

    if (searchParams.toString()) {
      router.push(`/Find-Lawyer?${searchParams.toString()}`);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="mx-auto md:m-0 px-10 pt-6 pb-16 rounded-md bg-white md:ml-auto shadow-lg">
            <p className="text-2xl text-center text-black font-bold mb-6">
           ... اريد ان
            </p>
            <div className="flex flex-col gap-5">
              <button
                className="flex items-center flex-row-reverse gap-1 hover:bg-blue-50 text-blue-500 w-full font-semibold border-2 border-blue-500 hover:underline px-6 py-3 text-right rounded-md shadow"
                onClick={() => setStep(2)}
              >
                البحث عن محامي
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <Link href="/Askquestion">
                <button className="flex items-center flex-row-reverse gap-1 text-blue-500 hover:bg-blue-50 w-full font-semibold border-2 border-blue-500 hover:underline px-6 py-3 text-right rounded-md shadow">
                  اسال محامي مجانا
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-3 flex-none text-blue-500 rotate-90"
                  />
                </button>
              </Link>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="px-10 pt-6 pb-10 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl font-semibold mb-6 text-black text-center">
            اريد ان
            </p>
            <div className="flex flex-col gap-6">
              <button
                className="flex items-center flex-row-reverse gap-1 hover:bg-blue-50 text-blue-500 font-semibold text-right border-2 border-blue-500 hover:underline px-6 py-3 rounded shadow"
                onClick={() => setStep(7)}
              >
                من ذوي الخبرة في مسألة قانونية
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="flex items-center flex-row-reverse gap-1 hover:bg-blue-50 text-blue-500 font-semibold border-2 text-right border-blue-500 hover:underline px-6 py-3 rounded shadow"
                onClick={() => setStep(6)}
              >
                أبحث بالاسم
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="flex items-center flex-row-reverse gap-1 hover:bg-blue-50 text-blue-500 font-semibold border-2 text-right border-blue-500 hover:underline px-6 py-3 rounded shadow"
                onClick={() => setStep(5)}
              >
                ابحث بالقرب مني
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
            </div>
            <button
              className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
              onClick={() => setStep(1)}
            >
              العودة
              <ChevronDownIcon
                aria-hidden="true"
                className="size-3 flex-none text-blue-500 rotate-90"
              />
            </button>
          </div>
        );

      case 5:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              اريد ان ابحث بالقرب مني 
            </p>

            <label
              htmlFor="citySelect"
              className="block text-black text-lg text-right mb-2"
            >
              اختر المدينة
            </label>
            <div className="relative mb-6" ref={cityRef}>
              <button
                type="button"
                className="border-2 border-[#16498C] rounded-lg px-4 py-2 w-full text-black text-right flex justify-between items-center"
                onClick={() => setIsCityOpen(!isCityOpen)}
              >
                <ChevronDownIcon className={`size-5 text-[#16498C] transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                <span className="text-black">{selectedCity || "اختر المدينة"}</span>
              </button>
              {isCityOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-[#16498C] rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded px-8 py-2 text-right text-black"
                        placeholder="ابحث عن المدينة"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 absolute right-2 top-2.5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {filteredCities.map((cityName, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-right text-black hover:bg-gray-100 focus:bg-gray-100"
                        onClick={() => {
                          setSelectedCity(cityName);
                          setIsCityOpen(false);
                          setCitySearch("");
                        }}
                      >
                        {cityName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={() => setStep(12)}
              >
                التالي
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              اريد ان ابحث عن محامٍ بالاسم
            </p>

            <label
              htmlFor="nameSearch"
              className="block text-black text-lg text-right mb-2"
            >
              ابحث عن الاسم
            </label>
            <div className="relative">
              <input
                id="nameSearch"
                type="text"
                className="border-2 border-[#16498C] rounded-lg px-10 py-2 mb-6 w-full text-black text-right"
                placeholder="بحث"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute right-3 top-3 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              {searchName && (
                <button
                  className="absolute left-3 top-3"
                  onClick={() => setSearchName("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 px-1 py-1 rounded-3xl text-white bg-[#0C3468C9]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={handleSearch}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              أريد ان اجد محامي ذو خبرة في
            </p>

            <label
              htmlFor="specialtySelect"
              className="block text-black text-lg text-right mb-2"
            >
              التخصص القانوني
            </label>
            <div className="relative mb-6" ref={specialtyRef}>
              <button
                type="button"
                className="border-2 border-[#16498C] rounded-lg px-4 py-2 w-full text-black text-right flex justify-between items-center"
                onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
              >
                <ChevronDownIcon className={`size-5 text-[#16498C] transition-transform ${isSpecialtyOpen ? 'rotate-180' : ''}`} />
                <span className="text-black">{selectedSpecialty || "اختر التخصص"}</span>
              </button>
              {isSpecialtyOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-[#16498C] rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded px-8 py-2 text-right text-black"
                        placeholder="ابحث عن التخصص"
                        value={specialtySearch}
                        onChange={(e) => setSpecialtySearch(e.target.value)}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 absolute right-2 top-2.5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {filteredSpecialties.map((spec, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-right text-black hover:bg-gray-100 focus:bg-gray-100"
                        onClick={() => {
                          setSelectedSpecialty(spec);
                          setIsSpecialtyOpen(false);
                          setSpecialtySearch("");
                        }}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/legal-specializations">
              <p className="text-blue-500 hover:underline text-right">
                اطلع علي شرح التخصصات
              </p>
            </Link>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={() => setStep(11)}
              >
                التالي
              </button>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              البحث حسب التخصص والمدينة
            </p>
            <label
              htmlFor="specialtySelect"
              className="block text-black text-lg text-right mb-2"
            >
              التخصص القانوني
            </label>
            <select
              id="specialtySelect"
              className="border-2 border-[#16498C] rounded-lg px-4 py-2 mb-6 w-full text-black text-right"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">اختر التخصص</option>
              {speciality.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <Link href="/legal-specializations">
              <p className="text-blue-500 hover:underline text-right">
                اطلع علي شرح التخصصات
              </p>
            </Link>     

            <label
              htmlFor="citySelect"
              className="block text-black text-lg text-right mb-2"
            >
              المدينة (اختياري)
            </label>
            <select
              id="citySelect"
              className="border-2 border-[#16498C] rounded-lg px-4 py-2 mb-6 w-full text-black text-right"
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

            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={handleSearch}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              البحث حسب التخصص
            </p>
            <label
              htmlFor="specialtySelect"
              className="block text-black text-lg text-right mb-2"
            >
              التخصص القانوني
            </label>
            <select
              id="specialtySelect"
              className="border-2 border-[#16498C] rounded-lg px-4 py-2 mb-6 w-full text-black text-right"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">اختر التخصص</option>
              {speciality.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <Link href="/legal-specializations">
              <p className="text-blue-500 hover:underline text-right">
                اطلع علي شرح التخصصات
              </p>
            </Link>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(2)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={handleSearch}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              المدينة (اختياري)
            </p>

            <label
              htmlFor="citySelect"
              className="block text-black text-lg text-right mb-2"
            >
              اختر المدينة
            </label>
            <div className="relative mb-6">
              <input
                type="text"
                className="border-2 border-[#16498C] rounded-lg px-10 py-2 w-full text-black text-right mb-2"
                placeholder="ابحث عن المدينة"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute right-3 top-3 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <select
                id="citySelect"
                className="border-2 border-[#16498C] rounded-lg px-4 py-2 w-full text-black text-right"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">اختر المدينة</option>
                {filteredCities.map((cityName, index) => (
                  <option key={index} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(5)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={handleSearch}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              المدينة (اختياري)
            </p>

            <label
              htmlFor="citySelect"
              className="block text-black text-lg text-right mb-2"
            >
              اختر المدينة
            </label>
            <div className="relative mb-6" ref={cityRef}>
              <button
                type="button"
                className="border-2 border-[#16498C] rounded-lg px-4 py-2 w-full text-black text-right flex justify-between items-center"
                onClick={() => setIsCityOpen(!isCityOpen)}
              >
                <ChevronDownIcon className={`size-5 text-[#16498C] transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                <span className="text-black">{selectedCity || "اختر المدينة"}</span>
              </button>
              {isCityOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-[#16498C] rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded px-8 py-2 text-right text-black"
                        placeholder="ابحث عن المدينة"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 absolute right-2 top-2.5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {filteredCities.map((cityName, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-right text-black hover:bg-gray-100 focus:bg-gray-100"
                        onClick={() => {
                          setSelectedCity(cityName);
                          setIsCityOpen(false);
                          setCitySearch("");
                        }}
                      >
                        {cityName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(7)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={handleSearch}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      case 12:
        return (
          <div className="md:px-10 px-4 pt-6 pb-4 rounded-md min-h-[370px] bg-white ml-auto shadow-lg">
            <p className="text-2xl mb-6 text-black text-right">
              التخصص القانوني (اختياري)
            </p>

            <label
              htmlFor="specialtySelect"
              className="block text-black text-lg text-right mb-2"
            >
              اختر التخصص
            </label>
            <div className="relative mb-6" ref={specialtyRef}>
              <button
                type="button"
                className="border-2 border-[#16498C] rounded-lg px-4 py-2 w-full text-black text-right flex justify-between items-center"
                onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
              >
                <ChevronDownIcon className={`size-5 text-[#16498C] transition-transform ${isSpecialtyOpen ? 'rotate-180' : ''}`} />
                <span className="text-black">{selectedSpecialty || "اختر التخصص"}</span>
              </button>
              {isSpecialtyOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-[#16498C] rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded px-8 py-2 text-right text-black"
                        placeholder="ابحث عن التخصص"
                        value={specialtySearch}
                        onChange={(e) => setSpecialtySearch(e.target.value)}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 absolute right-2 top-2.5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {filteredSpecialties.map((spec, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-right text-black hover:bg-gray-100 focus:bg-gray-100"
                        onClick={() => {
                          setSelectedSpecialty(spec);
                          setIsSpecialtyOpen(false);
                          setSpecialtySearch("");
                        }}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/legal-specializations">
              <p className="text-blue-500 hover:underline text-right">
                اطلع علي شرح التخصصات
              </p>
            </Link>
            <div className="flex justify-between items-center lg:pt-20 pt-10">
              <button
                className="flex items-center flex-row-reverse gap-1 text-blue-500 mt-6 hover:underline"
                onClick={() => setStep(5)}
              >
                العودة
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-3 flex-none text-blue-500 rotate-90"
                />
              </button>
              <button
                className="bg-[#FF6624] text-white px-3 py-3 rounded shadow hover:bg-orange-600"
                onClick={handleSearch}
              >
                ابحث عن محامي
              </button>
            </div>
          </div>
        );
      default:
        return <p className="text-white">خطوة غير معروفة</p>;
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row-reverse bg-[#264360] mt-16 overflow-hidden h-fit w-full text-white">
      <div
        className="md:basis-1/2 pt-10 w-full "
        style={{ backgroundImage: `url("/images/bg-heroSection.png")` }}
      >
        <Image
          className="mx-auto md:h-[600px] h-[350px] w-auto"
          src="/images/Lawyer.png"
          alt="Lawyer"
          width={500}
          height={500}
          priority
        />
      </div>

      <div className="md:basis-1/2 flex flex-col md:gap-16 gap-10 md:items-end items-center justify-center">
        <div className="pt-16 md:pt-10">
          <h1 className="md:text-5xl text-2xl font-bold md:text-right text-center">
          تواصل مع محاميين
          </h1>
          <p className="md:text-5xl text-2xl font-bold md:text-right text-center mt-7">
          حل مشاكلك القانونية 
          </p>
        </div>

        <div className="lg:w-[70%] md:w-[90%] w-[100vw] px-4 md:p-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
