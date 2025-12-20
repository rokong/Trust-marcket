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
  const [phoneError, setPhoneError] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Phone validation (LIVE)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) return;

    setPhone(value);

    if (!value.startsWith("01")) {
      setPhoneError("Phone number must start with 01");
    } else if (value.length !== 11) {
      setPhoneError("Phone number must be exactly 11 digits");
    } else {
      setPhoneError("");
    }
  };

  // 20% price increase
  const calculatedPrice = price ? (parseFloat(price) * 1.2).toFixed(2) : 0;

  const handleCreatePost = async (e) => {
    e.preventDefault();

    // hard stop on invalid phone
    if (phoneError || phone.length !== 11) {
      setError("❌ Invalid phone number");
      setSuccess("");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", calculatedPrice);
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

      setSuccess(`✅ Post created successfully! Final price: ${calculatedPrice}`);
      setError("");

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("Gaming");
      setImages([]);
      setVideos([]);
      setPhone("");
      setPhoneError("");
    } catch (err) {
      console.error(err?.response?.data || err);
      setError("❌ Failed to create post.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 relative">
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        Home
      </button>

      <h2 className="text-2xl font-bold text-blue-600 mt-16">
        Create a New Post
      </h2>

      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg mt-4 space-y-4"
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
            <span className="absolute right-3 top-3 text-sm text-gray-500">
              +20% → {calculatedPrice}
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
          placeholder="Phone (01XXXXXXXXX)"
          value={phone}
          onChange={handlePhoneChange}
          className="border w-full p-3 rounded"
        />

        {phoneError && (
          <p className="text-red-600 text-sm">{phoneError}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
