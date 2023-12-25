import Layout_admin from "@/components/Layout_admin";
import ProductForm from "@/components/ProductForm_admin";
import { User } from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default function NewProduct({ store }) {
  return (
    <Layout_admin>
      <h1>
        <b>New Product</b>
      </h1>
      <ProductForm store={store} />
    </Layout_admin>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const session = await getSession(context);
  const user = await User.findOne({ email: session?.user?.email });
  return {
    props: {
      store: JSON.parse(JSON.stringify(user)),
    },
  };
}
