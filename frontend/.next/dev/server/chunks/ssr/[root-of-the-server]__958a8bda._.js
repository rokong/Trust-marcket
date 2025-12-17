module.exports = [
"[project]/frontend/pages/login.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/pages/login.js
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });
            const user = res.data.user;
            // token save
            localStorage.setItem("token", res.data.token);
            // user info save
            localStorage.setItem("userId", user._id);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("role", user.role);
            // role অনুযায়ী redirect
            if (user.role === "admin" && user.email === "mdnajmullhassan938@gmail.com") {
                router.push("/admin/pages"); // admin page
            } else {
                router.push("/"); // normal user page
            }
        } catch (err) {
            console.log(err);
            setError("Login failed. Invalid email or password.");
        }
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300",
        children: /*#__PURE__*/ _jsxDEV("div", {
            className: "bg-white shadow-xl rounded-2xl p-8 w-full max-w-md",
            children: [
                /*#__PURE__*/ _jsxDEV("h2", {
                    className: "text-3xl font-bold text-center text-gray-800 mb-6",
                    children: "Trust Market Login"
                }, void 0, false, {
                    fileName: "[project]/frontend/pages/login.js",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ _jsxDEV("p", {
                    className: "text-red-500 text-center mb-4 font-medium",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/frontend/pages/login.js",
                    lineNumber: 46,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ _jsxDEV("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-5",
                    children: [
                        /*#__PURE__*/ _jsxDEV("div", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("label", {
                                    className: "block text-sm font-semibold text-gray-700 mb-1",
                                    children: "Email Address"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/login.js",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("input", {
                                    type: "email",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
                                    required: true,
                                    className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400",
                                    placeholder: "Enter your email"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/login.js",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/pages/login.js",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV("div", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("label", {
                                    className: "block text-sm font-semibold text-gray-700 mb-1",
                                    children: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/login.js",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("input", {
                                    type: "password",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    required: true,
                                    className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400",
                                    placeholder: "Enter your password"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/pages/login.js",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/pages/login.js",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV("button", {
                            type: "submit",
                            className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all",
                            children: "Login"
                        }, void 0, false, {
                            fileName: "[project]/frontend/pages/login.js",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/pages/login.js",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "flex justify-between items-center mt-5 text-sm text-gray-600",
                    children: [
                        /*#__PURE__*/ _jsxDEV("button", {
                            type: "button",
                            onClick: ()=>router.push("/forgot-password"),
                            className: "hover:text-blue-600",
                            children: "Forgot Password?"
                        }, void 0, false, {
                            fileName: "[project]/frontend/pages/login.js",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV("button", {
                            type: "button",
                            onClick: ()=>router.push("/register"),
                            className: "hover:text-blue-600",
                            children: "Don’t have an account? Register"
                        }, void 0, false, {
                            fileName: "[project]/frontend/pages/login.js",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/pages/login.js",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/pages/login.js",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/pages/login.js",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__958a8bda._.js.map