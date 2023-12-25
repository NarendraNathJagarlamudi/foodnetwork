import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  await mongooseConnect();

  try {
    const categories = await Category.find({}, { name: 1, _id: 1 });

    const categoriesWithIds = categories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    res.json(categoriesWithIds);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
