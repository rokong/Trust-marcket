// frontend/pages/index.js
import { useEffect, useState } from "react";
import { useRef } from "react";
import api from "../utils/api";
import Link from "next/link";
import Image from "next/image";
import { getUnread } from "../utils/unread";
import { addUnread } from "../utils/unread";
import { clearAllUnread } from "../utils/unread";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { 
  Menu, 
  MessageCircle, 
  User, 
  Home, 
  PlusCircle, 
  ShoppingCart, 
  Heart 
} from "lucide-react";

// pages/index.js (TOP of file)
export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://trust-market-backend-nsao.onrender.com/api/posts",
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    const posts = await res.json();

    return {
      props: { posts },
    };
  } catch (e) {
    return {
      props: { posts: [] },
    };
  }
}

export default function HomePage({ posts }) {
  const [category, setCategory] = useState("all");
  const [showCategory, setShowCategory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const socket = useRef(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [liveViews, setLiveViews] = useState(0);


  useEffect(() => {
    const checkUnread = () => setHasUnread(getUnread().length > 0);

    checkUnread();
    window.addEventListener("unreadChange", checkUnread);

    // multi-tab handle
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
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login!");
      router.push("/login");
      return;
    }
    // ✅ সব unread মেসেজ clear করো
    clearAllUnread();
    window.dispatchEvent(new Event("unreadChange")); // red dot update
    
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
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <Home className="text-blue-600 w-6 h-6" />
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">
            Trust Market
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
          <Link href="/" className="hover:text-blue-600 transition flex items-center gap-1">
            Home
          </Link>

          <button 
            onClick={() => setShowCategory(!showCategory)} 
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            <Menu className="w-4 h-4" /> Categories
          </button>

          <button
            onClick={() => handleMessage()}
            className="relative hover:text-blue-600 transition flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" /> Messages
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          <Link href="/dashboard" className="hover:text-blue-600 transition flex items-center gap-1">
            <User className="w-4 h-4" /> Account
          </Link>

          <button 
            onClick={handleCreatePost} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition ml-4"
          >
            <PlusCircle className="w-5 h-5" /> Create Post
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => handleMessage()} className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 relative">
            <MessageCircle className="w-6 h-6" />
            {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>}
          </button>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <button onClick={handleCreatePost} className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
            <PlusCircle className="w-5 h-5" /> Post
          </button>
        </div>

        {/* Category Dropdown */}
        {showCategory && (
          <div className="absolute right-4 top-16 bg-white border rounded-lg shadow-lg w-56 z-10">
            {["All", "Gaming", "Facebook Page", "Website", "YouTube Channel"].map(cat => (
              <button 
                key={cat} 
                onClick={() => { setCategory(cat.toLowerCase()); setShowCategory(false); }} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-16 right-4 bg-white border rounded-lg shadow-lg w-52 z-20 flex flex-col">
            <Link href="/" className="px-4 py-2 hover:bg-gray-100">Home</Link>
            <button onClick={() => handleMessage()} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> Messages
            </button>
            <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-1">
              <User className="w-4 h-4" /> Account
            </Link>
            <button onClick={() => setShowCategory(!showCategory)} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-1">
              <Menu className="w-4 h-4" /> Categories
            </button>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b p-4 flex justify-center">
        <input
          type="text"
          placeholder="Search post by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b p-3 flex justify-center gap-4 flex-wrap">
        {["All", "Gaming", "Facebook Page", "Website", "YouTube Channel"].map(cat => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat.toLowerCase())} 
            className={`px-4 py-2 rounded-full border transition ${
              category === cat.toLowerCase() 
                ? "bg-blue-600 text-white border-blue-600" 
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <main className="max-w-7xl mx-auto p-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts
              .filter(p =>
                (category === "all" || p.category?.toLowerCase() === category) &&
                p.title?.toLowerCase().includes(search.toLowerCase())
              )
              .map(post => (
                <div key={post._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 flex flex-col">
                  {post.images?.[0] && (
                    <div className="w-full rounded-xl overflow-hidden bg-gray-200 mb-3">
                      <Image
                        src={post.images[0]}
                        alt="Post Image"
                        width={400}
                        height={300}
                        className="w-full max-h-72 object-cover rounded-xl"
                        loading="lazy"
                        quality={70}
                      />
                    </div>
                  )}
                  {post.videos?.[0] && (
                    <video controls className="w-full max-h-72 rounded-xl object-cover mb-3">
                      <source src={post.videos[0]} type="video/mp4" />
                    </video>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">{post.description}</p>
                  <p className="text-blue-600 font-bold text-lg mb-3">🤑 {post.price} BDT</p>

                  <div className="flex justify-between items-center mt-auto">
                    <Link href={`/post/${post._id}`} className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                      <Heart className="w-4 h-4" /> View
                    </Link>

                    <button onClick={() => handleMessage(post)} className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> Message
                    </button>

                    <button onClick={() => handleBuy(post)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4" /> Buy
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 border-t mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">Trust Market</span> — All rights reserved.
      </footer>
    </div>
  );
}
