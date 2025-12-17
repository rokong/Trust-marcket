// frontend/pages/admin/transactions.js
import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import api from '../../utils/api';

export default function AdminTransactions() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTx = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions');
      setTxs(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch transactions');
    } finally { setLoading(false); }
  };

  useEffect(()=> { fetchTx(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Transactions" />
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
            {loading && <div>Loading...</div>}
            {!loading && txs.length === 0 && <div>No transactions yet.</div>}
            <div className="space-y-3">
              {txs.map(tx => (
                <div key={tx._id || tx.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{tx.postId?.title || tx.post?.title || '—'}</div>
                    <div className="text-sm text-gray-600">Buyer: {tx.buyerId?.name || tx.buyerId?.email}</div>
                    <div className="text-sm text-gray-600">Seller: {tx.sellerId?.name || tx.sellerId?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{tx.price || tx.amount} BDT</div>
                    <div className="text-xs text-gray-500">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
