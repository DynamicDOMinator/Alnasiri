import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import parse from "html-react-parser";

// Helper function to ensure proper image URL formatting
function getImageUrl(url) {
  if (!url) return "/images/default-avatar.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/images/${url}`;
}

async function getBlogData(uuid) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-blog-by-uuid/${uuid}`, {
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

  return {
    title: blog.title,
    description: blog.Meta_Description,
    openGraph: {
      title: blog.title,
      description: blog.Meta_Description,
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.author_name],
    },
    other: {
      keywords: blog.Meta_Keywords,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_BASE_URL),
    alternates: {
      canonical: `/Blog/${params.id}`,
    },
  };
}

export default async function BlogPost({ params }) {
  const blog = await getBlogData(params.id);

  if (!blog || blog.status === "0") {
    return (
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">عذراً</h1>
          <p>لم يتم العثور على المقال المطلوب</p>
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
