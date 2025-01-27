"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LawyerProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main lawyers page if someone tries to access /lawyer-profile directly
    router.push('/Find-Lawyer');
  }, [router]);

  return null; // This page will redirect immediately
}
