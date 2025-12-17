// frontend/components/AdminTopbar.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdminTopbar({ title }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  useEffect(()=> {
    if (typeof window !== 'undefined') setToken(localStorage.getItem('token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm opacity-80">Admin panel</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1 rounded bg-yellow-300 text-black"
          onClick={() => router.push('/')}
        >
          Go Home
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
