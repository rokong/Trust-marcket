// frontend/pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Menu,
  MessageCircle,
  User,
  Home,
  PlusCircle,
  ShoppingCart,
  Heart,
} from "lucide-react";

// 🚀 SERVER SIDE FETCH (FAST)
export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://trust-market-backend-nsao.onrender.com/api/posts",
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );

    const posts = await res.json();

    return { props: { posts } };
  } catch (err) {
    return { props: { posts: [] } };
  }
}

export default function HomePage({ posts }) {
  const [category, setCategory] = useState("all");
  const [showCategory, setShowCategory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const router = useRouter();

  // unread badge sync
  useEffect(() => {
    const sync = () => {
      setHasUnread(localStorage.getItem("hasUnread") === "1");
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const handleBuy = (post) => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      return router.push("/login");
    }
    router.push(`/buy?post=${post._id}`);
  };

  const handleMessage = (post = null) => {
    if (!localStorage.getItem("userId")) {
      alert("Please login");
      return router.push("/login");
    }
    localStorage.setItem("hasUnread", "0");
    router.push(post ? `/messages?post=${post._id}` : "/messages");
  };

  const handleCreatePost = () => {
    if (!localStorage.getItem("token")) {
      alert("Please login");
      return router.push("/login");
    }
    router.push("/create-post");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* NAVBAR */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Home className="text-blue-600" />
          <h1 className="text-xl font-bold text-blue-600">Trust Market</h1>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/">Home</Link>

          <button onClick={() => setShowCategory(!showCategory)}>
            Categories
          </button>

          <button onClick={() => handleMessage()} className="relative">
            Messages
            {hasUnread && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full" />
            )}
          </button>

          <Link href="/dashboard">Account</Link>

          <button
            onClick={handleCreatePost}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </nav>
      </header>

      {/* SEARCH */}
      <div className="bg-white p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full max-w-xl mx-auto block border rounded-full px-4 py-2"
        />
      </div>

      {/* POSTS */}
      <main className="max-w-7xl mx-auto p-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts
              .filter(
                (p) =>
                  (category === "all" ||
                    p.category?.toLowerCase() === category) &&
                  p.title?.toLowerCase().includes(search.toLowerCase())
              )
              .map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col"
                >
                  {post.images?.[0] && (
                    <Image
                      src={post.images[0]}
                      alt="Post image"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover"
                      loading="lazy"
                      quality={70}
                    />
                  )}

                  <h3 className="font-semibold mt-2">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-3">
                    {post.description}
                  </p>

                  <p className="text-blue-600 font-bold mt-2">
                    {post.price} BDT
                  </p>

                  <div className="flex justify-between mt-auto pt-3">
                    <Link href={`/post/${post._id}`}>View</Link>
                    <button onClick={() => handleMessage(post)}>
                      Message
                    </button>
                    <button
                      onClick={() => handleBuy(post)}
                      className="text-green-600"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <footer className="bg-white text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Trust Market
      </footer>
    </div>
  );
}
