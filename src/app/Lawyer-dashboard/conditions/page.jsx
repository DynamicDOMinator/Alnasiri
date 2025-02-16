"use client";

import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiDeleteBin2Line } from "react-icons/ri";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto  px-4    mb-32 lg:mb-10">
      <div className="sticky top-0 bg-white py-16 ">
        <Link href="/Lawyer-dashboard/Settings">            
      <FaArrowRightLong className="ml-auto mb-4" />
 </Link>
        <h1 className="lg:text-3xl text-xl text-center font-bold  lg:text-right">
        البيانات والخصوصية
        </h1>
      </div>

      

      <Link href="/Lawyer-dashboard/conditions">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> البيانات والخصوصية</h2>
              <IoDocumentTextOutline />
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>





      <Link href="/Lawyer-dashboard/delete-account">
        <div className="flex  items-center border-b lg:hover:bg-gray-100 lg:py-2 lg:px-2 pb-5 justify-between flex-row-reverse mt-8">
          <div>
            <div className="flex gap-1 items-center justify-end">
              <h2 className="text-lg font-semibold"> احذف حسابي</h2>
              <RiDeleteBin2Line className="text-red-600" />

            </div>
            <div>
                <p className="text-gray-600">
                حذف كامل للبيانات بشكل كامل
                </p>
            </div>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>










    </div>
  );
}
