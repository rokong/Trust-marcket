// frontend/pages/index.js
import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../utils/api";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import {
  Menu,
  MessageCircle,
  Home,
  Heart,
  ShoppingCart,
  PlusCircle,
  Search,
  User,
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

/* ================== MOTION ================== */
const ease = [0.22, 1, 0.36, 1];
const page = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } };
const fadeDown = { hidden: { opacity: 0, y: -24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

export default function HomePage({ posts }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showCategory, setShowCategory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const router = useRouter();
  const socket = useRef(null);
  const [liveViews, setLiveViews] = useState(0);

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (p) =>
        (category === "all" || p.category?.toLowerCase() === category) &&
        p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search, category]);

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

  useEffect(() => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
    socket.current = io("https://trust-market-backend-nsao.onrender.com", {
      transports: ["websocket"],
    });
  
    socket.current.on("connect", () => {
      // 🔥 COUNT HOME VIEW (guest + logged-in)
      socket.current.emit("home_view");
  
      // 🔐 Join personal room AFTER connect
      const id = localStorage.getItem("userId");
      if (id) {
        socket.current.emit("join", id);
      }
    });

    socket.current.on("live_views", (count) => {
      setLiveViews(count); // frontend update
    });
    
    const handleReceiveMessage = (msg) => {
      if (router.pathname !== "/messages") {
        addUnread(msg._id);
        window.dispatchEvent(new Event("unreadChange"));
  
        if ("Notification" in window && Notification.permission === "granted") {
          const n = new Notification("New Message from Admin", {
            body: msg.text || "You have a new message",
            icon: "/favicon.ico",
          });
  
          n.onclick = () => {
            window.focus();
            router.push("/messages");
          };
  
          new Audio("/notification.mp3").play();
        }
      }
    };
  
    socket.current.on("receive_message", handleReceiveMessage);
  
    return () => {
      socket.current.off("receive_message", handleReceiveMessage);
      socket.current.off("live_views");
      socket.current.disconnect();
    };
  }, []);

  // Handlers
  const handleBuy = (post) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to buy!");
      router.push("/login");
      return;
    }
    router.push(`/buy?post=${post._id}`);
  };

  const handleMessage = (post = null) => {
    const token = localStorage.getItem("token"); // ✅ fix: define token
    if (!token) {
      alert("Please login!");
      router.push("/login");
      return;
    }
  
    // Clear unread red dot
    clearAllUnread();
    window.dispatchEvent(new Event("unreadChange"));
  
    // Navigate
    router.push(post ? `/messages?post=${post._id}` : "/messages");
  };

  const handleCreatePost = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a post!");
      router.push("/login");
      return;
    }
    router.push("/create-post");
  };
  
  return (
    <motion.div variants={page} initial="hidden" animate="show" className="min-h-screen bg-zinc-950 text-white pb-24 overflow-x-hidden">
      {/* Navbar */}
      <motion.header variants={fadeDown} className="fixed top-0 w-full z-50 backdrop-blur-xl bg-zinc-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
          <div className="flex items-center gap-2 font-black text-xl">
            <Home className="text-blue-500" />
            <button onClick={() => router.push("/")} className="hover:underline">GoFytra🛒</button>
          </div>
      
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm relative">
            <button onClick={() => router.push('/').then(() => window.location.reload())}>Home</button>
            
            {/* Category Dropdown */}
            <div className="relative">
              <button onClick={() => setShowCategory(!showCategory)}>Categories</button>
              {showCategory && (
                <div className="absolute top-8 left-0 bg-white text-gray-800 border rounded-lg shadow-lg w-56 z-50">
                  {["All", "Gaming", "Facebook Page", "Website", "YouTube Channel"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat.toLowerCase());
                        setShowCategory(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
      
            <button onClick={() => handleMessage()} className="relative">
              Messages
              {hasUnread && <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <Link href="/dashboard">Profile</Link>
            <button onClick={handleCreatePost} className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-1">
              <PlusCircle className="w-5 h-5" /> Create Post
            </button>
          </nav>
      
          {/* Mobile Buttons */}
          <div className="md:hidden flex gap-2 items-center relative">
            <button onClick={handleMessage} className="relative p-2 rounded-full bg-blue-50 text-blue-600">
              <MessageCircle className="w-6 h-6" />
              {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
            </button>
      
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
      
            <button onClick={handleCreatePost} className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
              <PlusCircle className="w-5 h-5" /> Post
            </button>
      
            {/* Mobile Dropdown */}
            {showMobileMenu && (
              <div className="absolute top-14 right-0 bg-white text-gray-800 border rounded-lg shadow-lg w-52 z-50 flex flex-col">
                <button onClick={() => { router.push("/"); setShowMobileMenu(false); }} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <Home className="w-4 h-4" /> Home
                </button>
      
                <button onClick={() => { handleMessage(); setShowMobileMenu(false); }} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Messages
                </button>
      
                <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <User className="w-4 h-4" /> Account
                </Link>
      
                {/* Mobile Category Dropdown */}
                <div className="relative">
                  <button onClick={() => setShowCategory(!showCategory)} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <Menu className="w-4 h-4" /> Categories
                  </button>
                  {showCategory && (
                    <div className="absolute top-0 left-full ml-2 bg-white border rounded-lg shadow-lg w-52 z-50 flex flex-col">
                      {["All", "Gaming", "Facebook Page", "Website", "YouTube Channel"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setCategory(cat.toLowerCase()); setShowCategory(false); setShowMobileMenu(false); }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Search */}
      <motion.div variants={fadeUp} className="pt-28 px-6">
        <div className="max-w-3xl mx-auto flex items-center bg-zinc-900/80 border border-zinc-800 rounded-full px-6">
          <Search className="text-zinc-500 w-5 h-5" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent px-4 py-4 focus:outline-none" />
        </div>
      </motion.div>

      {/* Grid */}
      <motion.main variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="max-w-7xl mx-auto px-6 mt-16">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-zinc-500 py-32">No posts found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.div key={post._id} variants={card} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} className="group relative rounded-3xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
                {post.videos?.[0] ? (
                  <video controls className="w-full h-56 object-cover">
                    <source src={post.videos[0]} type="video/mp4" />
                  </video>
                ) : post.images?.[0] ? (
                  <Image src={post.images[0]} alt="Post" width={400} height={224} className="w-full h-56 object-cover" />
                ) : (
                  <div className="w-full h-56 bg-gray-700 flex items-center justify-center text-gray-300">No Media</div>
                )}

                <div className="p-5 flex flex-col gap-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">{post.description}</p>
                  <p className="text-blue-400 font-bold">৳ {post.price}</p>

                  <div className="flex justify-between items-center mt-4">
                    <Link href={`/post/${post._id}`} className="text-blue-400 flex items-center gap-1">
                      <Heart className="w-4 h-4" /> View
                    </Link>
                    <button onClick={() => handleMessage(post)} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition">
                      Message
                    </button>
                    <button onClick={() => handleBuy(post)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4" /> Buy
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>

      {/* Footer */}
      <footer className="mt-28 border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} Trust Market. All rights reserved.
      </footer>
    </motion.div>
  );
}
