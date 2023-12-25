import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { parse } from "url";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await mongooseConnect();
  const { query } = parse(req.url, true);
  console.log(query);
  console.log(query?.category);
  if (
    query?.priceRange &&
    query?.category &&
    query?.location &&
    query?.expiryDate
  ) {
    res.json(
      await Product.find(
        {
          price: { $lt: query?.priceRange },
          category: new mongoose.Types.ObjectId(query?.category),
        },
        null,
        {
          sort: { _id: -1 },
        }
      )
    );
  }
}
