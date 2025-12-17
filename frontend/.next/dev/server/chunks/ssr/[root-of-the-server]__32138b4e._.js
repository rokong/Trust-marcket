module.exports = [
"[externals]/axios [external] (axios, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/frontend/utils/api.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const api = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].create({
    baseURL: "http://localhost:5000/api"
});
// Automatically send token in every request
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const __TURBOPACK__default__export__ = api;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/frontend/utils/socket.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utils/socket.js
import { io } from "socket.io-client";
let socket;
if (!socket) {
    socket = io("http://localhost:5000", {
        autoConnect: true,
        reconnection: true
    });
}
export default socket;
}),
"[project]/frontend/pages/messages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// frontend/pages/messages/index.js
__turbopack_context__.s([
    "default",
    ()=>Messages
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/api.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$socket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/socket.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function Messages() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { post } = router.query;
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // -------------------- LOCAL STORAGE POST SHARE --------------------
    const getSharedPosts = ()=>{
        if ("TURBOPACK compile-time truthy", 1) return [];
        //TURBOPACK unreachable
        ;
        const saved = undefined;
    };
    const addSharedPost = (postId)=>{
        const shared = getSharedPosts();
        if (!shared.includes(postId)) {
            shared.push(postId);
            localStorage.setItem("sharedPosts", JSON.stringify(shared));
        }
    };
    const isAlreadyShared = (postId)=>getSharedPosts().includes(postId);
    // -------------------- LOAD USER --------------------
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const id = localStorage.getItem("userId");
        if (!id) {
            router.push("/login");
            return;
        }
        setUserId(id);
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$socket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].emit("join_room", id);
    }, []);
    // -------------------- AUTO SCROLL --------------------
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [
        messages
    ]);
    // -------------------- LOAD MESSAGES --------------------
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (userId) loadMessages();
    }, [
        userId
    ]);
    const loadMessages = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/messages/${userId}`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    // -------------------- LISTEN TO REAL-TIME MESSAGES --------------------
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$socket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].on("new_message", (msg)=>{
            setMessages((prev)=>[
                    ...prev,
                    msg
                ]);
        });
        return ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$socket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].off("new_message");
    }, []);
    // -------------------- SHARE POST ONCE --------------------
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!userId || !post) return;
        if (isAlreadyShared(post)) return;
        const sharePost = async ()=>{
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/posts/${post}`);
                const msgData = {
                    userId,
                    text: `Shared a post: ${res.data.title} (${res.data.price} BDT)`,
                    type: "shared_post",
                    postId: res.data._id,
                    sender: "user"
                };
                const sent = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post("/messages/send", msgData);
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$socket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].emit("send_message", sent.data);
                setMessages((prev)=>[
                        ...prev,
                        sent.data
                    ]);
                addSharedPost(post);
            } catch (err) {
                console.log("Share failed:", err);
            }
        };
        sharePost();
    }, [
        userId,
        post
    ]);
    // -------------------- SEND TEXT MESSAGE --------------------
    const sendMessage = async ()=>{
        if (!text.trim()) return;
        const msgData = {
            userId,
            text,
            type: "text",
            sender: "user"
        };
        const sent = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post("/messages/send", msgData);
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$socket$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].emit("send_message", sent.data);
        setMessages((prev)=>[
                ...prev,
                sent.data
            ]);
        setText("");
    };
    // -------------------- UI --------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "h-screen flex flex-col bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-blue-600 text-white p-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold",
                        children: "Chat with Admin"
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        href: "/",
                        className: "bg-white text-blue-700 px-3 py-1 rounded-lg shadow",
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/messages/index.js",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 space-y-3",
                children: [
                    messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: m.sender === "user" ? "text-right" : "text-left",
                            children: m.type === "shared_post" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.push(`/posts/${m.postId}`),
                                className: "inline-block bg-gray-200 px-3 py-2 rounded-lg cursor-pointer",
                                children: m.text
                            }, void 0, false, {
                                fileName: "[project]/frontend/pages/messages/index.js",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `inline-block px-4 py-2 rounded-xl shadow ${m.sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-900"}`,
                                children: m.text
                            }, void 0, false, {
                                fileName: "[project]/frontend/pages/messages/index.js",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this)
                        }, m._id, false, {
                            fileName: "[project]/frontend/pages/messages/index.js",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        ref: bottomRef
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/messages/index.js",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-3 border-t bg-white flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        className: "flex-1 border p-3 rounded-xl bg-gray-100",
                        placeholder: "Type...",
                        value: text,
                        onChange: (e)=>setText(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: sendMessage,
                        className: "bg-blue-600 text-white px-5 py-3 rounded-xl shadow",
                        children: "Send"
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/messages/index.js",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/pages/messages/index.js",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__32138b4e._.js.map