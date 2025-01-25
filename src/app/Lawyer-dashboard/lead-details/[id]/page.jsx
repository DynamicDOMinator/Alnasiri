"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { CgSandClock } from "react-icons/cg";
import { FaPhoneFlip } from "react-icons/fa6";
import { CiMoneyBill } from "react-icons/ci";

const leadsDetailsData = {
  1: {
    name: "أحمد السيد",
    title: "بحث عن قضية جنائة",
    location: "الرياض",
    deliveryDate: "14 نوفمبر",
    appointmentPreference: "الرغبة في تعيين محامي بعد 30 يوم",
    cost: "152",
    image: "/images/imgse.png",
    questions: [
      {
        question: "ما هي تفاصيل القضية الجنائية؟",
        answer: "قضية متعلقة بالاحتيال المالي",
      },
      {
        question: "هل تم رفع دعوى قضائية؟",
        answer: "نعم، تم رفع الدعوى قبل شهر",
      },
      {
        question: "رقم الطلب؟",
        answer: "252588",
      },
    ],
  },
  2: {
    name: "محمد علي",
    title: "قضية تجارية",
    location: "جدة",
    deliveryDate: "15 نوفمبر",
    appointmentPreference: "الرغبة في تعيين محامي بعد 15 يوم",
    cost: "200",
    image: "/images/imgse.png",
    questions: [
      {
        question: "ما هي طبيعة النزاع التجاري؟",
        answer: "نزاع على عقد توريد",
      },
      {
        question: "قيمة النزاع؟",
        answer: "500,000 ريال",
      },
      {
        question: "رقم الطلب؟",
        answer: "252589",
      },
    ],
  },
  3: {
    name: "فاطمة أحمد",
    title: "استشارة قانونية عقارية",
    location: "الدمام",
    deliveryDate: "16 نوفمبر",
    appointmentPreference: "الرغبة في تعيين محامي بعد 7 أيام",
    cost: "300",
    image: "/images/imgse.png",
    questions: [
      {
        question: "ما هو موضوع الاستشارة العقارية؟",
        answer: "نزاع على ملكية أرض وتداخل صكوك",
      },
      {
        question: "هل تم توثيق العقار؟",
        answer: "نعم، موثق في كتابة العدل",
      },
      {
        question: "رقم الطلب؟",
        answer: "252590",
      },
    ],
  },
  4: {
    name: "عمر محمود",
    title: "قضية أحوال شخصية",
    location: "مكة المكرمة",
    deliveryDate: "17 نوفمبر",
    appointmentPreference: "الرغبة في تعيين محامي فوراً",
    cost: "250",
    image: "/images/imgse.png",
    questions: [
      {
        question: "ما هو نوع قضية الأحوال الشخصية؟",
        answer: "قضية حضانة أطفال",
      },
      {
        question: "هل هناك أحكام سابقة؟",
        answer: "نعم، حكم ابتدائي صادر قبل 3 أشهر",
      },
      {
        question: "رقم الطلب؟",
        answer: "252591",
      },
    ],
  },
  5: {
    name: "سارة خالد",
    title: "نزاع عمالي",
    location: "المدينة المنورة",
    deliveryDate: "18 نوفمبر",
    appointmentPreference: "الرغبة في استشارة عن بعد",
    cost: "175",
    image: "/images/imgse.png",
    questions: [
      {
        question: "ما هو سبب النزاع العمالي؟",
        answer: "فصل تعسفي ومستحقات مالية",
      },
      {
        question: "هل تم رفع شكوى لمكتب العمل؟",
        answer: "نعم، تم رفع الشكوى قبل أسبوعين",
      },
      {
        question: "رقم الطلب؟",
        answer: "252592",
      },
    ],
  },
  6: {
    name: "ياسر محمد",
    title: "قضية إدارية",
    location: "تبوك",
    deliveryDate: "19 نوفمبر",
    appointmentPreference: "الرغبة في تعيين محامي خلال أسبوع",
    cost: "280",
    image: "/images/imgse.png",
    questions: [
      {
        question: "ما هي طبيعة القضية الإدارية؟",
        answer: "قرار إداري تعسفي من جهة حكومية",
      },
      {
        question: "هل تم التظلم على القرار؟",
        answer: "نعم، تم التظلم وتم رفضه",
      },
      {
        question: "رقم الطلب؟",
        answer: "252593",
      },
    ],
  },
};

export default function LeadDetails() {
  const { id } = useParams();
  const leadData = leadsDetailsData[id] || leadsDetailsData[1]; // Fallback to first lead if ID not found

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    const seenLeads = saved ? JSON.parse(saved) : [];

    if (!seenLeads.includes(Number(id))) {
      const updatedSeenLeads = [...seenLeads, Number(id)];
      localStorage.setItem("seenLeads", JSON.stringify(updatedSeenLeads));
    }
  }, [id]);

  return (
    <div>
      <div dir="rtl" className="lg:max-w-3xl mx-auto  relative ">
        <div className="sticky top-0 bg-white pb-2">
          <div className="pt-10">
            <div className="flex lg:flex-col  items-center relative">
              <Link href="/Lawyer-dashboard/" className="absolute right-0">
                <FaArrowRight />
              </Link>
              <h1 className="lg:text-3xl font-bold lg:pt-10 w-full text-center lg:text-right">
                التفاصيل
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full flex-row-reverse justify-end mt-10">
          <div>
            <p className="text-xl font-bold">{leadData.name}</p>
          </div>
          <div>
            <Image src={leadData.image} alt="profile" width={70} height={70} />
          </div>
        </div>

        <div className="mt-7">
          <p className="font-bold">{leadData.title}</p>
        </div>
        <div className="border-b-2 border-gray-100 pb-10">
          <ul className="mt-2">
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {leadData.location}
              <span>
                <FaLocationDot />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              تم التسليم {leadData.deliveryDate}
              <span>
                <IoMdTime />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {leadData.appointmentPreference}
              <span>
                <CgSandClock />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              يمكنك الاتصال بهذا العميل
              <span>
                <FaPhoneFlip />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              التكلفة {leadData.cost}ر.س
              <span>
                <CiMoneyBill />
              </span>
            </li>
          </ul>
        </div>

        {leadData.questions.map((item, index) => (
          <div className="pt-7" key={index}>
            <h2 className="font-bold">{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 lg:w-5/6 w-full bg-white border-t-2 py-4 border-gray-100 flex justify-center">
        <button className="bg-green-600 text-white font-bold px-20 py-4 rounded-md">
          عرض سعر ( {leadData.cost} ر.س )
        </button>
      </div>
    </div>
  );
}
