module.exports = [
"[project]/frontend/utils/chatStorage.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utils/chatStorage.js
__turbopack_context__.s([
    "addMessage",
    ()=>addMessage,
    "loadChat",
    ()=>loadChat
]);
const loadChat = ()=>{
    const data = localStorage.getItem("chat_data");
    return data ? JSON.parse(data) : {
        messages: []
    };
};
const addMessage = (senderType, text, attachments = [], buyerId)=>{
    const data = loadChat();
    const newMsg = {
        id: Date.now() + "_" + Math.random(),
        from: senderType,
        text,
        attachments,
        buyerId,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    };
    data.messages.push(newMsg);
    localStorage.setItem("chat_data", JSON.stringify(data));
};
}),
"[project]/frontend/pages/messages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BuyerChatPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chatStorage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/chatStorage.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paperclip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Paperclip$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/paperclip.js [ssr] (ecmascript) <export default as Paperclip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/send.js [ssr] (ecmascript) <export default as Send>");
;
;
;
;
function BuyerChatPage({ buyerId }) {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chatStorage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["loadChat"])();
            setMessages(data.messages.filter((m)=>m.buyerId === buyerId));
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }, 500);
        return ()=>clearInterval(interval);
    }, [
        buyerId
    ]);
    const sendMessage = ()=>{
        if (!text && attachments.length === 0) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chatStorage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["addMessage"])("buyer", text, attachments, buyerId);
        setText("");
        setAttachments([]);
    };
    const handleFiles = (files)=>{
        const newAtts = Array.from(files).map((file)=>{
            const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
            const preview = type === "file" ? null : URL.createObjectURL(file);
            return {
                id: Date.now() + Math.random(),
                file,
                type,
                preview
            };
        });
        setAttachments((prev)=>[
                ...prev,
                ...newAtts
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 p-4 max-w-xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold mb-4",
                children: [
                    "Buyer Chat (",
                    buyerId,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/messages/index.js",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white p-3 rounded-md shadow-md flex flex-col gap-2 max-h-[60vh] overflow-auto",
                children: [
                    messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-center",
                        children: "No messages yet"
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 43,
                        columnNumber: 35
                    }, this),
                    messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: `p-2 rounded-md ${m.from === "buyer" ? "bg-blue-600 text-white self-end" : "bg-gray-200 self-start"}`,
                            children: [
                                m.text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: m.text
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/messages/index.js",
                                    lineNumber: 46,
                                    columnNumber: 24
                                }, this),
                                m.attachments?.map((a)=>a.type === "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: a.preview,
                                        className: "w-24 h-24 object-cover mt-1"
                                    }, a.id, false, {
                                        fileName: "[project]/frontend/pages/messages/index.js",
                                        lineNumber: 48,
                                        columnNumber: 32
                                    }, this) : a.type === "video" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("video", {
                                        src: a.preview,
                                        className: "w-24 h-24 mt-1",
                                        controls: true
                                    }, a.id, false, {
                                        fileName: "[project]/frontend/pages/messages/index.js",
                                        lineNumber: 49,
                                        columnNumber: 32
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-100 p-1 rounded mt-1",
                                        children: a.file.name
                                    }, a.id, false, {
                                        fileName: "[project]/frontend/pages/messages/index.js",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, m.id, true, {
                            fileName: "[project]/frontend/pages/messages/index.js",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/messages/index.js",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-2 flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>fileInputRef.current.click(),
                        className: "p-2 bg-gray-200 rounded-md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paperclip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Paperclip$3e$__["Paperclip"], {}, void 0, false, {
                            fileName: "[project]/frontend/pages/messages/index.js",
                            lineNumber: 58,
                            columnNumber: 99
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "file",
                        ref: fileInputRef,
                        className: "hidden",
                        multiple: true,
                        onChange: (e)=>handleFiles(e.target.files)
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                        value: text,
                        onChange: (e)=>setText(e.target.value),
                        className: "flex-1 border rounded-md p-2 resize-none",
                        placeholder: "Write a message..."
                    }, void 0, false, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: sendMessage,
                        className: "bg-green-600 text-white p-2 rounded-md flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {}, void 0, false, {
                                fileName: "[project]/frontend/pages/messages/index.js",
                                lineNumber: 61,
                                columnNumber: 114
                            }, this),
                            " Send"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/pages/messages/index.js",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/pages/messages/index.js",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/pages/messages/index.js",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__edb53022._.js.map