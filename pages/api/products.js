import mongoose from "mongoose";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  await mongooseConnect();
  if (method === "POST") {
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      user,
      expiryDate,
      location,
    } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      user,
      expiryDate,
      location,
    });
    res.json(productDoc);
  }
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      const userProducts = await Product.find({
        // user: session?.user?.email,
      });
      res.json(userProducts);
    }
  }

  if (method === "PUT") {
    const {
      title,
      description,
      price,
      _id,
      images,
      category,
      properties,
      expiryDate,
      location,
    } = req.body;
    await Product.updateOne(
      { _id },
      {
        title: title,
        description: description,
        price: price,
        images: images,
        category: category,
        properties: properties,
        expiryDate: expiryDate,
        location: location,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
