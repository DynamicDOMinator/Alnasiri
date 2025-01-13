import React from "react";
import Image from "next/image";
function FifthSection() {
  return (
    <div className="bg-[#3069b41a]">

   
    <div className="flex md:flex-row flex-col  max-w-6xl mx-auto  md:mt-36 mt-16 px-4 md:px-10 gap-10 py-10 justify-center items-center ">
      <div className="basis-1/3 py-10 flex justify-center">
        <div className="relative bg-[#BFD0E769] rounded-3xl h-[250px] w-[300px]">
          <div className="absolute top-[-30px] right-[-20px] md:right-[-30px] w-full h-full flex justify-center items-center">
            <div className="relative w-[300px] h-[300px]">
              <Image
                src={"/images/lookingFor4.png"}
                alt="lawyer"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div dir="rtl" className="basis-2/3 max-w-2xl">
        <h5 className="text-[#FF6624] text-lg text-right">
          ليس لديك وقت للبحث؟
        </h5>
        <p className="font-semibold text-3xl pt-2 pb-4 text-right">
          دعونا نقوم بمهمة العثور على محام لك
        </p>
        <p className="text-right lg:pl-80">
          جرب خدمة الكونسيرج المتميزة عبر واتساب من النصيري للدردشة مع وكيل
          مباشر وإخباره بما تحتاجه والتواصل مع أحد المارة في منطقتك
        </p>
        <button className="bg-[#3069B4] mt-8 flex items-center gap-2 text-white px-4 py-2 rounded-md ">
          تواصل عبر واتساب{" "}
          <span>
            {" "}
            <Image
              src={"/images/whatsapp.png"}
              alt="whatsapp"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />{" "}
          </span>
        </button>
      </div>
    </div>
    </div>
  );
}

export default FifthSection;
