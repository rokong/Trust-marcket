// frontend/pages/dashboard/create-post.js
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function CreatePost(){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [price,setPrice]=useState('');
  const [deliverType,setDeliverType]=useState('manual');
  const [credentials,setCredentials]=useState('');
  const [images,setImages]=useState([]);
  const router = useRouter();

  const submit = async (e)=> {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('price', price);
      fd.append('deliverableType', deliverType);
      if(deliverType==='manual') fd.append('credentials', credentials);
      for(const f of images) fd.append('images', f);
      const res = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert('Post created & pending approval');
      router.push('/dashboard');
    } catch(err){
      alert(err.response?.data?.message || 'Error creating post');
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mt-6 max-w-xl">
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">Create Listing</h3>
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full border p-2 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea className="w-full border p-2 rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
            <input className="w-full border p-2 rounded" placeholder="Price (BDT)" value={price} onChange={e=>setPrice(e.target.value)} />
            <select className="w-full border p-2 rounded" value={deliverType} onChange={e=>setDeliverType(e.target.value)}>
              <option value="manual">Manual (Admin deliver)</option>
              <option value="file">File (Auto-download)</option>
              <option value="voucher">Voucher (codes)</option>
            </select>
            {deliverType==='manual' && <textarea className="w-full border p-2 rounded" placeholder='Credentials JSON like {"username":"u","password":"p"}' value={credentials} onChange={e=>setCredentials(e.target.value)} />}
            <input type="file" multiple onChange={e=>setImages(Array.from(e.target.files))} />
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
