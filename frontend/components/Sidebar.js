// components/Sidebar.js
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/categories">Categories</Link></li>
        <li><Link href="/messages">Messages</Link></li>
        <li><Link href="/account">Account</Link></li>
        <li><Link href="/create-post">Create Post</Link></li>
      </ul>
    </div>
  );
}