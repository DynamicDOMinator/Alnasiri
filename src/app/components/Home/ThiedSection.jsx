import React from "react";
import Image from "next/image";
import Link from "next/link";
function ThiedSection() {
  return (
    <div className="flex justify-center items-center ">
      <div className="flex md:flex-row flex-col gap-14 px-4 md:px-10 pt-28 md:py-32 items-center justify-center max-w-6xl w-full">
        <div className=" w-fit mx-auto lg::ml-auto relative md:h-fit  bg-[#16498C38] rounded-lg">
          <div className="absolute md:top-[-30px] top-[-90px] left-[-10px]  bg-white p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700 text-right w-fit ml-auto bg-[#CCD7E6] px-2 py-2">
              سؤال قانوني
            </p>
            <p className="text-right py-2">
              كيف يمكنني الحصول علي اطلاق اذا كنت <br /> اعيش في مدينة مختلفة عن
              تلك التي يعيش <br /> فيها زوجي؟
            </p>
            <div
              className="absolute bottom-[-10px] left-20  w-0 h-0 
              border-l-[20px] border-l-transparent
              border-t-[20px] border-t-white
              border-r-[20px] border-r-transparent"
            ></div>
          </div>

          <Image
            className="md:mx-auto h-auto"
            src="/images/ask.png"
            alt="أسال محامي"
            width={500}
            height={500}
            style={{ width: "auto" }}
            priority
          />
        </div>

        <div className="basis-1/2 ">
          <h3 className="text-[30px] font-bold pb-1 text-right">
          عندك سؤال قانوني؟ 
          </h3>
          <p dir="rtl" className="font-bold text-[30px] pb-2 text-right">
          عندنا الاجابة !
          </p>
          <p className="text-gray-600 pb-8 text-right">
          اجابتنا دقيقة و من محامين متخصصين
          </p>

          <h3 className="text-xl font-bold pb-2 text-right">
            ١- اسأل سؤال - مجانا
          </h3>
 
          <p className="border-b-2 border-gray-200 pb-6 text-right">
          اسأل سؤالك ، سيجيبك أهل القانون في ساعات
          </p>

          <h3 className="text-xl font-bold pb-2 pt-4 text-right">
            ٢- تصفح مكتبة الاسئلة و الاجوبة القانونية
          </h3>
          <p className="border-b-2 border-gray-200 pb-6 text-right">
          اطلع على الأسئلة السابقة ، للذين خاضوا تجارب قانونية مشابهة لما تمر به
          </p>
          <div className="flex justify-end">
             <Link href="/Askquestion">
            <button className="bg-[#0077c8] hover:bg-[#0056a0] transition-all duration-300 text-white text-lg w-[187px] h-[50px] rounded-md mt-6">
              أطرح سؤالا
            </button>
          </Link>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default ThiedSection;
