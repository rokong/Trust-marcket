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
          {post.images.map((img, index) => {
            const src = img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`;
            return (
              <img
                key={index}
                src={src}
                alt={`image-${index}`}
                className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
                onClick={() => setModalContent({ type: "image", src })}
              />
            );
          })}
        </div>
      )}

      {/* Videos */}
      {post.videos && post.videos.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {post.videos.map((vid, index) => {
            const src = vid.startsWith("http") ? vid : `${BASE_URL}/uploads/${vid}`;
            return (
              <video
                key={index}
                className="w-48 h-32 md:w-60 md:h-36 rounded-xl shadow-md cursor-pointer hover:opacity-90 transition"
                onClick={() => setModalContent({ type: "video", src })}
                muted
              >
                <source src={src} type="video/mp4" />
              </video>
            );
          })}
        </div>
      )}

      {/* Contact & Details */}
      <div className="space-y-1 md:space-y-2 text-gray-800 mt-4 text-sm md:text-base">
        {user && <p><span className="font-semibold">Email:</span> {user.email}</p>}
        <p><span className="font-semibold">Phone:</span> {post.phone}</p>
        <p><span className="font-semibold">Date & Time:</span> {new Date(post.createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Views:</span> {post.views || 0}</p>
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
