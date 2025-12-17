// frontend/pages/payment/bkash.js
import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import { ArrowLeft } from "lucide-react";

export default function ManualPaymentPage() {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [trxID, setTrxID] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null); // null / true / false

  const handlePaymentSubmit = async () => {
    if (!price || !trxID) {
      setMessage("❌ Amount & trxID are required");
      setSuccess(false);
      return;
    }

    try {
      const { data } = await api.post("/api/payment/verify", { trxID, price });
      setMessage(data.message);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setMessage("❌ Payment verification error");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 relative">

      {/* Back Button */}
      <div 
        className="self-start mb-6 cursor-pointer flex items-center text-gray-700 hover:text-pink-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2" /> Back
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6 transition-transform transform hover:-translate-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-pink-600">
          Trust Market bKash Payment
        </h1>

        <p className="text-center text-gray-600 mb-1">Personal bKash Number:</p>
        <p className="text-center font-bold text-lg mb-6">01735702012</p>

        {/* Inputs */}
        <input
          type="number"
          placeholder="Amount"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          placeholder="trxID"
          value={trxID}
          onChange={(e) => setTrxID(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          onClick={handlePaymentSubmit}
          className="w-full bg-pink-600 text-white py-3 rounded-2xl font-semibold hover:bg-pink-700 transition-colors"
        >
          Verify Payment
        </button>

        {message && (
          <p className="mt-4 text-center font-semibold text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
