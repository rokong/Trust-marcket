// frontend/pages/create-post.js
import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // লাইভ 10% বৃদ্ধি হিসাব
  const calculatedPrice = price ? (parseFloat(price) * 1.1).toFixed(2) : 0;

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", calculatedPrice); // 10% বাড়ানো প্রাইস
    formData.append("category", category);
    formData.append("phone", phone);

    Array.from(images).forEach((file) => formData.append("images", file));
    Array.from(videos).forEach((file) => formData.append("videos", file));

    try {
      await api.post("/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(`✅ Post created successfully! Price with 10% added: ${calculatedPrice}`);
      setError("");

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("Gaming");
      setImages([]);
      setVideos([]);
      setPhone("");
    } catch (err) {
      console.error(err?.response?.data || err);
      setError("❌ Failed to create post.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 relative">

      {/* Home Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition z-50"
      >
        Home
      </button>

      <h2 className="text-2xl font-bold text-center text-blue-600 mt-16 md:mt-20">
        Create a New Post
      </h2>

      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-lg mt-4 space-y-4"
      >
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border w-full p-3 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border w-full p-3 rounded h-32"
        />

        <div className="relative">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border w-full p-3 rounded"
          />
          {price && (
            <span className="absolute right-3 top-3 text-gray-500 text-sm">
              +10% → {calculatedPrice}
            </span>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border w-full p-3 rounded"
        >
          <option>Gaming</option>
          <option>Facebook Page</option>
          <option>Website</option>
          <option>YouTube Channel</option>
        </select>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="border w-full p-2 rounded"
        />

        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => setVideos(e.target.files)}
          className="border w-full p-2 rounded"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border w-full p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
