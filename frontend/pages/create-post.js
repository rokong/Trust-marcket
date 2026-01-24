// frontend/pages/create-post.js
import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

export default function CreatePost() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NEW: upload progress %
  const [uploadPercent, setUploadPercent] = useState(0);

  const MAX_IMAGE_MB = 10;
  const MAX_VIDEO_MB = 100;

  // ---------- helpers ----------

  const validateFiles = (files, maxMB, type) => {
    for (let f of files) {
      if (f.size > maxMB * 1024 * 1024) {
        throw new Error(`${type} size exceeds ${maxMB}MB`);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
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

  // ---------- submit ----------

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    if (phoneError || phone.length !== 11) {
      setError("❌ Invalid phone number");
      return;
    }

    if (images.length === 0) {
      setError("❌ At least one image is required");
      return;
    }

    setIsSubmitting(true);
    setUploadPercent(0);

    try {
      validateFiles(images, MAX_IMAGE_MB, "Image");
      validateFiles(videos, MAX_VIDEO_MB, "Video");
    } catch (err) {
      setError(`❌ ${err.message}`);
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsSubmitting(false);
      router.push("/login");
      return;
    }

    const requestId =
      crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("phone", phone);
    formData.append("requestId", requestId);

    images.forEach((f) => formData.append("images", f));
    videos.forEach((f) => formData.append("videos", f));

    try {
      await api.post("/posts/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
        // ✅ REAL upload progress
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercent(percent);
        },
      });

      setUploadPercent(100);
      router.replace("/");
    } catch (err) {
      console.error(err?.response?.data || err);
      setError("❌ Failed to create post");
      setIsSubmitting(false);
    }
  };

  // ---------- UI ----------

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 z-50"
      >
        Home
      </button>

      <h2 className="text-3xl font-bold text-blue-600 mt-16 text-center">
        Create a New Post
      </h2>

      <form
        onSubmit={handleCreatePost}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl mt-6 space-y-6"
      >
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-4 rounded-lg w-full"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-4 rounded-lg w-full h-32"
        />

        <div className="relative">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border p-4 rounded-lg w-full"
          />
          {price && (
            <span className="absolute right-4 top-4 text-gray-500">
              Final → {calculatedPrice}
            </span>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-4 rounded-lg w-full"
        >
          <option>Gaming</option>
          <option>Facebook Page</option>
          <option>Website</option>
          <option>YouTube Channel</option>
        </select>

        {/* Images */}
        <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer">
          Select Images (max {MAX_IMAGE_MB}MB each)
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => setImages([...e.target.files])}
          />
          {images.map((f, i) => (
            <p key={i} className="text-xs mt-1">{f.name}</p>
          ))}
        </label>
        {/* Videos */}
        <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer">
          Select Videos (max {MAX_VIDEO_MB}MB each)
          <input
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => setVideos([...e.target.files])}
          />
          {videos.map((f, i) => (
            <p key={i} className="text-xs mt-1">{f.name}</p>
          ))}
        </label>

        <input
          type="text"
          placeholder="Phone (01XXXXXXXXX)"
          value={phone}
          onChange={handlePhoneChange}
          className="border p-4 rounded-lg w-full"
        />
        {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}

        {/* ✅ SaaS-style Progress Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
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
