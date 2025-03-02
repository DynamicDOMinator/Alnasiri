"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthModel from "./AuthModel";
import { useAuth } from "../contexts/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import axios from "axios";
import { useUserType } from "../contexts/UserTypeContext";
import { FaUser } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModelOpen, setAuthModelOpen] = useState(false);
  const router = useRouter();
  const {
    isAuthenticated,
    userName,
    logout,
    isLoading: authLoading,
  } = useAuth();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const [specialities, setSpecialities] = useState([]);
  const [city, setCity] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const isLoading = authLoading || userTypeLoading;

  // Function to close mobile menu and handle navigation
  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch specialties
        const specialtyRes = await axios.get(
          `${BASE_URL}/speciality/get-all-speciality`
        );
        const specialties = specialtyRes.data.map(
          (specialty) => specialty.name
        );
        setSpecialities(specialties);

        // Fetch cities
        const cityRes = await axios.get(`${BASE_URL}/lawyer/get-all-cities`);
        const cityNames = cityRes.data.map((city) => city.name);
        setCity(cityNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isAuthenticated, userType, BASE_URL]);

  const handleSearch = (searchType, value, close) => {
    if (!value) return;

    const searchParams = new URLSearchParams();
    if (searchType === "city") {
      searchParams.append("city", value.trim());
    } else if (searchType === "specialty") {
      searchParams.append("specialties", value.trim());
    }

    if (searchParams.toString()) {
      router.push(`/Find-Lawyer?${searchParams.toString()}`);
      if (close) close();
    }
  };

  // Show loading state while checking auth and user type
  if (isLoading) {
    return (
      <header className="bg-white shadow fixed top-0 w-full z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between px-3 py-3 lg:px-16"
        >
          <div className="flex flex-1">
            <div>
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow fixed top-0 w-full z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between px-3  py-3 lg:px-16"
        >
          <div className="flex flex-1">
            <div>
              {isAuthenticated ? (
                <Popover className="relative">
                  {({ open, close }) => (
                    <>
                      <div
                        onMouseEnter={(e) => {
                          const button =
                            e.currentTarget.querySelector("button");
                          if (button && !open) button.click();
                        }}
                      >
                        <PopoverButton
                          className={`flex flex-row-reverse items-center gap-2 border-2 px-4 py-2 rounded-lg focus:outline-none ${
                            userType === "lawyer"
                              ? "bg-[#16498C] text-white border-[#16498C]"
                              : `text-gray-700 hover:text-gray-900 ${open ? "border-blue-500" : "border-gray-200"}`
                          }`}
                        >
                          {userType === "lawyer" ? (
                            <span className="text-sm font-medium">
                              لوحة التحكم
                            </span>
                          ) : (
                            <span className="text-sm font-medium flex items-center gap-2 ">
                              {userName}
                              <FaUser className="size-4" />
                            </span>
                          )}
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </PopoverButton>
                      </div>

                      {open && (
                        <PopoverPanel
                          className="absolute left-0 z-10 mt-3 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                          onMouseLeave={() => close()}
                        >
                          {({ close }) => (
                            <>
                              {userType === "lawyer" ? (
                                <Link
                                  href="/Lawyer-dashboard"
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    close();
                                  }}
                                >
                                  <IoIosArrowBack className="size-5" />
                                  لوحة التحكم
                                </Link>
                              ) : (
                                <>
                                  <Link
                                    href="/profile-settings"
                                    className=" px-4 py-2 text-lg border-b-2 text-blue-500 hover:bg-gray-100 text-right flex items-center justify-end mb-2"
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      close();
                                    }}
                                  >
                                    اعدادات الحساب
                                  </Link>

                                  <Link
                                    href="/notifications"
                                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      close();
                                    }}
                                  >
                                    <IoIosArrowBack className="size-5" />
                                    الاشعارات
                                  </Link>
                                  <Link
                                    href="/my-questions"
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      close();
                                    }}
                                  >
                                    <IoIosArrowBack className="size-5" />
                                    اسالتي
                                  </Link>
                                  <Link
                                    href="/my-reviews"
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      close();
                                    }}
                                  >
                                    <IoIosArrowBack className="size-5" />
                                    المراجعات
                                  </Link>
                                </>
                              )}

                              <div className="px-3 py-2 hover:bg-gray-100">
                                <button
                                  onClick={() => {
                                    handleLogout();
                                    close();
                                  }}
                                  className="justify-center border-2  w-full px-4 py-3  text-sm  text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <span>
                                    <AiOutlineLogout />
                                  </span>
                                  تسجيل خروج
                                </button>
                              </div>
                            </>
                          )}
                        </PopoverPanel>
                      )}
                    </>
                  )}
                </Popover>
              ) : (
                <button
                  onClick={() => setAuthModelOpen(true)}
                  className="bg-primary border-primary bg-[#16498C] text-white gap-2 rounded-md inline-flex items-center justify-center py-3 px-4 text-center"
                >
                  تسجيل دخول
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="flex lg:hidden order-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="flex items-center gap-10">
            <PopoverGroup className="hidden lg:flex lg:gap-5 lg:flex-row-reverse ">
              {/* Cities Menu */}
              <Popover className="relative">
                {({ open, close }) => (
                  <>
                    <div
                      onMouseEnter={(e) => {
                        const button = e.currentTarget.querySelector("button");
                        if (button && !open) button.click();
                      }}
                    >
                      <PopoverButton className="flex outline-none items-center gap-x-1 font-semibold text-gray-900 mt-2">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-400"
                        />
                        محامين حسب الموقع
                      </PopoverButton>
                    </div>

                    {open && (
                      <PopoverPanel
                        className="absolute right-0 rtl top-full z-10 mt-3 w-[600px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
                        onMouseLeave={() => close()}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {city.map((cityName, index) => (
                              <div
                                key={index}
                                className="group relative rounded-lg p-3 text-sm text-right cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                  handleSearch("city", cityName, close);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <span className="block font-semibold text-blue-500 hover:underline">
                                  {cityName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverPanel>
                    )}
                  </>
                )}
              </Popover>

              {/* Speciality Menu */}
              <Popover className="relative">
                {({ open, close }) => (
                  <>
                    <div
                      onMouseEnter={(e) => {
                        const button = e.currentTarget.querySelector("button");
                        if (button && !open) button.click();
                      }}
                    >
                      <PopoverButton className="flex outline-none items-center gap-x-1 font-semibold text-gray-900 mt-2">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-400"
                        />
                        محامين حسب مجال الممارسة
                      </PopoverButton>
                    </div>

                    {open && (
                      <PopoverPanel
                        className="absolute right-0 rtl top-full z-10 mt-3 w-[600px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
                        onMouseLeave={() => close()}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {specialities.map((spec, index) => (
                              <div
                                key={index}
                                className="group relative rounded-lg p-3 text-sm text-right cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                  handleSearch("specialty", spec, close);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <span className="block font-semibold text-blue-500 hover:underline">
                                  {spec}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverPanel>
                    )}
                  </>
                )}
              </Popover>

              {/* Product Menu */}
              <Popover className="relative">
                {({ open, close }) => (
                  <>
                    <div
                      onMouseEnter={(e) => {
                        const button = e.currentTarget.querySelector("button");
                        if (button && !open) button.click();
                      }}
                    >
                      <PopoverButton className="flex outline-none items-center gap-x-1 font-semibold text-gray-900 mt-2">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-400"
                        />
                        المواضيع القانونية اسألة وجواب
                      </PopoverButton>
                    </div>

                    {open && (
                      <PopoverPanel
                        className="absolute right-0 rtl top-full z-10 mt-3 w-[600px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5"
                        onMouseLeave={() => close()}
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {specialities.map((spec, index) => (
                              <div
                                key={index}
                                className="group relative rounded-lg p-3 text-sm text-right cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                  close();
                                  router.push(
                                    `/legal-advice?speciality=${encodeURIComponent(spec)}`
                                  );
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <span className="block font-semibold text-blue-500 hover:underline">
                                  {spec}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-4">
                            <button
                              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
                              onClick={() => {
                                close();
                                router.push("/legal-topics");
                                setMobileMenuOpen(false);
                              }}
                            >
                              تصفح المواضيع القانونية
                            </button>
                          </div>
                        </div>
                      </PopoverPanel>
                    )}
                  </>
                )}
              </Popover>
            </PopoverGroup>
          </div>
        </nav>

        {/* Mobile menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <div>
                {isAuthenticated ? (
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <div
                          onMouseEnter={(e) => {
                            const button =
                              e.currentTarget.querySelector("button");
                            if (button && !open) button.click();
                          }}
                        >
                          <PopoverButton
                            className={`flex flex-row-reverse items-center gap-2 border-2 px-4 py-2 rounded-lg focus:outline-none ${
                              userType === "lawyer"
                                ? "bg-[#16498C] text-white border-[#16498C]"
                                : `text-gray-700 hover:text-gray-900 ${open ? "border-blue-500" : "border-gray-200"}`
                            }`}
                          >
                            {userType === "lawyer" ? (
                              <span className="text-sm font-medium">
                                لوحة التحكم
                              </span>
                            ) : (
                              <span className="text-sm font-medium flex items-center gap-2">
                                {userName}
                                <FaUser className="size-4" />
                              </span>
                            )}
                            <ChevronDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </PopoverButton>
                        </div>

                        <PopoverPanel className="absolute left-0 z-10 mt-3 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                          {({ close }) => (
                            <>
                              {userType === "lawyer" && (
                                <Link
                                  href="/Lawyer-dashboard"
                                  onClick={() => {
                                    handleLogout();
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                                >
                                  لوحة التحكم
                                </Link>
                              )}
                              {userType === "user" && (
                                <>
                                  <Link
                                    href="/notifications"
                                    onClick={() => {
                                      handleLogout();
                                    }}
                                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                  >
                                    الاشعارات
                                    <IoIosArrowBack className="size-5" />
                                  </Link>
                                  <Link
                                    href="/my-questions"
                                    onClick={() => {
                                      handleLogout();
                                    }}
                                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                  >
                                    اسالتي
                                    <IoIosArrowBack className="size-5" />
                                  </Link>
                                  <Link
                                    href="/profile-settings"
                                    onClick={() => {
                                      handleLogout();
                                    }}
                                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right flex items-center justify-between"
                                  >
                                    الاعدادات
                                    <IoIosArrowBack className="size-5" />
                                  </Link>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  handleLogout();
                                }}
                                className="justify-end w-full px-4 py-2 text-sm text-right text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <span>
                                  <AiOutlineLogout />
                                </span>
                                تسجيل خروج
                              </button>
                            </>
                          )}
                        </PopoverPanel>
                      </>
                    )}
                  </Popover>
                ) : (
                  <button
                    onClick={() => setAuthModelOpen(true)}
                    className="bg-primary border-primary bg-[#16498C] text-white gap-2 rounded-md inline-flex items-center justify-center py-3 px-4 text-center"
                  >
                    تسجيل دخول
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {/* محامين حسب الموقع */}
                  <Disclosure as="div" className="flex flex-col py-2 pt-8">
                    <DisclosureButton className="flex items-center flex-row-reverse justify-between w-full text-lg font-semibold text-gray-900 text-right">
                      محامين حسب الموقع
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 flex-shrink-0"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        {city.map((cityName, index) => (
                          <div
                            key={index}
                            className="group relative rounded-lg p-3 text-sm hover:bg-gray-50 text-right cursor-pointer"
                            onClick={() => {
                              handleSearch("city", cityName);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <span className="block font-semibold text-blue-500 hover:underline">
                              {cityName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>

                  {/* محامين حسب مجال الممارسة */}
                  <Disclosure as="div" className="flex flex-col py-2">
                    <DisclosureButton className="flex items-center flex-row-reverse justify-between w-full text-lg font-semibold text-gray-900 text-right">
                      محامين حسب مجال الممارسة
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 flex-shrink-0"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        {specialities.map((spec, index) => (
                          <div
                            key={index}
                            className="group relative rounded-lg p-3 text-sm hover:bg-gray-50 text-right cursor-pointer"
                            onClick={() => {
                              handleSearch("specialty", spec);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <span className="block font-semibold text-blue-500 hover:underline">
                              {spec}
                            </span>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>

                  {/* المواضيع القانونية اسألة وجواب */}
                  <Disclosure as="div" className="flex flex-col py-2">
                    <DisclosureButton className="flex items-center flex-row-reverse justify-between w-full text-lg font-semibold text-gray-900 text-right">
                      المواضيع القانونية اسألة وجواب
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 flex-shrink-0"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        {specialities.map((spec, index) => (
                          <div
                            key={index}
                            className="group relative rounded-lg p-3 text-sm hover:bg-gray-50 text-right cursor-pointer"
                            onClick={() => {
                              router.push(
                                `/legal-advice?speciality=${encodeURIComponent(spec)}`
                              );
                              setMobileMenuOpen(false);
                            }}
                          >
                            <span className="block font-semibold text-blue-500 hover:underline">
                              {spec}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          className="bg-blue-700 text-white px-4 py-2 rounded-lg"
                          onClick={() => {
                            router.push("/legal-topics");
                            setMobileMenuOpen(false);
                          }}
                        >
                          تصفح المواضيع القانونية
                        </button>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      <AuthModel
        isOpen={authModelOpen}
        onClose={() => setAuthModelOpen(false)}
      />
    </>
  );
}
