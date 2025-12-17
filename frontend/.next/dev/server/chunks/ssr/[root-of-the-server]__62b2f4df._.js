module.exports = [
"[externals]/socket.io-client [external] (socket.io-client, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("socket.io-client");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/frontend/pages/admin/messages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/admin/page/message.js - Frontend (Client Side)
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/socket.io-client [external] (socket.io-client, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const socket = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__["default"])('http://localhost:3001');
function AdminPanel() {
    const [activeChats, setActiveChats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedChat, setSelectedChat] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // ================================
    // 1️⃣ Load All Chats (Replace Fake)
    // ================================
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchChats = async ()=>{
            const res = await fetch("http://localhost:3000/chats/all");
            const data = await res.json();
            setActiveChats(data);
        };
        fetchChats();
        // Receive message
        socket.on('receive_message', (msg)=>{
            if (selectedChat && msg.chatId === selectedChat.chatId) {
                setMessages((prev)=>[
                        ...prev,
                        msg
                    ]);
            }
            setActiveChats((prev)=>prev.map((c)=>c.chatId === msg.chatId ? {
                        ...c,
                        lastMessage: msg.text,
                        adminHasUnread: true
                    } : c));
        });
        return ()=>socket.off('receive_message');
    }, [
        selectedChat
    ]);
    // ============================================
    // 2️⃣ Select Chat → Load messages from backend
    // ============================================
    const selectChat = async (chat)=>{
        setSelectedChat(chat);
        const res = await fetch(`http://localhost:3001/messages/${chat.chatId}`);
        const data = await res.json();
        setMessages(data.data);
        setActiveChats((prev)=>prev.map((c)=>c.chatId === chat.chatId ? {
                    ...c,
                    adminHasUnread: false
                } : c));
    };
    // ============================
    // 3️⃣ Send Message (IMPORTANT)
    // ============================
    const sendMessage = (e)=>{
        e.preventDefault();
        if (!selectedChat) {
            alert("Please select a chat");
            return;
        }
        if (!message.trim()) return;
        const msgData = {
            chatId: selectedChat.chatId,
            userId: selectedChat.userId,
            userName: selectedChat.userName,
            text: message,
            sender: "admin",
            timestamp: new Date().toISOString()
        };
        socket.emit("send_message", msgData);
        setMessages((prev)=>[
                ...prev,
                msgData
            ]);
        setMessage("");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    width: '30%',
                    borderRight: '1px solid #ccc',
                    padding: '10px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "All User Chats 💬"
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/admin/messages/index.js",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    activeChats.map((chat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            onClick: ()=>selectChat(chat),
                            style: {
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: selectedChat?.chatId === chat.chatId ? '#eee' : 'transparent',
                                fontWeight: chat.adminHasUnread ? 'bold' : 'normal'
                            },
                            children: [
                                chat.userName,
                                chat.adminHasUnread && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: 'red'
                                    },
                                    children: " (New!)"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/admin/messages/index.js",
                                    lineNumber: 108,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, chat.chatId, true, {
                            fileName: "[project]/frontend/pages/admin/messages/index.js",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/admin/messages/index.js",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    flexGrow: 1,
                    padding: '10px'
                },
                children: selectedChat ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            children: [
                                "Chat with ",
                                selectedChat.userName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/pages/admin/messages/index.js",
                            lineNumber: 117,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                height: '300px',
                                overflowY: 'scroll',
                                border: '1px solid #ccc',
                                padding: '10px'
                            },
                            children: messages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    style: {
                                        textAlign: msg.sender === 'admin' ? 'right' : 'left'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: [
                                                msg.sender === 'admin' ? 'You' : selectedChat.userName,
                                                ":"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/pages/admin/messages/index.js",
                                            lineNumber: 122,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        msg.text
                                    ]
                                }, i, true, {
                                    fileName: "[project]/frontend/pages/admin/messages/index.js",
                                    lineNumber: 121,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/frontend/pages/admin/messages/index.js",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                            onSubmit: sendMessage,
                            style: {
                                marginTop: '10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: message,
                                    onChange: (e)=>setMessage(e.target.value),
                                    placeholder: "Type your reply..."
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/admin/messages/index.js",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    children: "Reply"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/admin/messages/index.js",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/pages/admin/messages/index.js",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: "Select a user to start chatting."
                }, void 0, false, {
                    fileName: "[project]/frontend/pages/admin/messages/index.js",
                    lineNumber: 138,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/pages/admin/messages/index.js",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/pages/admin/messages/index.js",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = AdminPanel;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__62b2f4df._.js.map