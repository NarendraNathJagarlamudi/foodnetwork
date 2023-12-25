import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import Layout from "@/components/Layout";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;

const ProductDetails = styled.div`
  flex-grow: 1;
`;

const StoreDetails = styled.div`
  background-color: #bebebe;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StoreTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const PriceRow = styled.div`
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage({ product, store }) {
  const { addProduct } = useContext(CartContext);
  const parsedDate = new Date(product.expiryDate);
  const formattedDate = parsedDate
    .toISOString()
    .substring(0, 10)
    .split("-")
    .reverse()
    .join("-");

  return (
    <Layout>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <ProductDetails>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>₹{product.price}</Price>
              </div>
              <p>
                <b>Expiry Date: {formattedDate}</b>
              </p>
              <StoreDetails>
                <StoreTitle>Store Details</StoreTitle>
                <p>
                  <b>Name:</b> {store.shop_name}
                </p>
                <p>
                  <b>Location:</b> {store.location}
                </p>
                <p>
                  <b>Description:</b> {store.description}
                </p>
              </StoreDetails>
              <div>
                <Button primary onClick={() => addProduct(product._id)}>
                  <CartIcon />
                  Add to cart
                </Button>
              </div>
            </PriceRow>
          </ProductDetails>
        </ColWrapper>
      </Center>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  const user = await User.findOne({ email: product.user });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      store: JSON.parse(JSON.stringify(user)),
    },
  };
}
