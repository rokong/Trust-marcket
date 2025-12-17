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
"[project]/frontend/pages/admin/messages.js [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/frontend/pages/admin/messages.js', file not found");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bd6105d7._.js.map