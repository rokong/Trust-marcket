import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) setUser(true); // লগইন চেক
    }
  }, []);

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl p-4 flex justify-between items-center text-white"
    >
      <Link href="/"><h1 className="text-2xl font-bold">TrustMarket</h1></Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:scale-105 transition">Home</Link>
        {user && <Link href="/messages" className="hover:scale-105 transition">Messages</Link>}
        {user && <Link href="/dashboard" className="hover:scale-105 transition">Dashboard</Link>}
      </div>
    </motion.nav>
  );
}
