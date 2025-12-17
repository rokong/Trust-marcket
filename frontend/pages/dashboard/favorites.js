import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../utils/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/posts/favorites");
      setFavorites(res.data.favorites || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Favorite Posts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-500">No favorite posts found.</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((post) => (
            <div
              key={post._id}
              className="p-4 bg-white shadow rounded-xl border border-gray-200"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {post.description}
              </p>

              <Link
                href={`/post/${post._id}`}
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
