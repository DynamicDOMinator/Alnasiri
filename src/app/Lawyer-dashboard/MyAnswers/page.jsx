import Link from "next/link";

export default function MyAnswers() {
  // Example data - replace with actual data fetching
  const answers = [
    {
      id: 1,
      date: "17",
      month: "ديسمبر",
      name: "أحمد السيد",
      title: "بحث عن قضية جنائة",
      description: "البحث عن محامي ذو خبرة في انواع هذة القضاية",
    },
    {
      id: 2,
      date: "15",
      month: "ديسمبر",
      name: "محمد علي",
      title: "استشارة قانونية في قضية تجارية",
      description: "احتاج مساعدة في عقد شراكة تجارية وتأسيس شركة",
    },
    {
      id: 3,
      date: "14",
      month: "ديسمبر",
      name: "فاطمة محمود",
      title: "قضية أحوال شخصية",
      description: "استشارة قانونية في موضوع الطلاق والنفقة",
    },
    {
      id: 4,
      date: "12",
      month: "ديسمبر",
      name: "عمر حسن",
      title: "نزاع عقاري",
      description: "مشكلة في عقد إيجار تجاري وتعويضات",
    },
    {
      id: 5,
      date: "10",
      month: "ديسمبر",
      name: "سارة أحمد",
      title: "قضية عمالية",
      description: "مشكلة مع صاحب العمل بخصوص التعويضات ونهاية الخدمة",
    },
  ];

  return (
    <div className="w-full pb-24 lg:pb-0 max-w-3xl mx-auto relative">
      {/* Sticky header */}
      <div className="sticky top-0 w-full max-w-3xl bg-white z-10">
        <p className="lg:text-right text-center  lg:bg-transparent lg:shadow-none shadow-md lg:pt-16 text-xl md:text-3xl font-bold">
          اجوبتي
        </p>
        <div className=" pb-5">
          <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
            فرص <span>5</span>
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col gap-2 justify-center items-center px-4 pb-10  lg:px-0 ">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="border-2 border-gray-300 rounded-lg  w-full md:px-10 px-3 py-6"
          >
            <div className=" flex justify-between items-center ">
              <p className="flex items-center">
                {" "}
                ديسمبر <span>17</span>{" "}
              </p>
              <p className="font-semibold">أحمد السيد</p>
            </div>
            <p className="text-right font-semibold">بحث عن قضية جنائة</p>
            <p className="text-right text-gray-500">
              البحث عن محامي ذو خبرة في انواع هذة القضاية
            </p>

            <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
              <Link
                href={`/Lawyer-dashboard/Answers/${answer.id}`}
                className="bg-blue-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-blue-600"
              >
                اعرض جوابي
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
