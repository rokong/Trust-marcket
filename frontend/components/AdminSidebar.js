// frontend/components/AdminSidebar.js
import { useRouter } from 'next/router';

export default function AdminSidebar() {
  const router = useRouter();
  const nav = (path) => router.push(path);

  return (
    <div className="w-64 bg-white shadow rounded p-4 h-full">
      <div className="mb-6">
        <div className="text-lg font-bold text-blue-700">Admin</div>
        <div className="text-sm text-gray-500">Trust Market</div>
      </div>

      <div className="flex flex-col gap-2">

        {/* Overview */}
        <button
          className="text-left px-3 py-2 rounded hover:bg-gray-100"
          onClick={() => nav('/admin')}
        >
          Overview
        </button>

        {/* Pending removed */}

        {/* Transactions */}
        <button
          className="text-left px-3 py-2 rounded hover:bg-gray-100"
          onClick={() => nav('/admin/transactions')}
        >
          Transactions
        </button>

        {/* Seller View */}
        <button
          className="text-left px-3 py-2 rounded hover:bg-gray-100"
          onClick={() => nav('/dashboard')}
        >
          Seller View
        </button>
      </div>
    </div>
  );
}
