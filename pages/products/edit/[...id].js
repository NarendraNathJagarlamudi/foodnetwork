import Layout_admin from "@/components/Layout_admin";
import ProductForm from "@/components/ProductForm_admin";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default function EditProductPage({ store }) {
  const [productInfo, setProductInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get("/api/products?id=" + id)
        .then((response) => {
          setProductInfo(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout_admin>
      <h1>
        <b>Edit Product</b>
      </h1>
      {productInfo ? (
        <ProductForm {...productInfo} store={store} />
      ) : (
        <p>No product found.</p>
      )}
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
