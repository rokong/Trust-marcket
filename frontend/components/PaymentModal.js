// frontend/components/PaymentModal.js
import { useState } from 'react';

export default function PaymentModal({open, onClose, onPay, price}){
  const [method, setMethod] = useState('bkash');
  const [tx, setTx] = useState('');
  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3">Pay {price} BDT</h3>
        <div className="space-y-3">
          <label className="block text-sm">Payment Method</label>
          <select value={method} onChange={e=>setMethod(e.target.value)} className="w-full border p-2 rounded">
            <option value="bkash">bKash</option>
            <option value="rocket">Rocket</option>
            <option value="nagad">Nagad</option>
            <option value="manual">Manual (Offline)</option>
          </select>
          <label className="block text-sm">Transaction ID (or note)</label>
          <input value={tx} onChange={e=>setTx(e.target.value)} className="w-full border p-2 rounded" placeholder="TXID or note"/>
        </div>
        <div className="mt-4 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={()=>onPay({method,tx})} className="btn btn-primary">Pay Now</button>
        </div>
      </div>
    </div>
  );
}
