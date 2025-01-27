import Image from "next/image";
import { Metadata } from "next";

async function getBlogData(uuid) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-blog-by-uuid/${uuid}`, {
      cache: 'no-store', // This ensures SSR behavior
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
      title: 'مقال غير موجود',
      description: 'عذراً، لم يتم العثور على المقال المطلوب'
    };
  }

  return {
    title: blog.title,
    description: blog.Meta_Description,
    openGraph: {
      title: blog.title,
      description: blog.Meta_Description,
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.author_name],
    },
    other: {
      'keywords': blog.Meta_Keywords,
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Blog Header */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center justify-between text-gray-600 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={blog.author_image || "/images/default-author.jpg"}
                  alt={blog.author_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{blog.author_name}</p>
                <p className="text-sm">{blog.author_description}</p>
              </div>
            </div>
            <div className="text-sm">
              {new Date(blog.created_at).toLocaleDateString("ar-SA")}
            </div>
          </div>
          <p className="text-gray-600 text-lg mb-4">{blog.description}</p>
        </div>

        {/* Blog Content */}
        <div className="p-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>

        {/* Author Card */}
        <div className="border-t border-gray-200 mt-8">
          <div className="max-w-3xl mx-auto p-8">
            <div className="flex items-start gap-6">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={blog.author_image || "/images/whatsapp.png"}
                  alt={blog.author_name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{blog.author_name}</h3>
                <p className="text-gray-600 mb-4">{blog.author_description}</p>
                <div className="flex gap-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    الملف الشخصي
                  </a>
                  <a href="#" className="text-blue-600 hover:underline">
                    مقالات أخرى
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Update Info */}
        <div className="bg-gray-50 p-6">
          <div className="text-sm text-gray-600">
            آخر تحديث: {new Date(blog.updated_at).toLocaleDateString("ar-SA")}
          </div>
        </div>
      </div>
    </div>
  );
}
