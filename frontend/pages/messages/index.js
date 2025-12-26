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

    socket.current = io(https://trust-market-backend-nsao.onrender.com);
    socket.current.emit("join", id);

    socket.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  /* ---------------- Load Messages ---------------- */
  useEffect(() => {
    if (userId) loadMessages();
  }, [userId]);

  const loadMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await api.get(`/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Load Shared Post Preview ---------------- */
  useEffect(() => {
    if (!post) return;

    api
      .get(`/posts/${post}`)
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
    fileRef.current.value = null;
  };

  /* ---------------- Send Messages ---------------- */
  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      userId,
      sender: "user",
      type: "text",
      text,
      createdAt: new Date(),
    };

    socket.current.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const sendMedia = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("userId", userId);
    form.append("sender", "user");

    try {
      const res = await api.post("/upload/message-media", form);
      socket.current.emit("send_message", res.data);
      setMessages((prev) => [...prev, res.data]);
      removeMedia();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Send Shared Post ---------------- */
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
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4 text-2xl">←</button>
        <h2 className="text-lg font-semibold">Chat with Admin</h2>
      </div>

      {/* Messages */}
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
                <img src={m.mediaUrl} alt="media" className="max-w-xs rounded-xl" />
              ) : (
                <div className="bg-blue-500 text-white px-3 py-2 rounded-xl">{m.text}</div>
              )}

              <div className="text-[10px] text-gray-500 text-right">
                {formatTime(m.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Shared Post Preview */}
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

      {/* Input */}
      <div className="p-2 border-t bg-white flex gap-2">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        {previewUrl && (
          <div className="relative">
            <img src={previewUrl} alt="preview" className="h-16 w-16 rounded-lg" />
            <button
              onClick={removeMedia}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1"
            >
              x
            </button>
          </div>
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-xl p-2"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-xl">
          Send
        </button>
        <button
          onClick={() => fileRef.current.click()}
          className="bg-gray-300 px-3 rounded-xl"
        >
          +
        </button>
        {file && (
          <button
            onClick={sendMedia}
            className="bg-green-600 text-white px-4 rounded-xl"
          >
            Send Media
          </button>
        )}
      </div>
    </div>
  );
}
