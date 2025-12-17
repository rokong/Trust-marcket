//backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded); // 🔥 MUST SEE THIS
    req.user = {
      id: decoded._id || decoded.id, // 🔥 FIX
      email: decoded.email,   // 🔥 THIS IS THE KEY FIX
      role: decoded.role,
    };

    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
