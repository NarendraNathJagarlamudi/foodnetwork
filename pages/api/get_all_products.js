import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  await mongooseConnect();
  res.json(await Product.find({}, null, { sort: { _id: -1 } }));
}
