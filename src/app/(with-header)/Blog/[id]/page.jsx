async function getBlogData(uuid) {
  try {
    console.log(`Fetching blog data for UUID: ${uuid}`);

    const res = await fetch(
      `http://127.0.0.1:8000/api/blogs/get-blog-by-uuid/${uuid}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    return data; // The API now returns the blog directly, no need to find it
  } catch (error) {
    console.error("Error fetching blog data:", error);
    throw new Error("Failed to fetch blog data");
  }
}

export default async function BlogPost({ params }) {
  console.log("Page params:", params);

  const blog = await getBlogData(params.id); // Changed from params.uuid to params.id

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
