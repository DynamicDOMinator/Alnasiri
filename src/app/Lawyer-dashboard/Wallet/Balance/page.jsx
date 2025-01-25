"use client";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Balance() {
  const [balance, setBalance] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [spent, setSpent] = useState(0);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(`${API_BASE_URL}/wallet/get-balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(response.data.balance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBalance();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${API_BASE_URL}/wallet/total-deposit`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeposit(response.data.amount);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDeposit();
  }, [API_BASE_URL]);



  useEffect(() => {
    const fetchSpent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${API_BASE_URL}/wallet/total-spent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSpent(response.data.amount);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSpent();
  }, [API_BASE_URL]);

  return (
    <div
      dir="rtl"
      className="lg:max-w-3xl mx-auto px-4 relative mb-28 lg:mb-10"
    >
      <div className="sticky top-0 bg-white pb-2">
        <div className="pt-10">
          <div className="flex lg:flex-col items-start justify-start relative">
            <Link href="/Lawyer-dashboard/Wallet">
              <FaArrowRight />
            </Link>
            <h1 className="lg:text-3xl font-bold pt-6 w-full text-center lg:text-right">
              الرصيد
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-10 border-2 p-5 text-center">
        {/* balance  */}
        <p className="mt-5 text-2xl font-semibold">
          <span>{balance} </span>
          ر.س
        </p>

        <p className="text-gray-800 text-sm">الرصيد الحالي</p>

        <div>
          <Link href="/Lawyer-dashboard/Wallet/Deposit">
            <button className="bg-green-700 w-full md:w-1/3 text-white py-2 px-4 rounded-md my-10">
              اضافة اموال
            </button>
          </Link>
        </div>
      </div>

      {/* end of the balance card  */}
      <div className="flex lg:flex-row  flex-col  justify-between gap-5 mt-5 items-center">
        <div className="border-2 text-center p-5 rounded-md w-full lg:w-1/2">
          <p>
            {spent} <span>ر.س</span>
          </p>
          <p>اجمالي الصرف</p>
        </div>
        <div className="border-2 text-center p-5 rounded-md w-full lg:w-1/2">
          <p>
            {deposit} <span>ر.س</span>
          </p>
          <p>اجمالي الشحن</p>
        </div>
      </div>
    </div>
  );
}
