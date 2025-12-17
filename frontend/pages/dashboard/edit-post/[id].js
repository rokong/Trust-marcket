//pages/dashboard/edit-post/[id].js
import { useEffect, useState } from "react"; 
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { ArrowLeft } from "lucide-react"; // ← back arrow icon

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    phone: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!id) return;

    api.get(`/posts/${id}`).then((res) => {
      setForm({
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        category: res.data.category,
        phone: res.data.phone || "",
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    Array.from(images).forEach((img) =>
      formData.append("images", img)
    );

    Array.from(videos).forEach((vid) =>
      formData.append("videos", vid)
    );

    await api.put(`/posts/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    router.push("/dashboard/my-posts");
  };

  return (
    <div className="p-6 max-w-xl mx-auto relative">

      {/* Back Arrow */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center gap-1 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-xl font-bold mb-4 mt-8">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="border p-2 w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Gaming</option>
          <option>Facebook Page</option>
          <option>Website</option>
          <option>YouTube Channel</option>
        </select>

        <div>
          <label className="block font-medium">Add Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
          />
        </div>

        <div>
          <label className="block font-medium">Add Videos</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => setVideos(e.target.files)}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Update Post
        </button>
      </form>
    </div>
  );
}
