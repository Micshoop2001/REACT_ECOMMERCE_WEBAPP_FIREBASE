import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchProducts,
  type Product,
  deleteProduct,
} from "../api/products";
import "../App.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

function Home() {
  const [category, setCategory] = useState("");
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong.</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div className="divPad">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <option value="">All Categories</option>
        {categories?.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="product-grid">
        {data.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.title}
              width={100}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
            <p>
              <strong>{product.title}</strong>
            </p>
            <p>Category: {product.category}</p>
            <p>{product.description}</p>
            <p>
              Rating: {product.rating?.rate} ({product.rating?.count} reviews)
            </p>
            <p>${product.price}</p>
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                  }),
                )
              }
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                const ok = window.confirm("Delete this product?");
                if (ok) deleteMutation.mutate(product.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;
