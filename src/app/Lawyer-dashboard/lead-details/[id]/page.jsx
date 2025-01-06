"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function LeadDetails() {
  const { id } = useParams();

  useEffect(() => {
    const saved = localStorage.getItem("seenLeads");
    const seenLeads = saved ? JSON.parse(saved) : [];

    if (!seenLeads.includes(Number(id))) {
      const updatedSeenLeads = [...seenLeads, Number(id)];
      localStorage.setItem("seenLeads", JSON.stringify(updatedSeenLeads));
    }
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-2xl font-semibold text-right">تفاصيل الفرصة {id}</h1>
    </div>
  );
}
