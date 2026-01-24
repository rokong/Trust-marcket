// frontend/pages/index.js
import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import {
  Menu,
  MessageCircle,
  User,
  Home,
  PlusCircle,
  ShoppingCart,
  Heart,
  Search,
} from "lucide-react";

import { getUnread, addUnread, clearAllUnread } from "../utils/unread";

/* ================== SSR ================== */
export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://trust-market-backend-nsao.onrender.com/api/posts",
      { headers: { "Cache-Control": "no-cache" } }
    );
    const posts = await res.json();
    return { props: { posts } };
  } catch {
    return { props: { posts: [] } };
  }
}

const CATEGORIES = ["All", "Gaming", "Facebook Page", "Website", "YouTube Channel"];

/* ================== ANIMATION VARIANTS ================== */
const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const gridStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardAnim = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 },
};

/* ================== PAGE ================== */
export default function HomePage({ posts }) {
  const [category, setCategory] = useState("all");
  const [showCategory, setShowCategory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  const router = useRouter();
  const socket = useRef(null);

  /* ---------- FILTER ---------- */
  const filteredPosts = useMemo(() => {
    return posts.filter(
      (p) =>
        (category === "all" ||
          p.category?.toLowerCase() === category) &&
        p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, category, search]);

  /* ---------- UNREAD ---------- */
  useEffect(() => {
    const checkUnread = () => setHasUnread(getUnread().length > 0);
    checkUnread();
    window.addEventListener("unreadChange", checkUnread);
    window.addEventListener("storage", checkUnread);
    return () => {
      window.removeEventListener("unreadChange", checkUnread);
      window.removeEventListener("storage", checkUnread);
    };
  }, []);

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    socket.current = io("https://trust-market-backend-nsao.onrender.com", {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      socket.current.emit("home_view");
      const id = localStorage.getItem("userId");
      if (id) socket.current.emit("join", id);
    });

    const onMsg = (msg) => {
      if (router.pathname !== "/messages") {
        addUnread(msg._id);
        window.dispatchEvent(new Event("unreadChange"));
      }
    };

    socket.current.on("receive_message", onMsg);

    return () => {
      socket.current.off("receive_message", onMsg);
      socket.current.disconnect();
    };
  }, [router.pathname]);

  /* ---------- HANDLERS ---------- */
  const handleBuy = (post) => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      return router.push("/login");
    }
    router.push(`/buy?post=${post._id}`);
  };

  const handleMessage = (post = null) => {
    if (!localStorage.getItem("userId")) {
      alert("Please login first");
      return router.push("/login");
    }
    clearAllUnread();
    window.dispatchEvent(new Event("unreadChange"));
    router.push(post ? `/messages?post=${post._id}` : "/messages");
  };

  const handleCreatePost = () => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      return router.push("/login");
    }
    router.push("/create-post");
  };

  /* ================== UI ================== */
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 blur-[140px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <motion.header
        variants={fadeDown}
        initial="hidden"
        animate="show"
        className="fixed top-0 w-full z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl">
            <Home className="text-blue-500" />
            Trust Market
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/">Home</Link>
            <button onClick={() => setShowCategory(!showCategory)}>
              Categories
            </button>
            <button onClick={() => handleMessage()} className="relative">
              Messages
              {hasUnread && (
                <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
            <Link href="/dashboard">Account</Link>
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Create Post
            </button>
          </nav>

          <div className="md:hidden flex gap-3">
            <button onClick={() => handleMessage()} className="relative">
              <MessageCircle />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ================= SEARCH ================= */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="pt-28 px-6"
      >
        <div className="max-w-3xl mx-auto flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-5">
          <Search className="text-zinc-500 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search premium digital assets..."
            className="flex-1 bg-transparent px-4 py-4 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* ================= GRID ================= */}
      <motion.main
        variants={gridStagger}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-6 mt-16"
      >
        {filteredPosts.length === 0 ? (
          <p className="text-center text-zinc-500 py-32">
            No posts found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                variants={cardAnim}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden"
              >
                {post.images?.[0] && (
                  <div className="relative h-52">
                    <Image
                      src={post.images[0]}
                      alt="Post"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {post.description}
                  </p>
                  <p className="text-blue-500 font-bold">
                    🤑 {post.price} BDT
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <Link
                      href={`/post/${post._id}`}
                      className="text-blue-400 flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" /> View
                    </Link>

                    <button
                      onClick={() => handleMessage(post)}
                      className="bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg"
                    >
                      Message
                    </button>

                    <button
                      onClick={() => handleBuy(post)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-24 border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} Trust Market. All rights reserved.
      </footer>
    </div>
  );
}

