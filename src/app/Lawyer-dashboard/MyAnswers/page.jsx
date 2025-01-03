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
    // ... more answers
  ];

  return (
    <div>
      <p className="lg:text-right text-center py-5 bg-white lg:bg-none lg:shadow-none shadow-md lg:pt-20 text-xl  md:text-3xl font-semibold">
        اجوبتي
      </p>

      <div className="w-[80%] lg:mx-auto mt-10 lg:mt-0">
        <p className="flex items-center gap-1 w-fit px-4 rounded-lg">
          فرص <span>5</span>
        </p>{" "}
      </div>
      {/* all leads display  */}
      <div className="flex flex-col gap-2 justify-center items-center px-4 lg:px-0 mt-5">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="border-2 border-gray-300 rounded-lg lg:w-[80%] w-full md:px-10 px-3 py-6"
          >
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

            <div className="flex items-center md:flex-row flex-col-reverse gap-5 justify-between pt-10">
              <Link
                href={`/Lawyer-dashboard/Answers/${answer.id}`}
                className="bg-orange-500 w-full md:w-auto text-white py-2 px-6 rounded-md hover:bg-orange-600"
              >
                اعرض جوابي
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* end of the diplaying leads  */}
    </div>
  );
}
