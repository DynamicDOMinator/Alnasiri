"use client";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState , useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Changephone() {

const [oldPhone , setOldPhone] = useState("")
const [newPhone , setNewPhone] = useState("")


useEffect(() => {
  const fetchOldPhone = async () => {
    try {
      const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BaseUrl}/user/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOldPhone(res.data.data.phone);
     
    } catch (error) {
      console.log(error);
    }
  };
  fetchOldPhone();
}, []);





const handleNewPhone = async () => {
  if (!newPhone.trim()) {
    toast.error('الرجاء إدخال رقم الهاتف الجديد');
    return;
  }
  try {
    const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = localStorage.getItem("token");
    
    const res = await axios.post(
      `${BaseUrl}/change-data/change-phone`,
      { phone: newPhone }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      toast.success('تم تغيير رقم الهاتف بنجاح', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        
      });
      setOldPhone(newPhone);
      setNewPhone("");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        window.location.href = "/";
      }, 3000);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'حدث خطأ أثناء تغيير رقم الهاتف');
    console.log(error.response?.data || error.message);
  }
};






  return (
    <div dir="rtl">
      <ToastContainer
        position="top-center"
        rtl={true}
      />
      <div className="max-w-4xl mx-auto  px-4 mt-10 mb-32 lg:mt-16">
        <Link href="/Lawyer-dashboard/account-settings">
          {" "}
          <FaArrowRightLong />{" "}
        </Link>

        <h1 className="lg:text-3xl pt-5 text-xl text-center font-bold  lg:text-right">
        رقم الهاتف الجوال
        </h1>







        <div className="flex items-center gap-4 mt-10">
          <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full">
            <label
              className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
              htmlFor=""
            >
           رقم الهاتف الجوال الحالي
            </label>
            <input
              className="bg-gray-100 px-2 py-2 focus:outline-none w-full h-full"
              type="tel"
              dir="ltr"
              value={oldPhone}
              readOnly
            />
          </div>

          <div className="flex items-center gap-1 border-2 py-3 px-4 rounded-lg bg-gray-100">
            <Image
              src="https://flagcdn.com/w40/sa.png"
              alt="KSA Flag"
              width={24}
              height={16}
              unoptimized
            />
              <span className="text-gray-600 pl-2 md:pl-0">966+</span>
          </div>
        </div>





        <div className="flex items-center gap-4 mt-10">
          <div className="border-2 relative rounded-lg  md:max-w-[400px] w-full">
            <label
              className="absolute -top-2.5 translate-x-1 transform right-3 bg-white px-1 text-sm text-gray-600"
             
            >
              رقم الهاتف الجوال الجديد
            </label>
            <input
              className="bg-gray-100 px-2 py-2 focus:outline-none w-full h-full"
              type="tel"
              dir="ltr"
              maxLength={9}
              placeholder="5xxxxxxxx"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 border-2 py-3 px-4 rounded-lg bg-gray-100">
            <Image
              src="https://flagcdn.com/w40/sa.png"
              alt="KSA Flag"
              width={24}
              height={16}
              unoptimized
            />
              <span className="text-gray-600 pl-2 md:pl-0">966+</span>
          </div>
        </div>
      

        <button onClick={() => {handleNewPhone()}}   className="bg-green-700 mt-10  text-white  hover:bg-green-800 px-14 py-3 rounded-md">
          حفظ التغيرات
        </button>
      </div>
    </div>
  );
}
