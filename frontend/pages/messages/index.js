// frontend/pages/messages/index.js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import { io } from "socket.io-client";

const BACKEND_URL = "https://trust-market-backend-nsao.onrender.com";

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

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/login");
      return;
    }
    setUserId(id);

    socket.current = io(BACKEND_URL);
    socket.current.emit("join", id);

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.current.disconnect();
  }, []);

  /* ---------------- LOAD MESSAGES ---------------- */
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const res = await api.get(`/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data);
    };
    load();
  }, [userId]);

  /* ---------------- SHARED POST ---------------- */
  useEffect(() => {
    if (!post) return;
    api.get(`/posts/${post}`).then((res) => setPostData(res.data));
  }, [post]);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- MEDIA ---------------- */
  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const removeMedia = () => {
    setFile(null);
    setPreviewUrl(null);
    fileRef.current.value = null;
  };

  /* ---------------- SEND ---------------- */
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.current.emit("send_message", {
      userId,
      sender: "user",
      type: "text",
      text,
      createdAt: new Date(),
    });

    setText("");
  };

  const sendMedia = async () => {
    const form = new FormData();
    form.append("file", file);
    form.append("userId", userId);
    form.append("sender", "user");

    const res = await api.post("/upload/message-media", form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    socket.current.emit("send_message", res.data);
    removeMedia();
  };

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ======================= UI ======================= */
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4 text-xl">←</button>
        <h2 className="font-semibold">Chat with Admin</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-xs space-y-1">
              {/* TEXT */}
              {m.type === "text" && (
                <div className="px-3 py-2 rounded-xl bg-white shadow">
                  {m.text}
                </div>
              )}

              {/* MEDIA */}
              {m.type === "media" && (
                <div className="rounded-xl overflow-hidden shadow bg-black">
                  {m.mediaType === "image" ? (
                    <img src={m.url} className="w-64" />
                  ) : (
                    <video src={m.url} controls className="w-64" />
                  )}
                </div>
              )}

              {/* SHARED POST */}
              {m.type === "shared_post" && (
                <div className="border rounded-xl p-3 bg-white shadow">
                  <div className="font-semibold text-sm">{m.postTitle}</div>
                  <div className="text-xs text-gray-600">{m.postDescription}</div>
                  <div className="font-bold text-green-600">
                    {m.postPrice} BDT
                  </div>
                </div>
              )}

              <div className="text-[10px] text-gray-400 text-right">
                {formatTime(m.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* MEDIA PREVIEW */}
      {previewUrl && (
        <div className="px-3 pb-2">
          <div className="relative w-40">
            {file.type.startsWith("image") ? (
              <img src={previewUrl} className="rounded-xl" />
            ) : (
              <video src={previewUrl} autoPlay loop muted className="rounded-xl" />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="p-2 bg-white border-t flex gap-2">
        <button
          onClick={() => fileRef.current.click()}
          className="w-10 h-10 bg-gray-200 rounded-full"
        >
          📎
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-xl px-3"
          placeholder="Message..."
        />

        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*,video/mp4"
          onChange={handleFileSelect}
        />

        <button
          onClick={file ? sendMedia : sendMessage}
          className="bg-blue-600 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
