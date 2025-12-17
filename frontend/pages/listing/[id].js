// frontend/pages/listing/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';

export default function ListingPage(){
  const r = useRouter();
  const { id } = r.query;
  const [post,setPost] = useState(null);
  const [openPay,setOpenPay] = useState(false);

  useEffect(()=>{ if(!id) return; api.get(`/posts/${id}`).then(r=>setPost(r.data)).catch(e=>console.error(e)); },[id]);

  const handlePay = async ({method,tx}) => {
    try {
      // create order then call payment endpoint (mock)
      const orderRes = await api.post('/orders', { postId: id, paymentMethod: method });
      const orderId = orderRes.data.order.id || orderRes.data.orderId || orderRes.data.orderId;
      await api.post(`/payment/pay`, { postId: id, paymentMethod: method, transactionId: tx });
      alert('Payment sent (mock). Wait for admin verification.');
      setOpenPay(false);
    } catch(err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  }

  if(!post) return (<><Navbar /><div className="container mt-6">Loading...</div></>);

  return (
    <>
      <Navbar />
      <div className="container mt-6">
        <div className="card">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.description}</p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-green-600">{post.price} BDT</div>
                <div className="mt-3">
                  <button onClick={()=>setOpenPay(true)} className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
            <div className="w-48 text-right">
              <div className="text-sm text-gray-500">Seller</div>
              <div className="font-semibold">{post.sellerId?.email || 'Seller'}</div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal open={openPay} onClose={()=>setOpenPay(false)} onPay={handlePay} price={post.price} />
    </>
  )
}
