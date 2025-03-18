import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import parse from "html-react-parser";
import Link from "next/link";
// Helper function to ensure proper image URL formatting
function getImageUrl(url) {
  if (!url) return "/images/default-avatar.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/images/${url}`;
}

// Helper function to strip HTML tags
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

async function getBlogData(url) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-blog-by-url/${url}`, {
      cache: "no-store", // This ensures SSR behavior
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blog data: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const blog = await getBlogData(params.id);

  if (!blog) {
    return {
      title: "مقال غير موجود",
      description: "عذراً، لم يتم العثور على المقال المطلوب",
    };
  }

  const cleanTitle = stripHtml(blog.page_title);
  const cleanDescription = stripHtml(blog.Meta_Description);

  return {
    title: `نصيري | ${cleanTitle}`,
    description: cleanDescription,
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
    },
    other: {
      keywords: blog.Meta_Keywords,
    },
    alternates: {
      canonical: `/${params.id}`,
    },
  };
}

export default async function BlogPost({ params }) {
  const blog = await getBlogData(params.id);

  if (!blog || blog.status === "0") {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-50 px-4"
        dir="rtl"
      >
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center border-t-4 border-blue-600">
          <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
          <p className="text-2xl font-bold mb-3">عذراً</p>
          <p className="text-gray-600 mb-6">لم يتم العثور على  المطلوب</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto mt-10 px-4" dir="rtl">
      <div>
        {/* Blog Header */}
        <div className="p-6 border-b">
          <div className="mb-4 text-center">{parse(blog.title)}</div>
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                {blog.author_image ? (
                  <Image
                    src={getImageUrl(blog.author_image)}
                    alt={blog.author_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  </div>
                )}
              </div>

              <div className="font-semibold">{blog.author_name}</div>
            </div>
            <div className="text-sm mr-5">
              {new Date(blog.created_at).toLocaleDateString("ar-SA")}
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-6">
          <div className="prose prose-lg max-w-none">{parse(blog.content)}</div>
        </div>

        {/* Author Card */}
        <div className="border-4 border-blue-900 border-b-[60px] mt-8">
          <div className=" p-8">
            <div className="flex  gap-6">
              <div className="relative  h-24 w-24   rounded-full overflow-hidden">
                {blog.author_image ? (
                  <Image
                    src={getImageUrl(blog.author_image)}
                    alt={blog.author_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="text-2xl font-bold mb-2">
                  {blog.author_name}
                </div>
                <div className="text-gray-600 mb-4">
                  {parse(blog.author_description)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
