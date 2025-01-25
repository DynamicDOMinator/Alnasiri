import Image from "next/image";
import Link from "next/link";

function decodeHtml(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export const revalidate = 3600; // Revalidate every hour

async function getData() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-all-blogs`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default async function Blog() {
  const blogs = await getData();

  // If no blogs are returned, show a message
  if (!blogs || blogs.length === 0) {
    return (
      <div className="pt-16 pb-16" dir="rtl">
        <div className="bg-blue-900 w-full h-[160px] pt-6 pr-10 text-white">
          <h1 className="text-2xl font-bold">المدونة</h1>
          <p className="mt-2">
            تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات
          </p>
        </div>
        <div className="pt-16 text-center">
          <p>لا توجد مقالات متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16" dir="rtl">
      <div className="bg-blue-900 w-full h-[160px] pt-6 pr-10 text-white">
        <h1 className="text-2xl font-bold">المدونة</h1>
        <p className="mt-2">
          تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات
        </p>
      </div>

      <div className="pt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Link href={`/Blog/${blog.uuid}`} key={blog.id}>
              <div className="h-[350px] relative w-[350px] bg-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  className="rounded-lg h-[150px] w-full object-cover"
                  src="/images/blog.jpg"
                  alt={decodeHtml(blog.title)}
                  width={300}
                  height={300}
                  priority={true}
                />
                <div className="p-4">
                  <div
                    className="text-lg font-semibold overflow-hidden max-h-[80px] bg-white"
                    dangerouslySetInnerHTML={{ __html: blog.title }}
                  />
                  <div
                    className="line-clamp-2 mt-2 overflow-hidden bg-white"
                    dangerouslySetInnerHTML={{
                      __html: blog.description,
                    }}
                  />
                  <button className="bg-blue-500 absolute bottom-4 right-4 text-white px-4 py-2 rounded-lg">
                    قراءة المزيد
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
