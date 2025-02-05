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
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleDeleteClick = () => {
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً");
      return;
    }
    setShowModal(true);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/change-data/delete-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("تم حذف حسابك بنجاح");
        localStorage.clear();
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("حدث خطأ أثناء محاولة حذف الحساب");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
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
              سيتم حذف حسابات مزود الخدمة والعمل الخاصة بك نهائيا من قواعد بياناتنا
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              الحذف لا يمكن الرجوع عنه ولن تتمكن من الوصول إلى هذه البيانات بعد الآن
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              إذا قررت استخدام بشاره مرة أخرى، فستحتاج إلى إنشاء حساب
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              إذا كان لديك رصيد غير قابل للاسترداد في رصيدك فسيتم حذفه ولن يكون قابل للاسترداد بعد حذف الحساب
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xl">•</span>
            <p>
              إذا كنت تفكر في رقم حسابك الذي لم تعد تقدم أي خدمة فيمكنك حذف ملفات تعريف الخدمة الخاصة بك من قائمة تفضيلات الخدمة
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="#"
            className="text-blue-600 hover:underline"
          >
            تعديل تفضيلات الخدمة الخاصة بي
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <button 
            className="bg-red-600 text-white px-12 py-2 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteClick}
            disabled={isLoading}
          >
            {isLoading ? "جاري حذف الحساب..." : "احذف حسابي"}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">تأكيد حذف الحساب</h2>
              <p className="mb-6">هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.</p>
              <div className="flex justify-center gap-4">
              
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحذف..." : "نعم، احذف حسابي"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}