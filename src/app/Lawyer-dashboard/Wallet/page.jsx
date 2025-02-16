import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

export default function Wallet() {
  return (
    <div  className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mt-16 text-right">محفظتي</h1>
      <Link href="/Lawyer-dashboard/Wallet/Deposit">
        <div className="mt-10 border-b-2 pb-2 hover:cursor-pointer hover:bg-gray-100 p-2 flex items-center justify-between flex-row-reverse">
          <div>
            <h2 className="text-lg font-semibold text-right">تعبئة الرصيد</h2>
            <p className="text-gray-800 text-right">
              قم بتعبئة رصيد الحالي بطريقة سهلة وامنة
            </p>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>
      <Link href="/Lawyer-dashboard/Wallet/Balance">
        <div className="mt-5 border-b-2 pb-2 p-2 hover:cursor-pointer hover:bg-gray-100 flex items-center justify-between flex-row-reverse">
          <div>
            <h2 className="text-lg font-semibold text-right">الرصيد</h2>
            <p className="text-gray-800 text-right">التحقق من الدفع</p>
          </div>
          <IoIosArrowBack />
        </div>
      </Link>
    </div>
  );
}
