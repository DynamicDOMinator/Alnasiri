import React from "react";
import Image from "next/image";
import Link from "next/link";
function ThiedSection() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex md:flex-row flex-col gap-14 px-4 md:px-10 pt-28 md:py-16 items-center justify-center max-w-6xl w-full">
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
          <h3 className="text-2xl font-bold pb-4 text-right">
            أحصل علي سؤال قانوني؟
          </h3>
          <p className="font-semibold text-2xl pb-2 text-right">
            !لدينا اجابات{" "}
          </p>
          <p className="text-gray-600 pb-8 text-right">
            اجابات المحامون في مختلف انحاء البلاد علي اكثر من ١٧ مليون سؤال{" "}
            <br />
            احصل علي اجابات اليوم في منتدي الاسئلة و الاجوبة الخاصه بنا
          </p>

          <h3 className="text-xl font-bold pb-2 text-right">
            ١- اسأل سؤال لمحامي مجانا
          </h3>

          <p className="border-b-2 border-gray-200 pb-6 text-right">
            قم بنشر سؤالك القانوني بشكل مجهول ، وسيقوم المستشار القانوني <br />{" "}
            ذو الخبرة بالرد عليك خلال ساعات
          </p>

          <h3 className="text-xl font-bold pb-2 pt-4 text-right">
            ٢- تصفح مكتبتنا للاسئلة والاجوبة الموجودة
          </h3>
          <p className="border-b-2 border-gray-200 pb-6 text-right">
            ابحث عن اجابات للأسئلة التي تم طرحها مسبقا من الاشخاص <br /> الذين
            واجهوا مشكلات قانونية مماثلة
          </p>
          <div className="flex justify-end">
             <Link href="/Askquestion">
            <button className="bg-[#16498C] hover:bg-blue-800 text-white text-lg px-4 py-2 rounded-md mt-6">
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
