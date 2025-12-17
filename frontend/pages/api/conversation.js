
import dbConnect from "../../../utils/dbConnect";
import Conversation from "../../../models/Conversation";

export default async function handler(req, res) {
  const { buyerId } = req.query;
  await dbConnect();

  if (req.method === "GET") {
    const conversation = await Conversation.findOne({ buyerId });
    if (!conversation) return res.status(404).json({ message: "No conversation found" });
    res.status(200).json(conversation);
  } else if (req.method === "POST") {
    const { sender, content } = req.body;
    if (!sender || !content) return res.status(400).json({ message: "Missing fields" });

    let conversation = await Conversation.findOne({ buyerId });
    if (!conversation) conversation = new Conversation({ buyerId, messages: [] });

    conversation.messages.push({ sender, content });
    await conversation.save();

    res.status(200).json(conversation);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
