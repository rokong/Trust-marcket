// frontend/pages/post/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import { Heart, MessageCircle, ShoppingCart, X } from "lucide-react";

export default function ViewPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  // Fullscreen modal state
  const [fullscreenMedia, setFullscreenMedia] = useState(null); // { type: 'image' | 'video', src: '' }

  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadPost();
  }, [id]);

  const handleBuy = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to buy!");
      router.push("/login");
      return;
    }
    router.push(`/buy?post=${post._id}`);
  };

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      router.push("/login");
      return;
    }

    try {
      const res = await api.post(`/posts/favorite/${post._id}`);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle favorite");
    }
  };

  const handleMessage = () => {
    router.push(`/messages?post=${post._id}`);
  };

  if (!post) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto relative">

      {/* Top Right Home Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/")}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm sm:text-base"
        >
          Home
        </button>
      </div>

      {/* Post Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">{post.title}</h2>
      <p className="text-gray-600 mb-2 sm:mb-4">{post.description}</p>
      <p className="font-bold text-blue-600 mb-4 sm:mb-6 text-lg sm:text-xl">💰 {post.price} BDT</p>

      {/* Images */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">
        {post.images?.map((img) => (
          <img
            key={img}
            src={`http://localhost:5000/uploads/${img}`}
            className="w-full sm:w-[48%] max-h-72 sm:max-h-96 object-cover rounded-xl cursor-pointer"
            onClick={() => setFullscreenMedia({ type: "image", src: `http://localhost:5000/uploads/${img}` })}
          />
        ))}
      </div>

      {/* Videos */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6">
        {post.videos?.map((vid) => (
          <video
            key={vid}
            controls
            className="w-full sm:w-[48%] max-h-72 sm:max-h-96 rounded-xl cursor-pointer"
            onClick={() => setFullscreenMedia({ type: "video", src: `http://localhost:5000/uploads/${vid}` })}
          >
            <source src={`http://localhost:5000/uploads/${vid}`} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
        <button
          onClick={handleFavorite}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm sm:text-base"
        >
          <Heart className="w-5 h-5" /> Favorite
        </button>

        <button
          onClick={handleMessage}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
        >
          <MessageCircle className="w-5 h-5" /> Message
        </button>

        <button
          onClick={handleBuy}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
        >
          <ShoppingCart className="w-5 h-5" /> Buy
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

      {/* Fullscreen Modal */}
      {fullscreenMedia && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenMedia(null)}
            className="absolute top-5 right-5 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-900 transition"
          >
            <X className="w-6 h-6" />
          </button>

          {fullscreenMedia.type === "image" ? (
            <img
              src={fullscreenMedia.src}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          ) : (
            <video
              src={fullscreenMedia.src}
              controls
              autoPlay
              className="max-h-full max-w-full rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
}
