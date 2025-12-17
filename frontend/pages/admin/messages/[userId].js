// frontend/pages/admin/messages/[userId].js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const { userId } = router.query;

  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [postData, setPostData] = useState(null);
  const [user, setUser] = useState(null);

  const bottomRef = useRef(null);

  /* ---------------- Load User Info ---------------- */
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/admin/message-user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [userId]);

  /* ---------------- Load Messages ---------------- */
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/admin/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [userId]);

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- Send Reply ---------------- */
  const sendReply = async () => {
    if (!reply.trim()) return;

    try {
      const res = await api.post(
        "/admin/messages/send",
        {
          userId,
          text: reply,
          sender: "admin",
          type: "text",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setReply("");
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex items-center gap-4">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>
        <h2 className="font-bold">
          {user ? user.name || "User" : "Chat"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${
              m.sender === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div>
              {m.type === "shared_post" ? (
                <div
                  onClick={() => router.push(`/admin/posts/${m.postId}`)}
                  className="bg-gray-200 p-3 rounded-xl cursor-pointer"
                >
                  <div className="font-semibold">{m.postTitle}</div>
                  <div className="text-xs">{m.postDescription}</div>
                  <div className="text-blue-600">{m.postPrice} BDT</div>
                </div>
              ) : (
                <div
                  className={`px-3 py-2 rounded-xl ${
                    m.sender === "admin"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow"
                  }`}
                >
                  {m.text}
                </div>
              )}
              <div className="text-[10px] text-gray-500 text-right">
                {formatTime(m.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t bg-white flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="flex-1 border rounded-xl p-2"
          placeholder="Reply..."
        />
        <button
          onClick={sendReply}
          className="bg-blue-600 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
