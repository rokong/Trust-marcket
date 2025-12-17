import Conversation from "../../models/Conversation";
import dbConnect from "../../utils/db";

export default async function handler(req, res) {
  await dbConnect();

  const conv = await Conversation.find().sort({ updatedAt: -1 });

  res.json(conv);
}
