
import Image from "next/image";
import { FaLongArrowAltLeft } from "react-icons/fa";


export default function FreeQuestions() {
  return (
    <div>
      <p className="lg:text-right text-center py-5 bg-white lg:bg-none lg:shadow-none shadow-md lg:pt-20 text-xl  md:text-3xl font-semibold">
      الاسالة المجانية
      </p>
      <div className="flex items-center justify-end pr-5 lg:pr-0 pt-10 gap-2">
        <button className="text-xl font-semibold flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-full">
          فلتر{" "}
          <span>
            <Image src="/images/filter.png" height={20} width={20} alt="فلتر" />
          </span>
        </button>
      </div>{" "}
      <div className="w-[80%] lg:mx-auto">
        <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
          فرص <span>5</span>
        </p>{" "}
      </div>
      {/* all leads display  */}
      <div className="flex flex-col gap-2 justify-center items-center px-4 lg:px-0 mt-5">
        <div className="border-2 border-gray-300 rounded-lg lg:w-[80%] w-full md:px-10 px-3 py-6">
          <div className=" flex justify-between items-center ">
            <p className="flex items-center">
              {" "}
              ديسمبر <span>17</span>{" "}
            </p>
            <p className="text-lg">أحمد السيد</p>
          </div>
          <p className="text-right text-xl">بحث عن قضية جنائة</p>
          <p className="text-right text-lg text-gray-500">
            البحث عن محامي ذو خبرة في انواع هذة القضاية
          </p>
        
          <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
            <button className="bg-orange-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-orange-600">
            اجب عن السوال
            </button>
            <p className="flex items-center gap-1 text-xl text-gray-500">
            كن اول من يجاوب علي العميل
              <span>
              <FaLongArrowAltLeft className="text-black" />

              </span>
            </p>
          </div>
        </div>
      </div>
      {/* end of the diplaying leads  */}
    </div>
  );
}
