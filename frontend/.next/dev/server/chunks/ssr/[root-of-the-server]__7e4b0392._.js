module.exports = [
"[project]/frontend/pages/create-post.js [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const handleCreatePost = async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first to create a post!");
        router.push("/login");
        return;
    }
    if (!title || !description || !price) {
        setError("Please fill all required fields.");
        return;
    }
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("status", "pending"); // pending post
        if (image) formData.append("image", image);
        if (video) formData.append("video", video);
        if (phone) formData.append("phone", phone);
        // 🔹 এই লাইনটা এখানে বসাতে হবে
        await api.post("/posts/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        });
        setSuccess("✅ Post created successfully! Waiting for admin approval.");
        setError("");
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("Gaming");
        setImage(null);
        setVideo(null);
        setPhone("");
    } catch (err) {
        console.error(err);
        setError("❌ Failed to create post. Try again.");
        setSuccess("");
    }
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7e4b0392._.js.map