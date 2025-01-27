import Image from "next/image";
import Link from "next/link";


// Generate metadata for the blog list page
export const metadata = {
  title: 'المدونة - المقالات القانونية',
  description: 'تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات',
  openGraph: {
    title: 'المدونة - المقالات القانونية',
    description: 'تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات',
    type: 'website',
  },
  other: {
    'keywords': 'مقالات قانونية, محامين, قانون, استشارات قانونية',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_BASE_URL),
  alternates: {
    canonical: '/Blog',
  },
};

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

async function getData() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-all-blogs`, {
      cache: 'no-store', // This ensures SSR behavior
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

  // Filter out inactive blogs (status = 0)
  const activeBlogs = blogs.filter(blog => blog.status === "1");

  // If no active blogs are returned, show a message
  if (!activeBlogs || activeBlogs.length === 0) {
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
          {activeBlogs.map((blog) => (
            <Link href={`/Blog/${blog.uuid}`} key={blog.uuid}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.author_image || "/images/default-blog.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <span>بواسطة:</span>
                      <span>{blog.author_name}</span>
                    </span>
                    <span>{new Date(blog.created_at).toLocaleDateString("ar-SA")}</span>
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
