export const revalidate = 3600; // Revalidate every hour

async function getBlogData(uuid) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-blog-by-uuid/${uuid}`, {
      next: { revalidate: 3600 },
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

// Generate static params for common blog posts
export async function generateStaticParams() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/blogs/get-all-blogs`);
    const blogs = await res.json();

    return blogs.map((blog) => ({
      id: blog.uuid,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function BlogPost({ params }) {
  const blog = await getBlogData(params.id);

  if (!blog) {
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
