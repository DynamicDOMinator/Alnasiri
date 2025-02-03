import { IoIosArrowBack } from "react-icons/io";


export default function MyQuestions() {
  return (
    <div className="bg-slate-100 pt-24 pb-10">
      <div dir="rtl" className="max-w-7xl mx-auto px-4">
        <div >
          <h1 className="lg:text-3xl text-xl font-bold">ألاسئلة المطروحة</h1>
        </div>

        <div className=" p-4 mt-10 bg-white shadow-md">
          <p>20/10/2024</p>
          <h2 className="text-lg font-semibold mt-2">ما هو العملاء المتوقعين؟</h2>
          <p className="mt-2">
            عدد الاجابات
            <span> 5</span>
          </p>
          <div className="mt-5">
             <button className="flex items-center gap-1 text-blue-700 hover:underline">
            مشاهدة الاجابات
            <IoIosArrowBack />

          </button>
          </div>
         
        </div>

      </div>
    </div>
  );
}
