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
          setUploadPercent(Math.round((e.loaded * 100) / e.total));
        },
      });

      router.replace("/");
    } catch (err) {
      setError("❌ Failed to create post");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-blue-600 mt-16">
        Create a New Post
      </h2>

      <form
        onSubmit={handleCreatePost}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl mt-6 space-y-6"
      >
        {error && <p className="text-red-600">{error}</p>}

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

        {/* IMAGE UPLOAD */}
        <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer">
          Select Images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setImages([...images, ...e.target.files])}
          />
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VIDEO UPLOAD */}
        <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer">
          Select Videos
          <input
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => setVideos([...videos, ...e.target.files])}
          />
        </label>

        {videos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {videos.map((file, i) => (
              <div key={i} className="relative">
                <video
                  src={URL.createObjectURL(file)}
                  className="h-32 w-full rounded"
                  controls
                />
                <button
                  type="button"
                  onClick={() =>
                    setVideos(videos.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          placeholder="Phone (01XXXXXXXXX)"
          value={phone}
          onChange={handlePhoneChange}
          className="border p-4 rounded-lg w-full"
        />
        {phoneError && <p className="text-red-600">{phoneError}</p>}

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-lg"
        >
          {isSubmitting ? `Posting… ${uploadPercent}%` : "Create Post"}
        </button>
      </form>
    </div>
  );
}
