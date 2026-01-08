// frontend/pages/admin/posts/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

export default function SinglePostAdmin() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  // Fullscreen modal state
  const [modalContent, setModalContent] = useState(null); // {type: 'image'|'video', src: string}

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (!id) return;
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);

      if (res.data.userId) {
        const userRes = await api.get(`/admin/message-user/${res.data.userId}`);
        setUser(userRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const incrementViews = async () => {
    try {
      await api.patch(`/posts/${id}/views`);
      setPost(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-2xl relative">

      {/* Back Button */}
      <div className="flex justify-start mb-4">
        <Link
          href="/admin/posts"
          className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold mb-4 text-gray-900 break-words">{post.title}</h1>

      {/* Description */}
      <p className="mb-4 text-gray-700 text-sm md:text-lg break-words">{post.description}</p>

      {/* Price & Category */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold text-xs md:text-sm">
          Price: {post.price}
        </span>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold text-xs md:text-sm">
          Category: {post.category}
        </span>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {post.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`image-${index}`}
              className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
              onClick={() => setModalContent({ type: "image", src: img })}
            />
          ))}
        </div>
      )}


      {/* Videos */}
      {post.videos && post.videos.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {post.videos.map((vid, index) => (
            <video
              key={index}
              className="w-48 h-32 md:w-60 md:h-36 rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
              onClick={() => setModalContent({ type: "video", src: vid })}
              muted
              controls
            >
              <source src={vid} type="video/mp4" />
            </video>
          ))}
        </div>
      )}


      {/* Contact & Details */}
      <div className="space-y-1 md:space-y-2 text-gray-800 mt-4 text-sm md:text-base">
        {user && <p><span className="font-semibold">Email:</span> {user.email}</p>}
        <p><span className="font-semibold">Phone:</span> {post.phone}</p>
        <p><span className="font-semibold">Date & Time:</span> {new Date(post.createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Views:</span> {post.views || 0}</p>
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
          আপনি আগে পেমেন্ট করবেন। এরপর আমরা আপনার নির্বাচিত জিনিসটি SMS এর মাধ্যমে নিশ্চিত করে পাঠিয়ে দেব। যদি কোনো কারণে জিনিসটি আপনার চাহিদা অনুযায়ী না হয়, তাহলে ৩০ মিনিটের মধ্যে আমাদের জানালে টাকা ফেরত দেওয়া হবে।
          দ্রষ্টব্য: জদি আপনার নিরবাচিত জিনিস টি পাওয়ার সাথে সাথে ১ ঘন্টা মধে একাউন্ট এ আপনার এক্সেস না বসান কিছু হলে trust market দাই নয়
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
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <button
            className="absolute top-4 md:top-6 right-4 md:right-6 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
            onClick={() => setModalContent(null)}
          >
            <X className="w-6 h-6" />
          </button>
          {modalContent.type === "image" ? (
            <img src={modalContent.src} className="max-h-full max-w-full object-contain rounded-xl" />
          ) : (
            <video src={modalContent.src} controls autoPlay className="max-h-full max-w-full rounded-xl" />
          )}
        </div>
      )}
    </div>
  );
}
