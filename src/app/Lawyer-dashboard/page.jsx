import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { BsWallet2 } from "react-icons/bs";

export default function Foras() {
  return (
    <div>
      <p className="lg:text-right text-center py-5 bg-white lg:bg-none lg:shadow-none shadow-md lg:pt-20 text-3xl font-semibold">
        فرص
      </p>
      <div className="flex items-center justify-end pt-10 px-5 lg:px-0 gap-2">
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
        <div className="flex flex-col gap-2 justify-center items-center px-4 md:px-5 lg:px-0 mt-5">
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
          <div className="flex flex-row-reverse flex-wrap md:flex-nowrap items-center gap-2 pt-4 text-white ">
            <p className="bg-red-500 py-1 px-6 rounded-md">عاجل</p>
            <p className="bg-green-700 py-1 px-6 rounded-md">حصرى</p>
            <p className="flex gap-1 text-black bg-gray-300 py-1 px-2 rounded-md">
              {" "}
              مرات <span>5</span>
            </p>
            <p className="bg-blue-800 py-1 px-6 rounded-md">تخصص جنائي</p>
            <LuPhone className="text-black text-2xl" />
          </div>
          <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-16">
            <button className="bg-orange-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-orange-600">
              تواصل مع العميل
            </button>
            <p className="flex items-center gap-1 text-lg text-gray-500">
              تم التواصل مع العميل مره واحدة
              <span>
                <BsWallet2 />
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* end of the diplaying leads  */}
    </div>
  );
}
