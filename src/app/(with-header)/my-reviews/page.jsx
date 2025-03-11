'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaUserCircle, FaTrash, FaCommentSlash } from 'react-icons/fa';
import Link from 'next/link';

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                const token = localStorage.getItem("token");
              
                console.log('API URL:', `${BASE_URL}/lawyer/my-reviews`); // Debug URL

                const response = await fetch(`${BASE_URL}/lawyer/my-reviews`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('Response error:', response.status, errorData);
                    throw new Error(`Failed to fetch reviews: ${response.status} ${errorData}`);
                }

                const data = await response.json();
                setReviews(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDeleteReview = async (id) => {
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${BASE_URL}/lawyer/delete-review/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            // Remove the deleted review from state
            setReviews(reviews.filter(review => review.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                    onClick={() => {
                        setError(null);
                        setLoading(true);
                        fetchReviews();
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20 min-h-screen max-w-7xl">
            <h1 className="text-3xl font-bold mb-8 text-right ">المراجعات</h1>
            <div dir="rtl" className="flex mt-10 items-start flex-col-reverse lg:flex-row-reverse gap-6">
                <div className="border-t-4 lg:w-1/3 w-full border-blue-800  pb-5 bg-white p-2 flex flex-col items-center shadow-md">
                    <h2 className="text-lg font-bold mt-2">أسأل سؤال مجاني</h2>
                    <p className="text-gray-800 mt-2">
                        اطرح سؤالاً واحصل على مشورة مجانية من عدة محامين
                    </p>
                    <button className="bg-blue-800 mt-10 hover:bg-blue-900 text-white px-4 py-2 rounded">
                        <Link href="/Askquestion">اسأل سؤال مجاني</Link>
                    </button>
                </div>
                <div className="lg:w-2/3 w-full gap-6 ">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white mt-5 rounded-lg shadow-md p-6 w-full">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {review.lawyer.office[0]?.full_profile_image_url ? (
                                        <Image
                                            src={review.lawyer.office[0].full_profile_image_url}
                                            alt={review.lawyer.name}
                                            width={112}
                                            height={150}
                                            className="w-[112px] h-[150px] outline outline-2 outline-gray-300"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-grow max-w-full overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-semibold">{review.lawyer.name}</h3>
                                        <button 
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="text-blue-400 border-2 py-2 px-2 border-blue-400 hover:text-blue-500 transition-colors flex-shrink-0"
                                            title="حذف المراجعة"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="mt-3 text-gray-600 break-words whitespace-pre-wrap ">{review.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                            <FaCommentSlash className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مراجعات</h3>
                            <p className="text-gray-500 text-center">لم يتم العثور على أي مراجعات في الوقت الحالي</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}