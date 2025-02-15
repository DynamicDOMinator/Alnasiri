import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import parse from "html-react-parser";

// Helper function to ensure proper image URL formatting
function getImageUrl(url) {
  if (!url) return "/images/default-blog.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/images/${url}`;
}

// Helper function to generate URL-friendly slugs
function generateSlug(text) {
  if (!text) return '';
  const cleanText = text.toString()
    .toLowerCase()
    .trim()
    .replace(/[^\u0621-\u064A0-9a-z\s]/g, '') // Allow Arabic letters, numbers, and English letters
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  
  return cleanText.substring(0, 60); // Limit to 60 chars for cleaner URLs
}

// Helper function to strip HTML tags
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

// Generate metadata for the blog list page
export const metadata = {
  title: "المدونة - المقالات القانونية",
  description: "تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات",
  openGraph: {
    title: "المدونة - المقالات القانونية",
    description: "تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "المدونة - المقالات القانونية",
    description: "تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات",
  },
  other: {
    keywords: "مقالات قانونية, محامين, قانون, استشارات قانونية",
  },
  alternates: {
    canonical: "/",
  },
};

async function getData() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-all-blogs`, {
      next: {
        revalidate: 3600 // Revalidate every hour
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function Blog() {
  const blogs = await getData();

  // Filter out inactive blogs (status = 0)
  const activeBlogs = blogs.filter((blog) => blog.status === "1");

  // If no active blogs are returned, show a message
  if (!activeBlogs || activeBlogs.length === 0) {
    return (
      <div className="pt-16 pb-16" dir="rtl">
        <div className="bg-blue-900 w-full h-[160px] pt-6 pr-10 text-white">
          <p className="text-2xl font-bold">المدونة</p>
          <p className="mt-2">
            تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات
          </p>
        </div>
        <div className="container mx-auto px-4 mt-8">
          <p className="text-center text-gray-600">
            لا توجد مقالات متاحة حالياً
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16" dir="rtl">
      <div className="bg-blue-900 w-full h-[160px] pt-6 pr-10 text-white">
        <p className="text-2xl font-bold">المدونة</p>
        <p className="mt-2">
          تصفح أحدث المقالات المتعلقة بالقانون والمحامين والمحاميات
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeBlogs.map((blog) => (
            <Link 
              href={`/${blog.url}`}
              key={blog.uuid}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-[470px]">
                <div className="relative h-[50%] w-full">
                  {blog.blog_image? (
                    <Image
                      src={getImageUrl(blog.blog_image)}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaUserCircle className="w-32 h-32 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="mb-2 line-clamp-2">{stripHtml(blog.title)}</h2>
                  <div className="mb-4 line-clamp-3 flex-1">
                    {stripHtml(blog.description)}
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
