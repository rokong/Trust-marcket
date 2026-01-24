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
  Home,
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
    if (!res.ok) throw new Error("API failed");
    const posts = await res.json();
    return { props: { posts } };
  } catch {
    return { props: { posts: [] } };
  }
}

/* ================== MOTION SYSTEM ================== */
const ease = [0.22, 1, 0.36, 1];

const page = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/* ================== PAGE ================== */
export default function HomePage({ posts }) {
  const [search, setSearch] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  const router = useRouter();
  const socket = useRef(null);

  /* ---------- FILTER ---------- */
  const filteredPosts = useMemo(() => {
    return posts.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

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

  /* ---------- ACTIONS ---------- */
  const requireAuth = () => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      router.push("/login");
      return false;
    }
    return true;
  };

  /* ================== UI ================== */
  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-zinc-950 text-white pb-24 overflow-x-hidden"
    >
      {/* GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-blue-600/10 blur-[160px]" />
        <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-purple-600/10 blur-[160px]" />
      </div>

      {/* NAVBAR */}
      <motion.header
        variants={fadeDown}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-zinc-950/70 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl">
            <Home className="text-blue-500" />
            Trust Market
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/">Home</Link>
            <button
              onClick={() => {
                clearAllUnread();
                router.push("/messages");
              }}
              className="relative"
            >
              Messages
              {hasUnread && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <Link href="/dashboard">Account</Link>
            <button
              onClick={() => requireAuth() && router.push("/create-post")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
            >
              Create Post
            </button>
          </nav>

          <div className="md:hidden">
            <MessageCircle />
          </div>
        </div>
      </motion.header>

      {/* SEARCH */}
      <motion.div variants={fadeUp} className="pt-32 px-6">
        <div className="max-w-3xl mx-auto flex items-center bg-zinc-900/80 border border-zinc-800 rounded-full px-6">
          <Search className="text-zinc-500 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search premium digital assets…"
            className="flex-1 bg-transparent px-4 py-4 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* GRID */}
      <motion.main
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 mt-20"
      >
        {filteredPosts.length === 0 ? (
          <p className="text-center text-zinc-500 py-32">No posts found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                variants={card}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group relative rounded-3xl bg-zinc-900/70 border border-zinc-800 overflow-hidden"
              >
                {post.images?.[0] && (
                  <div className="relative h-56 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={post.images[0]}
                        alt="Post"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="p-5 flex flex-col gap-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {post.description}
                  </p>
                  <p className="text-blue-400 font-bold">
                    ৳ {post.price}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/post/${post._id}`}
                      className="text-blue-400 flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" /> View
                    </Link>

                    <button
                      onClick={() =>
                        requireAuth() &&
                        router.push(`/messages?post=${post._id}`)
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>

      {/* FOOTER */}
      <footer className="mt-28 border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} Trust Market. All rights reserved.
      </footer>
    </motion.div>
  );
}

