import Message from "../../models/Message";
import dbConnect from "../../utils/db";

export default async function handler(req, res) {
  await dbConnect();

  const { conversationId } = req.query;

  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

  res.json({ messages });
}
