"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("Payment successful! Redirecting to your orders...");
          setTimeout(() => router.replace("/orders?receipt=sent"), 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Payment verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please check your orders.");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 border-t">
      {status === "verifying" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-gray-700">{message}</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{message}</p>
          <button
            onClick={() => router.push("/orders")}
            className="bg-black text-white px-6 py-2 rounded"
          >
            View Orders
          </button>
        </div>
      )}
    </div>
  );
}
