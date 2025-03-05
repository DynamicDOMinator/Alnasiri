"use client";
import { FaArrowRight } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ClientsReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error('No token found');
          return;
        }

        const res = await axios.get(`${BaseUrl}/lawyer/get-reviews-by-token`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        
        setReviews(res.data);
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [BaseUrl]);

  return (
    <div className="min-h-screen relative">
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div dir="rtl" className="mt-20">
            <Link href="/Lawyer-dashboard/Settings">
              <p>
                <FaArrowRight />
              </p>
            </Link>
            <h1 className="lg:text-3xl text-center text-xl lg:text-right font-bold mt-5">اراء العملاء</h1>
          </div>

          {reviews.length === 0 ? (
            <div className="mt-10 border-2 p-4 rounded-lg">
              <div className="flex items-center gap-2 justify-end">
                <p>لا توجد مراجعات حتى الآن</p>
                <MdOutlineReviews />
              </div>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="mt-10 border-2 p-4 rounded-lg">
                <div className="flex items-center gap-2 justify-end">
                  <p>احمد</p>
                  <FaUser />
                </div>

                <div className="flex items-center gap-2 justify-end pt-2">
                  <p className="whitespace-pre-wrap break-words text-wrap w-full text-right">{review.text}</p>
                  <MdOutlineReviews />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
