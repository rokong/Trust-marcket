export default function DashboardStats({ posts }) {
  const totalPosts = posts.length;
  const pendingPosts = posts.filter(p => p.pending).length;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalAccounts = posts.filter(p => p.type === "account").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="bg-indigo-600 text-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Total Posts</h2>
        <p className="text-2xl">{totalPosts}</p>
      </div>
      <div className="bg-yellow-500 text-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Pending Posts</h2>
        <p className="text-2xl">{pendingPosts}</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Total Views</h2>
        <p className="text-2xl">{totalViews}</p>
      </div>
      <div className="bg-purple-600 text-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Accounts</h2>
        <p className="text-2xl">{totalAccounts}</p>
      </div>
    </div>
  );
}
