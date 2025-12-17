import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../utils/api";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Delete Function
  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`); // Backend delete route
      setPosts(posts.filter((p) => p._id !== id)); // UI থেকে remove
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete post!");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen relative">
      {/* Back to Home Button */}
      <div className="flex justify-end mb-4 md:absolute md:right-6 md:top-6">
        <Link
          href="/admin/pages"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800">
        All Posts
      </h1>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              <th className="text-left p-3 md:p-4 rounded-tl-xl">Title</th>
              <th className="text-left p-3 md:p-4">Description</th>
              <th className="text-left p-3 md:p-4">Date & Time</th>
              <th className="text-left p-3 md:p-4">Live Views</th>
              <th className="text-left p-3 md:p-4 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post._id}
                className="border-b last:border-b-0 hover:bg-gray-100 transition duration-200"
              >
                <td className="p-2 md:p-4 font-semibold text-gray-700">
                  <Link
                    href={`/admin/posts/${post._id}`}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {post.title}
                  </Link>
                </td>

                <td className="p-2 md:p-4 text-gray-600">
                  {post.description?.slice(0, 60)}...
                </td>

                <td className="p-2 md:p-4 text-gray-500 text-sm md:text-base">
                  {new Date(post.createdAt).toLocaleString()}
                </td>

                <td className="p-2 md:p-4 font-medium text-gray-700">
                  {post.views || 0}
                </td>

                {/* 🔥 Delete Button Column */}
                <td className="p-2 md:p-4">
                  <button
                    onClick={() => deletePost(post._id)}
                    className="bg-red-600 text-white px-2 md:px-3 py-1 rounded hover:bg-red-700 transition text-sm md:text-base"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
