// frontend/pages/dashboard/inbox.js
import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import InboxView from '../../components/InboxView';

export default function InboxPage(){
  const [inbox, setInbox] = useState([]);
  useEffect(()=>{ api.get('/inbox').then(r=>setInbox(r.data.messages || r.data)).catch(e=>console.error(e)); },[]);
  return (
    <>
      <Navbar />
      <div className="container mt-6">
        <h2 className="text-2xl mb-4">Inbox</h2>
        <InboxView messages={inbox.messages || inbox} />
      </div>
    </>
  )
}
