// frontend/pages/index.js
import { useEffect, useState, useRef, useMemo } from "react";
import api from "../utils/api";
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
  Zap,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Globe
} from "lucide-react";
import { getUnread, addUnread, clearAllUnread } from "../utils/unread";

export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://trust-market-backend-nsao.onrender.com/api/posts",
      { headers: { "Cache-Control": "no-cache" } }
    );
    const posts = await res.json();
    return { props: { posts } };
  } catch (e) {
    return { props: { posts: [] } };
  }
}

const categories = ["All", "Gaming", "Facebook Page", "Website", "YouTube Channel"];

export default function HomePage({ posts }) {
  const [category, setCategory] = useState("all");
  const [showCategory, setShowCategory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const [liveViews, setLiveViews] = useState(0);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const router = useRouter();
  const socket = useRef(null);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchCat = category === "all" || p.category?.toLowerCase() === category;
      const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [posts, category, search]);

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
    socket.current = io("https://trust-market-backend-nsao.onrender.com", { transports: ["websocket"] });
    socket.current.on("connect", () => {
      socket.current.emit("home_view");
      const id = localStorage.getItem("userId");
      if (id) socket.current.emit("join", id);
    });

    socket.current.on("live_views", setLiveViews);
    const handleMessage = (msg) => {
      if (router.pathname !== "/messages") {
        addUnread(msg._id);
        window.dispatchEvent(new Event("unreadChange"));
        if (Notification.permission === "granted") {
          const n = new Notification("New Message from Admin", { body: msg.text || "New message", icon: "/favicon.ico" });
          n.onclick = () => { window.focus(); router.push("/messages"); };
          new Audio("/notification.mp3").play();
        }
      }
    };
    socket.current.on("receive_message", handleMessage);

    return () => {
      socket.current.off("receive_message", handleMessage);
      socket.current.off("live_views");
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsFilterSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBuy = (post) => {
    if (!localStorage.getItem("token")) { alert("Login first!"); router.push("/login"); return; }
    router.push(`/buy?post=${post._id}`);
  };
  const handleMessage = (post = null) => {
    if (!localStorage.getItem("userId")) { alert("Login first!"); router.push("/login"); return; }
    clearAllUnread(); window.dispatchEvent(new Event("unreadChange"));
    router.push(post ? `/messages?post=${post._id}` : "/messages");
  };
  const handleCreatePost = () => {
    if (!localStorage.getItem("token")) { alert("Login first!"); router.push("/login"); return; }
    router.push("/create-post");
  };

  return (
    <div className="relative overflow-hidden bg-zinc-950 min-h-screen pb-24 text-white">
      {/* Background Blur Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="bg-zinc-900/80 backdrop-blur-md p-4 flex justify-between items-center fixed w-full z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <Home className="text-blue-500 w-6 h-6" />
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Lunex 🛒</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <button onClick={() => setShowCategory(!showCategory)} className="flex items-center gap-1 hover:text-blue-400 transition">
            <Menu className="w-4 h-4" /> Categories
          </button>
          <button onClick={() => handleMessage()} className="relative flex items-center gap-1 hover:text-blue-400 transition">
            <MessageCircle className="w-4 h-4" /> Messages
            {hasUnread && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-blue-400 transition">
            <User className="w-4 h-4" /> Account
          </Link>
          <button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Create Post
          </button>
        </nav>
      </header>

      {/* Sticky Filter */}
      <motion.div className={`transition-all duration-500 z-40 ${isFilterSticky ? 'fixed top-24 left-0 right-0 px-6' : 'relative mt-32 mb-16'}`}>
        <div className={`max-w-5xl mx-auto p-2 rounded-2xl border flex flex-col md:flex-row items-center gap-2 ${isFilterSticky ? 'bg-zinc-900/90 backdrop-blur-xl border-zinc-700/50 shadow-2xl' : 'bg-zinc-900/40 border-zinc-800/50'}`}>
          <div className="relative flex-grow w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Find your next venture..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent py-4 pl-16 pr-8 text-sm focus:outline-none placeholder:text-zinc-600 text-white font-medium"
            />
          </div>
          <div className="h-8 w-px bg-zinc-800 hidden md:block mx-2" />
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto p-1 scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat.toLowerCase())} 
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${category===cat.toLowerCase()?'bg-blue-600 text-white shadow-lg shadow-blue-600/20':'bg-zinc-800/30 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 px-6 max-w-7xl mx-auto">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-32">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50 text-xs font-bold uppercase tracking-widest text-blue-400 mb-8">
            <Sparkles className="w-4 h-4" /> The Intelligence Layer for Marketplace
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] max-w-4xl mx-auto">
            Acquire <span className="text-zinc-500">Premium</span> <br />
            Digital <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 bg-clip-text text-transparent">Real Estate</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The world's most secure marketplace for high-performance digital assets. Vetted by AI, secured by Lunex.
          </p>
        </motion.section>

        {/* Posts Grid */}
        <section className="min-h-[600px]">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, i) => (
                <motion.div key={post._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:i*0.05 }}>
                  <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col">
                    {post.images?.[0] && (
                      <div className="w-full h-56 relative">
                        <Image src={post.images[0]} alt="Post Image" fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                      <p className="text-zinc-400 line-clamp-3">{post.description}</p>
                      <p className="text-blue-500 font-bold text-lg">🤑 {post.price} BDT</p>
                      <div className="flex justify-between mt-auto items-center">
                        <Link href={`/post/${post._id}`} className="text-blue-400 hover:underline flex items-center gap-1">
                          <Heart className="w-4 h-4" /> View
                        </Link>
                        <button onClick={() => handleMessage(post)} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> Message
                        </button>
                        <button onClick={() => handleBuy(post)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4" /> Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
              <h3 className="text-3xl font-black mb-4">No results found</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">Try adjusting your filters or expanding your search.</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="pt-32 pb-16 border-t border-zinc-900/50 px-6">
          <div className="max-w-7xl mx-auto text-center text-zinc-500">
            © {new Date().getFullYear()} Lunex Technologies. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
