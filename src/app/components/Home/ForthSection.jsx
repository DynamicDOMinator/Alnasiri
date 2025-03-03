import React from "react";
import Image from "next/image";
function ForthSection() {
  return (
    <div className="md:flex md:justify-center  lg:mt-10 md:gap-10 lg:gap-0 2xl:gap-10 md:px-10 px-4  max-w-6xl mx-auto">
      <div className="basis-1/2 py-16 relative flex flex-col  gap-6 items-center justify-center">
        <div className="lg:absolute top-0 right-0 z-10 py-5 md:py-0">
          <Image
            src="/images/lookingFor1.png"
            alt="ابحث عن محامي"
            width={500}
            height={500}
            className="max-w-[350px]"
            priority
          />
        </div>
        <div className="lg:absolute top-40 right-32 z-10 py-5 md:py-0 ">
          <Image
            src="/images/lookingFor2.png"
            alt="ابحث عن محامي"
            width={500}
            height={500}
            className="max-w-[350px]"
          />
        </div>
        <div className="lg:absolute top-80 right-64  z-10 py-5 md:py-0 ">
          <Image
            src="/images/lookingFor3.png"
            alt="ابحث عن محامي"
            width={500}
            height={500}
            className="max-w-[350px]"
          />
        </div>
      
      </div>

      <div className="basis-1/2 flex flex-col items-end">
        <h4 className="md:text-[30px] text-xl font-bold text-right">تبحث عن محامي؟</h4>
        <p className="text-lg text-gray-600 pt-5 text-right">
        استفيد من خدمة البحث في بشارة ، لأن البحث يعطي الأولوية دائما للمحاميين المتخصصين في قضيتك ، و مراجعاتنا حقيقية
        </p>
        <div className="pt-4 text-right">
          <h4 className="text-lg font-semibold">١- ابحث عن محاميين في مدينتك</h4>
          <p className="text-gray-600 pb-4">
          اختار مدينتك و نوع قضيتك و ابحر في صفحات المحاميين المناسبين لك
          </p>
          <h4 className="text-lg font-semibold">٢- أقرا مراجعات العملاء السابقين </h4>
          <p className="text-gray-600 pb-4">
          أقرا مراجعات العملاء السابقين
          </p>
          <h4 className="text-lg font-semibold">
            ٣- تواصل مع المحامي
          </h4>
          <p className="text-gray-600 pb-4">
          اختار المحامي المناسب لك و تواصل معه عن طريق الواتس اب او الاتصال
          </p>
        </div>

        <button className="bg-[#0077c8] hover:bg-[#0056a0] transition-all duration-300 text-white text-lg w-[187px] h-[50px] rounded-md mt-6 ml-auto">
          أبحث عن محام
        </button>
      </div>
    </div>
  );
}

export default ForthSection;
