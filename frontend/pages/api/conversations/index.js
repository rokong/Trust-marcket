import dbConnect from "../../../utils/dbConnect";
import Conversation from "../../../models/Conversation";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const conversations = await Conversation.find().populate("buyerId", "name email");
    res.status(200).json(conversations);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
