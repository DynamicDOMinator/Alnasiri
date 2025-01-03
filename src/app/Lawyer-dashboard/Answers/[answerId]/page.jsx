export default function Answers({ params }) {
  const { answerId } = params;

  return (
    <div className="p-6">
      <div className="lg:w-[80%] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="flex items-center">
              ديسمبر <span>17</span>
            </p>
            <p className="text-lg">أحمد السيد</p>
          </div>
          <h2 className="text-right text-2xl mb-4">بحث عن قضية جنائة</h2>
          <p className="text-right text-lg text-gray-500">
            البحث عن محامي ذو خبرة في انواع هذة القضاية
          </p>
        </div>

        {/* Answer Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-right text-xl mb-4">إجابتي</h3>
          <div className="text-right text-lg">
            {/* Add your answer content here */}
            <p className="text-gray-700">
              هنا يتم عرض تفاصيل الإجابة الخاصة بك...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
