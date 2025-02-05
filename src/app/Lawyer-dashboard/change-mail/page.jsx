import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
export default function ChangeMail() {
  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto  px-4  mb-32 lg:mt-16">
        <Link  href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
          تغير البريد الالكتروني
        </h1>

        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full mt-20">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            البريد الالكتروني القديم
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="mail"
          />
        </div>
        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full my-10">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            البريد الالكتروني الجديد
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="mail"
          />
        </div>

        <button className="bg-green-700 mt-10  text-white  hover:bg-green-800 px-14 py-3 rounded-md">
          حفظ التغيرات
        </button>
      </div>
    </div>
  );
}
