import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "@/components/Layout";

export default function HomePage({ featuredProduct, newProducts }) {
  return (
    <Layout featuredProduct={featuredProduct} newProducts={newProducts}>
      <Header></Header>
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </Layout>
  );
}

export async function getServerSideProps() {
  const featuredProductId = "656ce8f4ee15e04272f25060";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const today = new Date();
  const newProducts = await Product.find(
    { expiryDate: { $gte: today } },
    null,
    {
      sort: { _id: -1 },
      limit: 10,
    }
  );
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
