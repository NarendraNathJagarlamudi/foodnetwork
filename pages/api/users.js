import mongoose from "mongoose";
import { User } from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const { email, shop_name, location, governmentID, description } = req.body;
    const userDoc = await User.create({
      email,
      shop_name,
      location,
      governmentID,
      description,
    });
    res.json(userDoc);
  }
}
