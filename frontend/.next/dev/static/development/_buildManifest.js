self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/post/[id]": [
    "static/chunks/pages/post/[id].js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/admin/all-users",
    "/admin/dashboard",
    "/admin/messages",
    "/admin/messages/[userId]",
    "/admin/pages",
    "/admin/payments",
    "/admin/posts",
    "/admin/posts/[id]",
    "/admin/transactions",
    "/buy",
    "/create-post",
    "/dashboard",
    "/dashboard/account",
    "/dashboard/create-post",
    "/dashboard/edit-post/[id]",
    "/dashboard/favorites",
    "/dashboard/my-posts",
    "/dashboard/orders",
    "/forgot-password",
    "/listing/[id]",
    "/login",
    "/messages",
    "/payment",
    "/payment/bkash",
    "/post/[id]",
    "/register",
    "/reset-password",
    "/sell",
    "/verify-code"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()