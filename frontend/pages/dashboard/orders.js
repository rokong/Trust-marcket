// frontend/pages/dashboard/orders.js
import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Orders(){
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ api.get('/transactions').then(r=>setOrders(r.data)).catch(e=>console.error(e)); },[]);
  return (
    <>
      <Navbar />
      <div className="container mt-6">
        <h2 className="text-2xl mb-4">My Orders</h2>
        <div className="space-y-3">
          {orders.map(o=>(
            <div key={o._id} className="card flex justify-between items-center">
              <div>
                <div className="font-semibold">{o.postId?.title || o._id}</div>
                <div className="text-sm text-gray-500">Status: {o.status}</div>
              </div>
              <div>{o.price} BDT</div>
            </div>
          ))}
          {orders.length===0 && <div className="text-gray-500">কোনো order নেই</div>}
        </div>
      </div>
    </>
  )
}
