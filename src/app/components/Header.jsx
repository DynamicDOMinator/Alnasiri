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
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import AuthModal from "./AuthModal";

// Product data
const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "/analytics",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "/engagement",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "/security",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "/integrations",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "/automations",
    icon: ArrowPathIcon,
  },
];

// Items data
const items = [
  {
    name: "Documentation",
    description: "Access our comprehensive documentation",
    href: "/documentation",
    icon: SquaresPlusIcon,
  },
  {
    name: "Support",
    description: "Get help from our support team",
    href: "/support",
    icon: PhoneIcon,
  },
  {
    name: "Community",
    description: "Join discussions and share ideas",
    href: "/community",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Blog",
    description: "Read our latest articles and updates",
    href: "/blog",
    icon: PlayCircleIcon,
  },
];

const callsToAction = [
  { name: "Watch demo", href: "/demo", icon: PlayCircleIcon },
  { name: "Contact sales", href: "/contact", icon: PhoneIcon },
];

// Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      // Check if in browser
      const authToken = localStorage.getItem("auth");
      if (authToken) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (typeof window !== "undefined") {
        // Check if in browser
        setUsername(localStorage.getItem("username"));
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setLoading(true);
    if (typeof window !== "undefined") {
      // Check if in browser
      localStorage.removeItem("auth");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    }
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setAuthModalOpen(false); // Close the auth modal after login
  };

  // Replace the login button with this new component
  const AuthSection = () => {
    // Retrieve username from local storage
    let username = null; // Initialize username
    if (typeof window !== "undefined") {
      // Check if in browser
      username = localStorage.getItem("username"); // Get username from local storage
    }

    // Update the username state when the user logs in
    useEffect(() => {
      if (isLoggedIn) {
        setUsername(username); // Set the username state
      }
    }, [username]);

    if (!isLoggedIn) {
      return (
        <button
          onClick={() => setAuthModalOpen(true)}
          className="bg-primary border-primary bg-[#FF6624] text-white gap-2 rounded-md inline-flex items-center justify-center py-3 px-4 text-center"
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
      );
    }

    // Check if the user's role is "lawyer"
    if (user?.role === "lawyer") {
      return (
        <Popover className="relative">
          <PopoverButton className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <span className="text-sm font-medium">
              {username || "المستخدم"}
            </span>
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
              >
                لوحه التحكم
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
              >
                الملف الشخصي
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-right text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? <Spinner /> : "تسجيل خروج"}
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      );
    }

    // Default dropdown for other roles
    return (
      <Popover className="relative">
        <PopoverButton className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none">
          <span className="text-lg font-medium">{username || "المستخدم"}</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </PopoverButton>
        <PopoverPanel className="absolute left-10  z-10 mt-6 w-48   bg-white py-1 shadow-lg ">
          <div className="py-1">
            <Link
              href="/profile"
              className="flex flex-row-reverse items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
            >
              الإعدادات
              <ChevronDownIcon
                className="h-5 w-5 rotate-90"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/settings"
              className="flex flex-row-reverse items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
            >
              الإشعارات
              <ChevronDownIcon
                className="h-5 w-5 rotate-90"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/settings"
              className="flex flex-row-reverse items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
            >
              اسئلتي
              <ChevronDownIcon
                className="h-5 w-5 rotate-90"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/settings"
              className="flex flex-row-reverse items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
            >
              المراجعات
              <ChevronDownIcon
                className="h-5 w-5 rotate-90"
                aria-hidden="true"
              />
            </Link>
            <div className="px-4 py-2">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 border-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? <Spinner /> : "تسجيل خروج"}
              </button>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    );
  };

  return (
    <>
      <header className="bg-white shadow fixed top-0 w-full z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-16"
        >
          <div className="flex flex-1">
            <div>
              <AuthSection />
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
            <PopoverGroup className="hidden lg:flex lg:gap-5 lg:flex-row-reverse">
              {/* Product Menu */}
              <Popover className="relative">
                <PopoverButton className="flex outline-none items-center gap-x-1 text-lg font-semibold text-gray-900 mt-2">
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-5 flex-none text-gray-400"
                  />
                  محامين حسب الموقع
                </PopoverButton>

                <PopoverPanel
                  transition
                  className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="p-4">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 text-right"
                      >
                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <item.icon
                            aria-hidden="true"
                            className="size-6 text-gray-600 group-hover:text-indigo-600"
                          />
                        </div>
                        <div className="flex-auto text-right">
                          <Link
                            href={item.href}
                            className="block font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                          <p className="mt-1 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>

              {/* Items Menu */}
              <Popover className="relative">
                <PopoverButton className="flex outline-none items-center gap-x-1 text-lg font-semibold text-gray-900 mt-2">
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-5 flex-none text-gray-400"
                  />
                  محامين حسب مجال الممارسة
                </PopoverButton>

                <PopoverPanel
                  transition
                  className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="p-4">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 text-right"
                      >
                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <item.icon
                            aria-hidden="true"
                            className="size-6 text-gray-600 group-hover:text-indigo-600"
                          />
                        </div>
                        <div className="flex-auto text-right">
                          <Link
                            href={item.href}
                            className="block font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                          <p className="mt-1 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>

              <Popover className="relative">
                <PopoverButton className="flex outline-none items-center gap-x-1 text-lg font-semibold text-gray-900 mt-2">
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-5 flex-none text-gray-400"
                  />
                  المواضيع القانونية اسألة وجواب
                </PopoverButton>

                <PopoverPanel
                  transition
                  className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="p-4">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 text-right"
                      >
                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <item.icon
                            aria-hidden="true"
                            className="size-6 text-gray-600 group-hover:text-indigo-600"
                          />
                        </div>
                        <div className="flex-auto text-right">
                          <Link
                            href={item.href}
                            className="block font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                          <p className="mt-1 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
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
              <AuthSection />
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
                    <DisclosurePanel className="mt-2 space-y-2">
                      {products.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-center  gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 text-right"
                        >
                          <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 text-gray-600 group-hover:text-indigo-600"
                            />
                          </div>
                          <div className="flex-auto text-right">
                            <Link
                              href={item.href}
                              className="block font-semibold text-gray-900"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
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
                    <DisclosurePanel className="mt-2 space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 text-right"
                        >
                          <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 text-gray-600 group-hover:text-indigo-600"
                            />
                          </div>
                          <div className="flex-auto text-right">
                            <Link
                              href={item.href}
                              className="block font-semibold text-gray-900"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
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
                    <DisclosurePanel className="mt-2 space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 text-right"
                        >
                          <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 text-gray-600 group-hover:text-indigo-600"
                            />
                          </div>
                          <div className="flex-auto text-right">
                            <Link
                              href={item.href}
                              className="block font-semibold text-gray-900"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}
