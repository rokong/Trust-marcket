import Message from "../../models/Message";
import dbConnect from "../../utils/db";

export default async function handler(req, res) {
  await dbConnect();

  const { conversationId, sender, text } = req.body;

  const msg = await Message.create({
    conversationId,
    sender,
    text
  });

  res.json({ success: true, message: msg });
}
