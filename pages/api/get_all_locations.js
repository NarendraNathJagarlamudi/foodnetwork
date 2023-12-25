import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handler(req, res) {
  await mongooseConnect();
  const locations = await User.find({}, { location: 1, _id: 0 });
  res.json(locations.map((location) => location.location));
}
