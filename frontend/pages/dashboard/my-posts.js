// pages/dashboard/my-posts.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../../utils/api";

export default function MyPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/posts/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(res.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;

    const token = localStorage.getItem("token");
    await api.delete(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadPosts();
  };

  if (posts.length === 0)
    return <p className="p-6">You have no posts yet.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* 🔙 Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center mb-4 text-gray-700 hover:text-gray-900 font-semibold"
      >
        <span className="mr-2 text-2xl">&#8592;</span> Back
      </button>

      <h1 className="text-2xl font-bold mb-6">My Posts</h1>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <p className="font-bold text-blue-600">BDT {post.price}</p>

            <div className="flex gap-4 mt-3">
              <Link
                href={`/post/${post._id}`}
                className="text-blue-600 underline"
              >
                View
              </Link>

              <Link
                href={`/dashboard/edit-post/${post._id}`}
                className="text-green-600 underline"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
