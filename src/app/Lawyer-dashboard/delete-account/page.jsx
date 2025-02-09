"use client";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleDeleteClick = () => {
    
    router.push("/Lawyer-dashboard/delete-account/confirm");
  };

  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto mt-10 px-4 mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          <FaArrowRightLong />
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold lg:text-right">
          عن طريق حذف حسابك
        </h1>

        <div className="mt-8 space-y-4">
          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              سيتم حذف حسابات مزود الخدمة والعمل الخاصة بك نهائيا من قواعد
              بياناتنا
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              الحذف لا يمكن الرجوع عنه ولن تتمكن من الوصول إلى هذه البيانات بعد
              الآن
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>إذا قررت استخدام بشاره مرة أخرى، فستحتاج إلى إنشاء حساب</p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              إذا كان لديك رصيد غير قابل للاسترداد في رصيدك فسيتم حذفه ولن يكون
              قابل للاسترداد بعد حذف الحساب
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              إذا كنت تفكر في رقم حسابك الذي لم تعد تقدم أي خدمة فيمكنك حذف
              ملفات تعريف الخدمة الخاصة بك من قائمة تفضيلات الخدمة
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="bg-red-600 text-white px-12 py-2 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteClick}
            disabled={isLoading}
          >
            احذف حسابي
          </button>
        </div>
      </div>
    </div>
  );
}
