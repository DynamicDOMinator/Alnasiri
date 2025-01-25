"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";


export default function AnswersDetails() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [answer, setAnswer] = useState(
    "بناءً على المعلومات المقدمة في قضيتك الجنائية، أود أن أوضح أن هذا النوع من القضايا يتطلب دراسة متأنية لكافة الأدلة والملابسات. سأقوم بمساعدتك في إعداد دفاع قوي يستند إلى القوانين والسوابق القضائية ذات الصلة. من المهم جمع كافة المستندات والأدلة التي تدعم موقفك القانوني. سنعمل معاً على تحليل جميع جوانب القضية وتطوير استراتيجية دفاع فعالة تهدف إلى حماية حقوقك وتحقيق أفضل نتيجة ممكنة. أقترح أن نحدد موعداً للاستشارة عن بعد لمناقشة تفاصيل القضية بشكل أكثر تفصيلاً والإجابة على جميع استفساراتك."
  );

  // Extended mock data with all required fields
  const question = {
    id: params.id,
    date: { month: "ديسمبر", day: "17" },
    name: "أحمد السيد",
    title: "بحث عن قضية جنائة",
    description: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
    location: "الرياض",
    deliveryDate: "17 ديسمبر 2023",
    appointmentPreference: "استشارة عن بعد",
    cost: "500",
    questions: [
      {
        question: "ما هو نوع القضية؟",
        answer: "قضية جنائية",
      },
    ],
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically send the answer to your backend
    // After successful submission, redirect back to questions list
    // router.push("/Lawyer-dashboard/MyAnswers");
  };

  return (
    <div>
      <div dir="rtl" className="lg:max-w-3xl mx-auto  relative ">
        <div className="sticky top-0 bg-white z-30 pb-2">
          <div className="pt-10">
            <div className="flex lg:flex-col  items-center relative">
              <Link
                href="/Lawyer-dashboard/MyAnswers"
                className="absolute right-0"
              >
                <FaArrowRight />
              </Link>
              <h1 className="lg:text-3xl font-bold lg:pt-10 w-full text-center lg:text-right">
                التفاصيل
              </h1>
            </div>
          </div>
        </div>

        <div className="border-2  border-gray-300 px-10 py-7 mt-10 rounded-lg relative">
          <ul className="mt-2">
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {question.name}
              <span className="w-4 h-4 bg-green-600 rounded-full"></span>
            </li>

            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              {question.location}
              <span>
                <FaLocationDot />
              </span>
            </li>
            <li className="flex flex-row-reverse pt-1 items-center justify-end gap-1">
              تخصص قضيه جنائيه
              <span>
                <GoLaw />
              </span>
            </li>
          </ul>
          <div className="absolute top-4 left-3  ">
            <p>{question.deliveryDate} </p>
          </div>
        </div>

        {question.questions.map((item, index) => (
          <div
            className="pt-7 border-2 mb-10 border-gray-300 px-10 py-7 mt-10 rounded-lg"
            key={index}
          >
            <div>
              <h3 className="font-bold">{item.question}</h3>
              <p>{item.answer}</p>
            </div>
            <div className="mt-5">
              <h3 className="font-bold">ما هي تفاصيل الطلب الخاص بك ؟</h3>
              <p>للحصول علي براءة</p>
            </div>
            <div className="mt-5">
              <h3 className="font-bold">رقم الطلب ؟</h3>
              <p>1221212</p>
            </div>
          </div>
        ))}
      </div>

      <div dir="rtl" className="sticky lg:max-w-3xl mx-auto bottom-0 bg-slate-100 pb-5 px-10">
        <h4 className="font-bold py-5">اجابتك</h4>
        <p className="flex gap-1 items-center">
          الاجابة <span className="text-red-500">*</span>
        </p>
        {isEditing ? (
          <textarea
            className="w-full h-20 resize-none min-h-32 border-2 border-gray-300 rounded-lg p-2 focus:outline-blue-500"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        ) : (
          <div className="w-full min-h-32 border-2 border-gray-300 rounded-lg p-2">
            {answer}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-5">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
            حذف
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={isEditing ? handleSubmitAnswer : () => setIsEditing(true)}
          >
            {isEditing ? "تسليم الاجابة" : "تعديل الاجابة"}
          </button>
        </div>
      </div>
    </div>
  );
}
