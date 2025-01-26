import Image from "next/image";
import Link from "next/link";

function decodeHtml(html) {
  if (!html) return '';
  
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
      next: { revalidate: 3600 }, // Use ISR with 1 hour revalidation
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
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
        <div className="container mx-auto px-4 mt-8">
          <p className="text-center text-gray-600">لا توجد مقالات متاحة حالياً</p>
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

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link href={`/Blog/${blog.id}`} key={blog.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.image || "/images/default-blog.jpg"}
                    alt={blog.title || 'Blog post'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {blog.title || 'Untitled Post'}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {decodeHtml(blog.content) || 'No content available'}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString("ar-SA") : 'No date'}</span>
                    <span>اقرأ المزيد</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
