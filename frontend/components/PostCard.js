import Link from "next/link";

export default function PostCard({ post }) {
  // First image show on card (like Facebook)
  const firstImage = post.images?.length > 0 ? post.images[0] : null;

  return (
    <div className="card p-4 shadow rounded-lg mb-4">

      {/* Post Image Preview */}
      {firstImage ? (
        <img
          src={firstImage}
          alt="Post Image"
          className="w-full h-56 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-56 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="flex items-center space-x-4">

        {/* Left Side Title Avatar */}
        <div
          className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 
                     rounded-lg flex items-center justify-center 
                     text-indigo-700 font-bold text-xl"
        >
          {post.title?.slice(0, 2).toUpperCase()}
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{post.title}</h3>

          <p className="text-sm text-gray-500 mt-1">
            {post.description?.slice(0, 120)}
          </p>

          <div className="mt-3 flex items-center justify-between">
            {/* Price */}
            <div className="text-lg font-bold text-green-600">
              {post.price} BDT
            </div>

            <div className="flex items-center space-x-2">
              {/* Message Button */}
              <Link
                href={`/chat/${post.user}`}
                className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm shadow hover:bg-blue-600"
              >
                Message
              </Link>

              {/* View Button */}
              <Link
                href={`/post/${post._id}`}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm shadow hover:bg-indigo-700"
              >
                View
              </Link>

              {/* Buy Button */}
              <Link
                href={`/buy/${post._id}`}
                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm shadow hover:bg-green-700"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
