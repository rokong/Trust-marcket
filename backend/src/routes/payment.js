import express from "express";

const router = express.Router();

// Example route
router.get("/test", (req, res) => {
  res.json({ message: "Payment route works" });
});

export default router;
