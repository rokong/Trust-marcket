// frontend/pages/admin/messages/[userId].js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";

const BACKEND_URL = "https://trust-market-backend-nsao.onrender.com";

export default function ChatPage() {
  const router = useRouter();
  const { userId } = router.query;

  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  // Initialize socket once
  useEffect(() => {
    if (!userId) return;

    socket.current = io(https://trust-market-backend-nsao.onrender.com);
    socket.current.emit("join", userId);

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  // Load user info
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/admin/message-user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [userId]);

  // Load messages
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/admin/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [userId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text
  const sendReply = () => {
    if (!reply.trim()) return;

    const msg = {
      userId,
      sender: "admin",
      type: "text",
      text: reply,
    };

    socket.current.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setReply("");
  };

  // File handling
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreview({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image",
    });
  };

  const clearMedia = () => {
    setFile(null);
    setPreview(null);
    fileRef.current.value = null;
  };

  const sendMedia = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("userId", userId);
    fd.append("sender", "admin");

    try {
      const res = await api.post("/upload/message-media", fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      socket.current.emit("send_message", res.data);
      setMessages((prev) => [...prev, res.data]);
      clearMedia();
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
        <h2 className="font-bold">{user ? user.name || "User" : "Chat"}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m._id || Math.random()}
            className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
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
              ) : m.type === "image" ? (
                <img src={m.url} className="max-w-xs rounded-xl" />
              ) : m.type === "video" ? (
                <video src={m.url} controls className="max-w-xs rounded-xl" />
              ) : (
                <div
                  className={`px-3 py-2 rounded-xl ${
                    m.sender === "admin" ? "bg-blue-600 text-white" : "bg-white shadow"
                  }`}
                >
                  {m.text}
                </div>
              )}
              <div className="text-[10px] text-gray-500 text-right">{formatTime(m.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t bg-white flex flex-col gap-2">
        {preview && (
          <div className="flex items-center gap-2">
            {preview.type === "image" ? (
              <img src={preview.url} className="w-20 h-20 object-cover rounded" />
            ) : (
              <video src={preview.url} className="w-24 h-24 rounded" controls />
            )}
            <button onClick={clearMedia} className="text-red-500 font-bold">
              X
            </button>
            <button onClick={sendMedia} className="bg-blue-600 text-white px-3 rounded">
              Send
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current.click()}
            className="bg-gray-200 px-3 rounded"
          >
            +
          </button>
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 border rounded-xl p-2"
            placeholder="Reply..."
          />
          <button onClick={sendReply} className="bg-blue-600 text-white px-4 rounded-xl">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

