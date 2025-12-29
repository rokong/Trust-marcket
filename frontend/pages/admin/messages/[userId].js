// frontend/pages/admin/messages/[userId].js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { ArrowLeft, X } from "lucide-react";
import { io } from "socket.io-client";

const BACKEND_URL = "https://trust-market-backend-nsao.onrender.com";

export default function ChatPage() {
  const router = useRouter();
  const { userId } = router.query;

  const socket = useRef(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Initialize Socket
  useEffect(() => {
    if (!userId) return;
    socket.current = io(BACKEND_URL);
    socket.current.emit("join", userId);
  
    socket.current.on("receive_message", (msg) => {
      setMessages((p) => [...p, msg]);
    });
  
    return () => socket.current.disconnect();
  }, [userId]);

  // Load User Info
  useEffect(() => {
    if (!userId) return;
    api
      .get(`/admin/message-user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [userId]);

  // Load Messages
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

  // Send Text
  const sendText = async () => {
    if (!reply.trim()) return;
  
    const res = await api.post(
      "/admin/messages/send",
      { userId, text: reply, type: "text" },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  
    socket.current.emit("send_message", res.data);
    setReply("");
  }

  // Handle File Selection
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview({ url: URL.createObjectURL(f), type: f.type.startsWith("video") ? "video" : "image" });
  };

  const clearMedia = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = null;
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
      {/* HEADER */}
      <div className="bg-white shadow p-4 flex items-center gap-4">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>
        <h2 className="font-semibold">{user?.name || "User"}</h2>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-xs">
              {m.type === "image" && <img src={`${BACKEND_URL}${m.mediaUrl}`} className="rounded-xl shadow" />}
              {m.type === "video" && <video src={`${BACKEND_URL}${m.mediaUrl}`} controls className="rounded-xl shadow" />}
              {m.type === "text" && (
                <div className={`px-3 py-2 rounded-xl ${m.sender === "admin" ? "bg-blue-600 text-white" : "bg-white shadow"}`}>
                  {m.text}
                </div>
              )}
              <div className="text-[10px] text-gray-500 text-right mt-1">{formatTime(m.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* MEDIA PREVIEW */}
      {preview && (
        <div className="px-3 pb-2">
          <div className="relative w-40 rounded-xl overflow-hidden shadow bg-white">
            {preview.type === "image" ? <img src={preview.url} /> : <video src={preview.url} controls />}
            <button onClick={clearMedia} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="p-3 bg-white flex gap-2 items-center border-t">
        <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type message..." className="flex-1 border rounded-xl px-3 py-2" />
        <input type="file" hidden ref={fileRef} accept="image/*,video/*" onChange={handleFile} />
        <button onClick={() => fileRef.current.click()} className="px-3 py-2 rounded-xl bg-gray-200">📎</button>
        <button onClick={file ? sendMedia : sendText} className={`px-4 py-2 rounded-xl text-white ${file ? "bg-green-600" : "bg-blue-600"}`}>Send</button>
      </div>
    </div>
  );
}

