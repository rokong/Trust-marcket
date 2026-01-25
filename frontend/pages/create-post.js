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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

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
    if (isSubmitting) return;

    if (phoneError || phone.length !== 11) {
      setError("❌ Invalid phone number");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setIsSubmitting(false);
      return router.push("/login");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("phone", phone);

    images.forEach((f) => formData.append("images", f));
    videos.forEach((f) => formData.append("videos", f));

    try {
      await api.post("/posts/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (e) => {
          if (!e.total) return;
          setUploadPercent(
            Math.round((e.loaded * 100) / e.total)
          );
        },
      });

      router.replace("/");
    } catch (err) {
      setError("❌ Failed to create post.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-blue-600 mt-16 text-center">
        Create a New Post
      </h2>

      <form
        onSubmit={handleCreatePost}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl mt-6 space-y-6"
      >
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
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
              Final Price → {calculatedPrice}
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

        {/* Image Upload */}
        <label
          className={`relative border-2 border-dashed p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
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
            <>
              <p className="text-sm text-gray-600 mt-2">
                {images.length} file(s) selected
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImages([]);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </>
          )}
        </label>

        {/* Video Upload */}
        <label
          className={`relative border-2 border-dashed p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
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
            <>
              <p className="text-sm text-gray-600 mt-2">
                {videos.length} file(s) selected
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVideos([]);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </>
          )}
        </label>

        <input
          placeholder="Phone (01XXXXXXXXX)"
          value={phone}
          onChange={handlePhoneChange}
          className="border p-4 rounded-lg w-full"
        />
        {phoneError && <p className="text-red-600">{phoneError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold ${
            isSubmitting
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? `Posting… ${uploadPercent}%` : "Create Post"}
        </button>
      </form>
    </div>
  );
}
