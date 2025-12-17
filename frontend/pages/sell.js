import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import FloatingSellButton from '../components/FloatingSellButton';
import DashboardStats from '../components/DashboardStats';

export default function SellerDashboard() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) setUserLoggedIn(true);
    }

    setPosts([
      { id:1, title:"ফ্রি ফায়ার আইডি", category:"গেম আইডি", price:15, views:120, type:"account", pending:true },
      { id:2, title:"YouTube চ্যানেল", category:"ইউটিউব চ্যানেল", price:150, views:350, type:"channel", pending:false },
      { id:3, title:"ওয়েবসাইট", category:"ওয়েবসাইট", price:500, views:210, type:"website", pending:false }
    ]);
  }, []);

  if(!userLoggedIn) return <div className="p-8">Login করতে হবে।</div>

  const approvePost = (id) => {
    setPosts(posts.map(p => p.id === id ? {...p, pending:false} : p));
    alert("Post approved!");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold p-4">Seller Dashboard</h1>

      {/* Dashboard Stats */}
      <DashboardStats posts={posts} />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map(post => (
          <div key={post.id} className="relative">
            <ProductCard product={post} userLoggedIn={userLoggedIn} />
            {post.pending && (
              <button
                onClick={() => approvePost(post.id)}
                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
      <FloatingSellButton />
    </div>
  );
}
