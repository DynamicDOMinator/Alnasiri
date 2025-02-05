import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

export default function Changephone() {
  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto  px-4 mt-10 mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
        رقم الهاتف الجوال
        </h1>

        <div className="flex items-center gap-4 mt-10">
          <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full">
            <label
              className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
              htmlFor=""
            >
             رقم الهاتف الجوال
            </label>
            <input
              className="bg-gray-100 px-2 py-2 focus:outline-none w-full h-full"
              type="tel"
              dir="ltr"
            />
          </div>

          <div className="flex items-center gap-1 border-2 py-3 px-4 rounded-lg bg-gray-100">
            <Image
              src="https://flagcdn.com/w40/sa.png"
              alt="KSA Flag"
              width={24}
              height={16}
              unoptimized
            />
              <span className="text-gray-600">966+</span>
          </div>
        </div>
      

        <button className="bg-green-700 mt-10 w-full md:w-auto text-white  hover:bg-green-800 px-14 py-3 rounded-md">
          حفظ التغيرات
        </button>
      </div>
    </div>
  );
}
