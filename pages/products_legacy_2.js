import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import mongoose from "mongoose";

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  flex: 1;
  padding: 10px;
  margin-top: 9px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const FilterIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  color: #ff0000; /* Red color */
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
`;

const DropdownContainer = styled.div`
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  align-items: center;
  margin-bottom: 10px;
`;

const Dropdown = styled.select`
  margin-right: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  width: 200px;
`;

const SearchButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  margin-left: 9px;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function ProductsPage({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [productslist, setProductsList] = useState(products);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [catobj, setCatObj] = useState("");

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    axios.get("/api/get_all_locations").then((response) => {
      setLocations(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/get_all_categories").then((response) => {
      setCatObj(response.data);
    });
  }, []);

  useEffect(() => {
    setCategories(Object.keys(catobj));
  });

  const handleSearch = async () => {
    let filteredProducts = products;

    if (priceRange) {
      // Apply price range filter only if it's set
      filteredProducts = filteredProducts.filter(
        (product) => product.price < parseInt(priceRange)
      );
    }

    if (searchTerm) {
      // Apply search term filter only if it's set
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      // Apply category filter only if it's set
      // const categoryId = new mongoose.Types.ObjectId(category);
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (location) {
      // Apply category filter only if it's set
      // const categoryId = new mongoose.Types.ObjectId(category);
      filteredProducts = filteredProducts.filter((product) =>
        product.location.includes(location)
      );
    }

    if (expiryDate) {
      const thresholdDays = parseInt(expiryDate);

      filteredProducts = filteredProducts
        .map((product) => {
          try {
            // Parse date strings into Date objects
            const year = product.expiryDate.slice(0, 4);
            const month = product.expiryDate.slice(5, 7);
            const day = product.expiryDate.slice(8, 10);
            const expiry_Date = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );
            const todayDate = new Date();

            console.log(expiry_Date);

            // Check if the parsed dates are valid
            if (isNaN(expiry_Date) || isNaN(todayDate)) {
              console.error("Invalid date format", product.expiry_Date);
              return product; // Return the original product if date parsing fails
            }

            const timeDifference = expiry_Date - todayDate;
            const daysDifference = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24)
            );
            console.log("the days difference is ----- " + daysDifference);

            // Add the daysDifference to the product object
            return { ...product, daysDifference };
          } catch (error) {
            console.error("Error parsing date", error);
            return product; // Return the original product if date parsing fails
          }
        })
        .filter((product) => product.daysDifference < parseInt(thresholdDays));
    }

    // You can add more conditions and filters here based on your requirements

    setProductsList(filteredProducts);
  };

  const clearFilter = () => {
    setSearchTerm("");
    setCategory("");
    setLocation("");
    setPriceRange("");
    setExpiryDate(""); // Add more state variables as needed
    setProductsList(products);
  };

  return (
    <Layout>
      <Header />
      <Center>
        <Title>All products</Title>
        <SearchContainer>
          <FilterIcon onClick={toggleDropdown}>
            {/* Placeholder filter icon (replace with your SVG) */}
            <svg
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              ></path>
            </svg>
          </FilterIcon>
          <SearchBar
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <SearchButton onClick={handleSearch}>Search</SearchButton>
          {/* Clear filter button */}
          <SearchButton onClick={clearFilter}>Clear Filter</SearchButton>
        </SearchContainer>
        <DropdownContainer isVisible={isDropdownVisible}>
          <Dropdown
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={catobj[cat]}>
                {cat}
              </option>
            ))}
          </Dropdown>
          <Dropdown
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Select Price Range</option>
            <option value="50">Less than $50</option>
            <option value="100">Less than $100</option>
            <option value="500">Less than $500</option>
            <option value="500">Less than $1000</option>
            {/* Add more options as needed */}
          </Dropdown>
          <Dropdown
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </Dropdown>
          <Dropdown
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          >
            <option value="">Select Expiry Date</option>
            <option value="7">Less than 7 days</option>
            <option value="14">Less than 14 days</option>
            {/* Add more options as needed */}
          </Dropdown>
        </DropdownContainer>
        <ProductsGrid products={productslist} />
      </Center>
    </Layout>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  console.log(products);
  // const filteredProducts = products.filter((product) => {
  //   // Example: Filter products with a price less than 50
  //   return product.category < "656a2eb297133cedbeaea286";
  // });
  // console.log("Filterd one : --------- " + filteredProducts);

  const expiryDate = new Date(2023, 12 - 1, 20);
  const todayDate = new Date();
  if (isNaN(expiryDate) || isNaN(todayDate)) {
    console.error("Invalid date format");
  }
  const timeDifference = expiryDate - todayDate;
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
