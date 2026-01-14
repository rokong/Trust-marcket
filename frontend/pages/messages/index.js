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
  const userId = typeof window !== "undefined" && localStorage.getItem("userId");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://trust-market-backend-nsao.onrender.com";

  // 🔴 CLEAR RED DOT WHEN OPEN PAGE
  useEffect(() => {
    localStorage.setItem("hasUnread", "0");
  }, []);
  
  /* ---------------- INIT SOCKET ---------------- */
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/login");
      return;
    }
  
    setUserId(id);
  
    const s = io(BACKEND_URL, { transports: ["websocket"] });
    socket.current = s;
  
    s.emit("join", id);
  
    s.on("receive_message", (msg) => {
      setMessages((prev) =>
        prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]
      );

      // 🔥 ONLY ADMIN → USER triggers red dot
      if (msg.sender === "admin" && window.location.pathname !== "/messages") {
        localStorage.setItem("hasUnread", "1");
      }
    });
  
    return () => {
      s.off("receive_message");
      s.disconnect();
    };
  }, []);


  /* ---------------- LOAD MESSAGES ---------------- */
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await api.get(`/messages/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userId]);

  /* ---------------- LOAD SHARED POST ---------------- */
  useEffect(() => {
    if (!post) return;
    api.get(`/posts/${post}`).then((res) => setPostData(res.data)).catch(() => setPostData(null));
  }, [post]);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- FILE ---------------- */
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

  /* ---------------- SEND ---------------- */
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
  
    const fd = new FormData();
    fd.append("file", file);
    fd.append("userId", userId);
    fd.append("sender", "user"); // admin হলে "admin"
  
    try {
      const res = await api.post("/upload/message-media", fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      // ✅ Add to messages immediately (optimistic)
      
  
      removeMedia();
    } catch (err) {
      console.error("Media upload failed", err);
    }
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
      setPostData(null);
      router.replace("/messages", undefined, { shallow: true });
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
        <button onClick={() => router.back()} className="mr-4 text-xl">←</button>
        <h2 className="font-semibold">Trust Market</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-xs space-y-1">
              {m.type === "text" && (
                <div className={`px-3 py-2 rounded-xl ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-white shadow"}`}>
                  {m.text}
                </div>
              )}
              {(m.type === "image" || m.type === "video") && (
                <div className="rounded-xl overflow-hidden shadow bg-black">
                  {m.type === "image" ? <img src={m.mediaUrl} className="w-64 rounded-xl" /> : <video src={m.mediaUrl} controls className="w-64 rounded-xl" />}
                </div>
              )}
              {m.type === "shared_post" && (
                <div className="border rounded-xl p-3 bg-white shadow">
                  <div className="font-semibold text-sm">{m.postTitle}</div>
                  {m.postDescription && <div className="text-xs text-gray-600 line-clamp-2">{m.postDescription}</div>}
                  {m.postPrice && <div className="font-bold text-green-600">{m.postPrice} BDT</div>}
                  <button onClick={() => router.push(`/post/${m.postId}`)} className="text-xs text-blue-600 underline">View Post</button>
                </div>
              )}
              <div className="text-[10px] text-gray-400 text-right">{formatTime(m.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* MEDIA PREVIEW */}
      {previewUrl && (
        <div className="px-3 pb-2">
          <div className="relative w-40">
            {file.type.startsWith("image") ? <img src={previewUrl} className="rounded-xl" /> : <video src={previewUrl} autoPlay loop muted className="rounded-xl" />}
            <button onClick={removeMedia} className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6">×</button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="p-2 bg-white border-t flex gap-2">
        <button onClick={() => fileRef.current.click()} className="w-10 h-10 bg-gray-200 rounded-full">📎</button>
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border rounded-xl px-3" placeholder="Message..." />
        <input type="file" hidden ref={fileRef} accept="image/*,video/*" onChange={handleFileSelect} />
        <button onClick={file ? sendMedia : sendMessage} className="bg-blue-600 text-white px-4 rounded-xl">Send</button>
      </div>

      {/* SHARED POST PREVIEW */}
      {postData && (
        <div className="p-2 border-t bg-yellow-50">
          <div className="text-sm font-medium">{postData.title}</div>
          <button onClick={sendSharedPost} className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg">Send Post</button>
        </div>
      )}
    </div>
  );
}
