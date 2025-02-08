import SearchBar from "./SearchBar";
import Link from "next/link";

// Make the getQuestions function async
async function getQuestions(specialty = null, page = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // For specialty search
    if (specialty) {
      const response = await fetch(
        `${baseUrl}/question/search-question/${encodeURIComponent(specialty)}?page=${page}`,
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return { data: [] }; // Return empty array for no results
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return { data: data.questions || [] };
    }

    // For all questions
    const response = await fetch(
      `${baseUrl}/question/get-all-questions-with-answers?page=${page}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("All questions data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      links: [],
    };
  }
}

// QuestionCard Component
function QuestionCard({ uuid, title, date }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "التاريخ غير متوفر"; // Return a default message if date is invalid
      }
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "التاريخ غير متوفر";
    }
  };

  return (
    <Link href={`/question/${uuid}`}>
      <div className="border border-gray-200 rounded-lg mt-4 p-4 md:p-6 hover:shadow-md transition-all duration-200 bg-white cursor-pointer">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-2 md:space-y-0">
            <div className="text-sm text-gray-500 order-2  md:order-1">
              <div className="font-medium">Q&A</div>
              <div className="mt-1">{formatDate(date)}</div>
            </div>
            <h3 className="text-base md:text-lg font-medium text-right flex-1 md:mr-4 order-1 md:order-2">
              {title}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs md:text-sm text-gray-500 hover:text-gray-700">
              اقرأ إجابات كاملة وناقش
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Main page component
export default async function LegalAdvicePage({ searchParams }) {
  // Get the specialty and page from URL params
  const specialty = searchParams?.speciality
    ? decodeURIComponent(searchParams.speciality)
    : null;
  const page = searchParams?.page || 1;

  const questionsData = await getQuestions(specialty, page);

  return (
    <div className="mt-4 md:mt-8 py-4 md:py-8">
      <div className="relative h-[400px] bg-[url('/images/law-bg.png')] bg-cover bg-center mb-4 md:mb-8">
        <div className="absolute inset-0 flex flex-col items-center md:items-end px-4 md:pr-20 justify-center text-white bg-black/30 text-center">
          <h1 className="text-2xl md:text-3xl mt-8 md:mt-0 font-bold mb-2 md:mb-4">
            النصائح القانونية - {specialty || "جميع الاسئلة"}
          </h1>
          <p className="text-base md:text-lg md:text-right text-center mb-4 md:mb-8 max-w-[90%] md:max-w-2xl">
            النصائح هي وسيلة قانونية للمساعدة في الإجابات التي لم يتمكنوا قادرين
            على العثور عليها مسبقاً
          </p>
          <div className="w-full max-w-[90%] md:max-w-2xl">
            <SearchBar placeholder="ابحث في الأسئلة" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto rounded-lg shadow-lg p-4 md:p-6 px-4 md:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-right">
          {specialty || "جميع الاسئلة"}
        </h2>

        {(!questionsData.data || questionsData.data.length === 0) && (
          <div className="text-center text-gray-500 py-6 md:py-8">
            <p className="text-lg md:text-xl">لا توجد نتائج للبحث</p>
            <Link href="/Askquestion">
              <button className="bg-blue-800 mt-5 text-white px-4 py-2 rounded-md">
                أسال محامي لمساعدتك مجاناً
              </button>
            </Link>
          </div>
        )}

        <div className="space-y-3 md:space-y-4">
          {questionsData.data &&
            questionsData.data.map((question) => (
              <QuestionCard
                key={question.uuid}
                uuid={question.uuid}
                title={question.question_title}
                date={question.created_at}
              />
            ))}
        </div>

        {questionsData.data && questionsData.data.length > 0 && !specialty && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6 md:mt-8">
            {questionsData.links?.map((link, index) => {
              if (
                link.label === "pagination.previous" ||
                link.label === "pagination.next"
              ) {
                return null;
              }

              const pageNumber = link.label;
              const href = {
                pathname: "/legal-advice",
                query: { page: pageNumber },
              };

              return (
                <Link
                  key={index}
                  href={href}
                  className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded ${
                    link.active
                      ? "bg-gray-800 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
