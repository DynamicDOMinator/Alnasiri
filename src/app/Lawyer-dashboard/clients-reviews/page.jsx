"use client";
import { FaArrowRight } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import Link from "next/link";
export default function ClientsReviews() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div dir="rtl" className="mt-20">
        <Link href="/Lawyer-dashboard/Settings">
          <p>
            <FaArrowRight />
          </p>
        </Link>
        <h1 className="lg:text-3xl font-bold mt-5">اراء العملاء</h1>
      </div>

      <div className="mt-10 border-2 p-4 rounded-lg">
        <div className="flex items-center gap-2 justify-end">
          <p>احمد</p>
          <FaUser />
        </div>

        <div className="flex items-center gap-2 justify-end pt-2">
          <p>محامي موثوق ومجتهد عن تجربة العملاء</p>
          <MdOutlineReviews />
        </div>
      </div>
    </div>
  );
}
