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
  const [uploadPercent, setUploadPercent] = useState(0);

  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔒 submit lock
  const MAX_IMAGE_MB = 10;
  const MAX_VIDEO_MB = 100;
  const router = useRouter();

  const validateFiles = (files, maxMB, type) => {
    for (let f of files) {
      if (f.size > maxMB * 1024 * 1024) {
        throw new Error(`${type} size exceeds ${maxMB}MB`);
      }
    }
  };

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

  

  const calculateFinalPrice = (basePrice) => {
    const p = Number(basePrice);
    if (!p || p <= 0) return 0;
  
    let percent = 0;
  
    if (p <= 500) percent = 10;
    else if (p <= 1000) percent = 7;
    else if (p <= 1500) percent = 5;
    else if (p <= 2000) percent = 4;
    else if (p <= 3000) percent = 5;
    else if (p <= 3500) percent = 4;
    else if (p <= 4000) percent = 3;
    else percent = 2;
  
    return Math.round(p + (p * percent) / 100);
  };

  const calculatedPrice = calculateFinalPrice(price);
  
  const handleCreatePost = async (e) => {
    e.preventDefault();

    // 🔒 double click kill
    if (isSubmitting) return;

    if (phoneError || phone.length !== 11) {
      setError("❌ Invalid phone number");
      setSuccess("");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setIsSubmitting(false);
      return router.push("/login");
    }

    // 🆔 idempotency key
    const requestId =
      crypto.randomUUID?.() || Date.now() + "-" + Math.random();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("phone", phone);
    formData.append("requestId", requestId);

    Array.from(images).forEach((file) =>
      formData.append("images", file)
    );
    Array.from(videos).forEach((file) =>
      formData.append("videos", file)
    );

    try {
      await api.post("/posts/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercent(percent);
        },
      });

      // ✅ success → refresh once (no resubmit on back)
      router.replace("/");
      setUploadPercent(0);
    } catch (err) {
      console.error(err?.response?.data || err);
      setError("❌ Failed to create post.");
      setSuccess("");
      setIsSubmitting(false); // unlock on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition z-50"
      >
        Home
      </button>

      <h2 className="text-3xl font-bold text-blue-600 mt-16 md:mt-20 text-center">
        Create a New Post
      </h2>

      <form
        onSubmit={handleCreatePost}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-xl mt-6 space-y-6"
      >
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 p-4 rounded-lg w-full h-32 focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          {price && (
            <span className="absolute right-4 top-4 text-gray-500 font-medium">
              Final Price → {calculatedPrice}
            </span>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        >
          <option>Gaming</option>
          <option>Facebook Page</option>
          <option>Website</option>
          <option>YouTube Channel</option>
        </select>

        {/* Image Upload */} 
        <label
          className={`border-2 border-dashed p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
            images.length > 0
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
        >
          <span className="text-gray-500 mb-2">Select Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => setImages([...e.target.files])}
            className="hidden"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {images.length} file(s) selected
            </p>
          )}
        </label>

        {/* Video Upload */}
        <label
          className={`border-2 border-dashed p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
            videos.length > 0
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
        >
          <span className="text-gray-500 mb-2">Select Videos</span>
          <input
            type="file"
            accept="video/*"
            multiple
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => setVideos([...e.target.files])}
            className="hidden"
          />
          {videos.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {videos.length} file(s) selected
            </p>
          )}
        </label>
        <input
          type="text"
          placeholder="Phone (01XXXXXXXXX)"
          value={phone}
          onChange={handlePhoneChange}
          className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />
        {phoneError && (
          <p className="text-red-600 text-sm">{phoneError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold transition
            ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {isSubmitting ? (
            <div className="space-y-2">
              <p className="text-sm">Posting… {uploadPercent}%</p>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-600 rounded transition-all duration-300"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
            </div>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
}
