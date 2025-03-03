import React from "react";
import Image from "next/image";
function FifthSection() {
  return (
    <div className="bg-gray-50">
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
          <h5 className="text-[#FF6624] text-[18px] text-right">
          ما عندك وقت للبحث؟

          </h5>
          <p className="font-semibold text-lg md:text-[30px] pt-2 pb-4 text-right">
          اترك البحث علينا ، سنساعدك في البحث و اختيار محامي
          </p>
          <p className="text-right ">
          تواصل معنا واشرح مشكلتك و فريقنا سيساعدك و يبحث لك عن المحامي مناسب لقضيتك
          </p>
          <button className="bg-[#0077c8] translate-all duration-500 hover:bg-[#0056a3] justify-center mt-8 flex items-center gap-2 text-white w-[248px] h-[48px] rounded-md ">
            تواصل عبر {" "}
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
