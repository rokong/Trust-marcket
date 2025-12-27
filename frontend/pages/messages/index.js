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

  /* ---------------- User & Socket Init ---------------- */
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      alert("Please log in first!");
      router.push("/login");
      return;
    }
    setUserId(id);

    // FIX: URL must be string
    socket.current = io(BACKEND_URL);
    socket.current.emit("join", id);

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.current?.disconnect();
  }, []);

  /* ---------------- Load Messages ---------------- */
  useEffect(() => {
    if (userId) loadMessages();
  }, [userId]);

  const loadMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await api.get(`/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Load Shared Post ---------------- */
  useEffect(() => {
    if (!post) return;
    api.get(`/posts/${post}`)
      .then((res) => setPostData(res.data))
      .catch(() => setPostData(null));
  }, [post]);

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- File Handling ---------------- */
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

  /* ---------------- Send ---------------- */
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
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("userId", userId);
    form.append("sender", "user");

    const res = await api.post("/upload/message-media", form);
    socket.current.emit("send_message", res.data);
    
    removeMedia();
  };

  const sendSharedPost = async () => {
    if (!postData) return;
    try {
      const res = await api.post(
        "/messages/send",
        {
          userId,
          type: "shared_post",
          text: "",
          postId: postData._id,
          postTitle: postData.title,
          postDescription: postData.description,
          postPrice: postData.price,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      router.replace("/messages", undefined, { shallow: true });
      setPostData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4 text-2xl">←</button>
        <h2 className="font-semibold">Chat with Admi</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet</p>
        )}

        {messages.map((m) => (
          <div
            key={m._id || Math.random()}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div>
              {m.type === "shared_post" ? (
                <div
                  onClick={() => router.push(`/post/${m.postId}`)}
                  className="bg-gray-200 p-3 rounded-xl cursor-pointer"
                >
                  <div className="font-semibold">{m.postTitle}</div>
                  <div className="text-xs text-gray-600">{m.postDescription}</div>
                  <div className="text-blue-600">{m.postPrice} BDT</div>
                </div>
              ) : m.type === "media" ? (
                m.mediaUrl.endsWith(".mp4") ? (
                  <video
                    src={`${BACKEND_URL}${m.mediaUrl}`}
                    controls
                    className="max-w-xs rounded-xl"
                  />
                ) : (
                  <img
                    src={`${BACKEND_URL}${m.mediaUrl}`}
                    alt="media"
                    className="max-w-xs rounded-xl"
                  />
                )
              ) : (
                <div className="bg-blue-500 text-white px-3 py-2 rounded-xl">
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

      {/* SHARED POST PREVIEW */}
      {postData && (
        <div className="p-2 border-t bg-yellow-50">
          <div className="text-sm font-medium">{postData.title}</div>
          <button
            onClick={sendSharedPost}
            className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Send Post
          </button>
        </div>
      )}

      {/* MEDIA PREVIEW */}
      {previewUrl && (
        <div className="px-3 pb-2">
          <div className="relative w-40 rounded-xl overflow-hidden shadow-lg bg-black">
            {file?.type.startsWith("image") ? (
              <img src={previewUrl} className="w-full h-40 object-cover" />
            ) : (
              <video
                src={previewUrl}
                muted
                autoPlay
                loop
                className="w-full h-40 object-cover"
              />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* INPUT BAR (FIXED LAYOUT) */}
      <div className="p-2 border-t bg-white flex gap-2 items-center">
        {/* ATTACH */}
        <button
          onClick={() => fileRef.current?.click()}
          className="shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl"
        >
          📎
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-xl p-2"
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
          onClick={sendMessage}
          className="shrink-0 bg-blue-600 text-white px-4 h-10 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
