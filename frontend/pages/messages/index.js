// frontend/pages/messages/index.js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import { io } from "socket.io-client";

const BACKEND_URL = "https://trust-market-backend-nsao.onrender.com";

export default function Messages() {
  const router = useRouter();
  const socket = useRef(null);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 🔥 Fullscreen modal
  const [viewer, setViewer] = useState(null);

  /* INIT */
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) return router.push("/login");
    setUserId(id);

    socket.current = io(BACKEND_URL);
    socket.current.emit("join", id);

    socket.current.on("receive_message", (msg) => {
      setMessages((p) => [...p, msg]);
    });

    return () => socket.current.disconnect();
  }, []);

  /* LOAD MESSAGES */
  useEffect(() => {
    if (!userId) return;
    api
      .get(`/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setMessages(res.data));
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* MEDIA */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.current.emit("send_message", {
      userId,
      sender: "user",
      type: "text",
      text,
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
    setFile(null);
    setPreviewUrl(null);
  };

  const time = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-screen flex flex-col bg-[#f4f6fb]">
      {/* HEADER */}
      <div className="h-14 bg-blue-600 text-white flex items-center px-4 font-semibold shadow">
        <button onClick={() => router.back()} className="mr-3 text-xl">←</button>
        Chat with Admin
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[75%]">
              {m.type === "image" && (
                <img
                  src={m.url}
                  onClick={() => setViewer(m.url)}
                  className="rounded-xl cursor-pointer shadow"
                />
              )}

              {m.type === "video" && (
                <video
                  src={m.url}
                  controls
                  className="rounded-xl shadow"
                />
              )}

              {m.type === "text" && (
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow
                  ${m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white rounded-bl-none"}`}
                >
                  {m.text}
                </div>
              )}

              <div className="text-[10px] text-gray-400 mt-1 text-right">
                {time(m.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* MEDIA PREVIEW */}
      {previewUrl && (
        <div className="p-2 border-t bg-white">
          <img src={previewUrl} className="w-32 rounded-xl shadow" />
        </div>
      )}

      {/* INPUT */}
      <div className="h-14 bg-white border-t flex items-center px-3 gap-2">
        <button
          onClick={() => fileRef.current.click()}
          className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
        >
          📎
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message…"
          className="flex-1 border rounded-full px-4 py-2"
        />

        <input
          hidden
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFile}
        />

        <button
          onClick={file ? sendMedia : sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>

      {/* 🔥 FULLSCREEN IMAGE MODAL */}
      {viewer && (
        <div
          onClick={() => setViewer(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <img src={viewer} className="max-h-[90%] max-w-[90%] rounded-xl" />
        </div>
      )}
    </div>
  );
}
