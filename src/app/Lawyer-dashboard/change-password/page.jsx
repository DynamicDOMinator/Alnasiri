import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
export default function ChangePassword() {
  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto  px-4 mt-10 mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
          تغير كلمة المرور
        </h1>

        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full mt-10">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            البريد الالكتروني
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="password"
          />
        </div>
        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full mt-10">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            كلمة المرور القديمة
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="password"
          />
        </div>
        <button className="text-blue-700 pt-2 hover:underline">
          هل نسيت كلمة المرور ؟
        </button>
        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full my-10">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            كلمة المرور الجديدة
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="password"
          />
        </div>

        <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full my-10">
          <label
            className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
            htmlFor=""
          >
            تاكيد كلمة المرور الجديدة
          </label>
          <input
            className="bg-gray-100 py-2 focus:outline-none w-full h-full"
            type="password"
          />
        </div>

        <button className="bg-green-700 mt-10 w-full md:w-auto text-white  hover:bg-green-800 px-14 py-3 rounded-md">
          حفظ التغيرات
        </button>
      </div>
    </div>
  );
}
