Trust Market — Thunder Client / Postman collection

This repository includes a Postman-format collection you can import into Thunder Client (VS Code extension) or Postman.

Files
- thunder/trust-market.postman_collection.json — Postman v2.1 collection with requests for auth, posts, and admin.

Quick import (Thunder Client)
1. Install the Thunder Client VS Code extension.
2. Open Thunder Client > Collections > Import > Choose File and select `thunder/trust-market.postman_collection.json`.
3. Set collection variables:
   - `baseUrl`: default `http://localhost:5000`. Change to the port your backend uses (see `.env` or `process.env.PORT`).
   - `token`: will be set after successful login.
   - `postId`: used for the Approve Post request; set it after creating a post or from the pending posts response.

How to use
1. Start your backend server (set PORT and MONGO_URI in your `.env`).
2. Register a user (POST /api/auth/register) or use an existing account.
3. Login (POST /api/auth/login). Copy the returned `token` value and paste into the collection variable `token` (or set an Authorization header: `Bearer <token>`).
4. Create a post (POST /api/posts) — use form-data body. Add a file for the `images` key. The request requires the `Authorization: Bearer {{token}}` header.
5. Admin flows:
   - Get pending posts: GET /api/admin/pending-posts
   - Approve a post: PUT /api/admin/approve/{{postId}} — set `postId` from the pending posts response.

Notes
- The collection uses `{{baseUrl}}` — update it to match your local server port.
- File uploads in Thunder Client: when editing the request body choose `form-data`, add key `images` and choose the file type to select a file from disk.
- The server code currently does not enforce role-based access control on admin endpoints; ensure you test accordingly.

If you'd like, I can also add a small script to automatically set the `postId` from the pending-posts response, or create example cURL commands for each request.