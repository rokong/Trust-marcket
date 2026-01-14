// frontend/pages/messages/index.js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import { io } from "socket.io-client";

export default function Messages() {
  const router = useRouter();
  const { post } = router.query;

  const socket = useRef(null);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const [postData, setPostData] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://localhost:5000";

  /* ---------------- INIT SOCKET ---------------- */
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) return router.push("/login");

    setUserId(id);
    if (socket.current) return;

    socket.current = io(BACKEND_URL, { transports: ["websocket"] });
    socket.current.emit("join", id);

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) =>
        prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem("unreadCount", "0");
  }, []);

  /* ---------------- LOAD MESSAGES ---------------- */
  useEffect(() => {
    if (!userId) return;
    api
      .get(`/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [userId]);

  /* ---------------- SHARED POST ---------------- */
  useEffect(() => {
    if (!post) return;
    api.get(`/posts/${post}`).then((res) => setPostData(res.data));
  }, [post]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const removeMedia = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = null;
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await api.post(
        "/messages/send",
        { text, type: "text" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, res.data]);
      socket.current.emit("send_message", res.data);
      setText("");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };


  const sendMedia = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("userId", userId);
    form.append("sender", "user");

    const res = await api.post("/upload/message-media", form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setMessages((prev) => [...prev, res.data]);
    removeMedia();
  };

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative h-screen flex flex-col text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 
        bg-gradient-to-br from-[#020617] via-[#020617] to-black" />

      {/* LOGO WATERMARK */}
      <div
        className="absolute inset-0 opacity-[0.06] bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/logo-watermark.png')" }}
      />

      {/* GLASS OVERLAY */}
      <div className="absolute inset-0 backdrop-blur-[6px] bg-black/40" />

      {/* HEADER */}
      <div className="relative z-10 
        flex items-center gap-3 px-4 py-3
        bg-white/5 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => router.back()} className="text-xl opacity-80 hover:opacity-100">
          ←
        </button>
        <h2 className="font-semibold tracking-wide">Trust Market Support</h2>
      </div>

      {/* MESSAGES */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m._id || Math.random()}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[80%] sm:max-w-[60%] space-y-1">
              {m.type === "text" && (
                <div
                  className={`px-4 py-2 rounded-2xl text-sm
                  ${m.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 backdrop-blur border border-white/10"
                    }`}
                >
                  {m.text}
                </div>
              )}

              {(m.type === "image" || m.type === "video") && (
                <div className="rounded-2xl overflow-hidden border border-white/10">
                  {m.type === "image" ? (
                    <img src={m.mediaUrl} className="w-64" />
                  ) : (
                    <video src={m.mediaUrl} controls className="w-64" />
                  )}
                </div>
              )}

              <div className="text-[10px] opacity-50 text-right">
                {formatTime(m.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* MEDIA PREVIEW */}
      {previewUrl && (
        <div className="relative z-10 px-4 pb-2">
          <div className="relative w-40">
            {file.type.startsWith("image") ? (
              <img src={previewUrl} className="rounded-xl" />
            ) : (
              <video src={previewUrl} autoPlay loop muted className="rounded-xl" />
            )}
            <button
              onClick={removeMedia}
              className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="relative z-10 p-3 
        bg-white/5 backdrop-blur-xl border-t border-white/10 flex gap-2">
        <button
          onClick={() => fileRef.current.click()}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
        >
          📎
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-transparent border border-white/10 rounded-xl px-3 focus:outline-none"
        />

        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />

        <button
          onClick={file ? sendMedia : sendMessage}
          className="px-4 rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

