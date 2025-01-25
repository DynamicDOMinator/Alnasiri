import Link from "next/link";

export default function Wallet() {
  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mt-16">محفظتي</h1>
      <Link href="/Lawyer-dashboard/Wallet/Deposit">
        <div className="mt-10 border-b-2 pb-2 hover:cursor-pointer hover:bg-gray-100 p-2">
          <h2 className="text-lg font-semibold">تعبئة الرصيد</h2>
          <p className="text-gray-800">
            قم بتعبئة رصيد الحالي بطريقة سهلة وامنة
          </p>
        </div>
      </Link>
      <Link href="/Lawyer-dashboard/Wallet/Balance">
        <div className="mt-5 border-b-2 pb-2 p-2 hover:cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-semibold">الرصيد</h2>
          <p className="text-gray-800">التحقق من الدفع</p>
        </div>
      </Link>
    </div>
  );
}
