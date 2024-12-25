import React from "react";
import Image from "next/image";
function ForthSection() {
  return (
    <div className="md:flex md:justify-center  md:gap-10 lg:gap-0 2xl:gap-10 md:px-10 px-4  max-w-7xl mx-auto">
      <div className="basis-1/2 py-16 relative flex flex-col  gap-6 items-center justify-center">
        <div className="lg:absolute top-0 right-0 z-30 py-5 md:py-0">
          <Image
            src="/images/lookingFor1.png"
            alt="ابحث عن محامي"
            width={500}
            height={500}
            className="max-w-[350px]"
            priority
          />
        </div>
        <div className="lg:absolute top-40 right-32 z-20 py-5 md:py-0 ">
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
        <h4 className="text-2xl font-bold text-right">هل تبحث عن محام؟</h4>
        <p className="text-lg text-gray-600 pt-2 text-right">
          استفد من تقنية البحث التي توفرها منصة النصيري والملفات الشخصية
          التفصيلية <br /> والتقييمات والمراجعات لتقييم المحامين والتواصل معهم
        </p>
        <div className="pt-4 text-right">
          <h4 className="text-lg font-semibold">١- ابحث عن محامين في منطقتك</h4>
          <p className="text-gray-600 pb-4">
            قم بتزويدنا بملفات تعريف مفصلة تحتوي على المعلومات التي تحتاجها
            <br /> لاتخاذ قرار التوظيف، بما في ذلك مراجعات الأسعار والتقييم
          </p>
          <h4 className="text-lg font-semibold">٢- ابحث عن محامين في منطقتك</h4>
          <p className="text-gray-600 pb-4">
            أدخل نوع المحامي الذي تحتاجه (مجال الممارسة) وموقعك لبدء تصفح
            <br /> الملفات ا��شخصية
          </p>
          <h4 className="text-lg font-semibold">
            ٣- احجز استشارة عبر الإنترنت
          </h4>
          <p className="text-gray-600 pb-4">
            اتصل بمحامٍ أو احجز استشارة بسهولة من خلال موقعنا حتى تتمكن من
            <br /> الحصول على المساعدة التي تحتاجها دون ضغوط
          </p>
        </div>

        <button className="bg-[#3069B4] text-white text-lg px-4 py-2 rounded-md mt-6 mr-auto">
          أبحث عن محام
        </button>
      </div>
    </div>
  );
}

export default ForthSection;
