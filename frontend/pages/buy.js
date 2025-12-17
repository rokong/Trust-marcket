// frontend/pages/buy.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CreditCard, Phone, DollarSign } from "lucide-react";
import api from "../utils/api";

export default function BuyPage() {
  const router = useRouter();
  const { post } = router.query;
  const [postData, setPostData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  useEffect(() => {
    if (!post) return;
    const loadPost = async () => {
      try {
        const res = await api.get(`/posts/${post}`);
        setPostData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadPost();
  }, [post]);

  if (!postData) return <p>Loading...</p>;

  const handleConfirmBuy = () => {
    if (paymentMethod === "bkash") {
      router.push(`/payment/bkash?post=${postData._id}`);
      return;
    }

    alert("এই payment method এখনো active না");
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 flex justify-center items-start relative">
      {/* 🔹 Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-900 transition text-sm sm:text-base"
      >
        ← Back
      </button>

      <div className="w-full max-w-md sm:max-w-4xl bg-white shadow-2xl rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Checkout
        </h1>

        {/* Post Info */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl shadow-inner border-l-4 border-blue-600">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">{postData.title}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{postData.description}</p>
          <p className="text-blue-600 font-bold mt-3 sm:mt-4 text-lg sm:text-xl">
            💰 {postData.price} BDT
          </p>
        </div>

        {/* Payment Options */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
            Select Payment Method
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setPaymentMethod("bkash")}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl shadow-md transition text-sm sm:text-base ${
                paymentMethod === "bkash"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              Bkash
            </button>

            <button
              onClick={() => setPaymentMethod("rocket")}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl shadow-md transition text-sm sm:text-base ${
                paymentMethod === "rocket"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              Rocket
            </button>

            <button
              onClick={() => setPaymentMethod("visa")}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl shadow-md transition text-sm sm:text-base ${
                paymentMethod === "visa"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              Visa / MasterCard
            </button>

            <button
              onClick={() => setPaymentMethod("nogad")}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl shadow-md transition text-sm sm:text-base ${
                paymentMethod === "nogad"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              Nogad
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={handleConfirmBuy}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-bold rounded-2xl shadow-xl hover:bg-green-700 transition text-base sm:text-lg"
          >
            Confirm Payment
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border-t-4 border-blue-600 max-w-3xl mx-auto">
          {/* Heading */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 text-gray-800 text-center">
            Trust Market – আপনার নিরাপদ ও সহজ অনলাইন মার্কেটপ্লেস অ্যাপ
          </h3>

          {/* Description */}
          <p className="text-gray-700 mb-4 sm:mb-5 text-justify text-sm sm:text-base md:text-lg leading-relaxed">
            Trust Market একটি আধুনিক অ্যাপ যা ব্যবহারকারীদের জন্য নিরাপদ, সহজ এবং সুবিধাজনকভাবে অনলাইন কেনাবেচার সুযোগ করে দেয়।<br /><br />
            আপনি আগে পেমেন্ট করবেন, তারপর আমাদেরকে SMS এর মাধ্যমে আপনার এজেন্টের নাম্বার জানাবেন। এরপর আমরা আপনার নির্বাচিত জিনিসটি SMS এর মাধ্যমে নিশ্চিত করে পাঠিয়ে দেব। যদি কোনো কারণে জিনিসটি আপনার চাহিদা অনুযায়ী না হয়, তাহলে ৩০ মিনিটের মধ্যে আমাদের জানালে টাকা ফেরত দেওয়া হবে। আপনার কেনাকাটা হবে সম্পূর্ণ নিরাপদ ও স্বাচ্ছন্দ্যময়।
          </p>

          {/* Features */}
          <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-gray-800">
            প্রধান ফিচারসমূহ:
          </h4>

          <ul className="list-disc list-inside text-gray-700 space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
            <li>✅ নিরাপদ লেনদেন</li>
            <li>✅ সহজ ন্যাভিগেশন</li>
            <li>✅ বিক্রেতাদের জন্য সুবিধা</li>
            <li>✅ রিয়েল টাইম আপডেট</li>
            <li>✅ বিশ্বাসযোগ্য কমিউনিটি</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
