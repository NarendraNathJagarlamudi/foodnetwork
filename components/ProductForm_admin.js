import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout_admin from "./Layout_admin";
import Spinner from "./Spinner_admin";
import { ReactSortable } from "react-sortablejs";
import { useSession } from "next-auth/react";
import { User } from "@/models/User";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
  expiryDate: existingExpiryDate,
  store: store,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const { data: session } = useSession();
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [gotoProducts, setGotoProducts] = useState(false);
  const [isuploading, setISUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [location, setLocation] = useState(store.location);

  useEffect(() => {
    if (existingExpiryDate) {
      const parsedDate = new Date(existingExpiryDate);
      const formattedDate = parsedDate
        .toISOString()
        .substring(0, 10)
        .split("-")
        .reverse()
        .join("-");
      setExpiryDate(formattedDate);
    }
  }, [existingExpiryDate]); // Add existingExpiryDate as a dependency

  function convertToDateObject(dateString) {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  }
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category: category,
      properties: productProperties,
      user: session?.user?.email,
      expiryDate: convertToDateObject(expiryDate),
      location,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGotoProducts(true);
  }

  if (gotoProducts) {
    router.push("/products_admin");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setISUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setISUploading(false);
    }
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo && catInfo.properties) {
      propertiesToFill.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        if (parentCat && parentCat.properties) {
          propertiesToFill.push(...parentCat.properties);
          catInfo = parentCat;
        } else {
          break; // Exit the loop if parentCat or parentCat.properties is null/undefined
        }
      }
    }
  }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-2"
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="" />
              </div>
            ))}
        </ReactSortable>
        {isuploading && (
          <div className="h-24 p-1 flex items-center ">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 border flex cursor-pointer justify-center items-center text-sm text-gray-500 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          Upload
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        {!images?.length && <div>No photos in this product</div>}
      </div>
      <label>Product Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label>Price (USD)</label>
      <input
        type="text"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <label>Expiry Date</label>
      <input
        type="text"
        placeholder="Expiry Date (dd-mm-yyyy)"
        value={expiryDate}
        onChange={(ev) => setExpiryDate(ev.target.value)}
      />

      <label>Admin email/ Store email</label>
      <input
        type="text"
        className="w-full border rounded-lg p-2 bg-gray-200 text-gray-500 cursor-not-allowed"
        placeholder="Admin email/ Store email"
        value={session?.user?.email}
        readOnly
      />
      <label>Location/City</label>
      <input
        type="text"
        className="w-full border rounded-lg p-2 bg-gray-200 text-gray-500 cursor-not-allowed"
        placeholder="Location / City"
        value={store.location}
        readOnly
      />
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}
