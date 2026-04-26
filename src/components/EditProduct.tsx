import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, updateProduct } from "../api/products";
import type { View } from "../App";

function EditProduct({ setView }: { setView: Dispatch<SetStateAction<View>> }) {
  const [productIdInput, setProductIdInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const parsedProductId = productIdInput.trim();
  const hasValidProductId = parsedProductId !== "";
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", parsedProductId],
    queryFn: () => getProduct(parsedProductId),
    enabled: hasValidProductId,
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        price: String(product.price),
        description: product.description,
        category: product.category,
        image: product.image,
      });
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", parsedProductId] });

      setView("home");
    },
  });

  if (!hasValidProductId) {
    return (
      <div className="divPad">
        <h2>Edit Product</h2>
        <input
          type="text"
          placeholder="Enter product ID"
          value={productIdInput}
          onChange={(e) => setProductIdInput(e.target.value)}
        />
      </div>
    );
  }
  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return (
      <div className="divPad">
        <h2>Edit Product</h2>
        <input
          type="text"
          placeholder="Enter product ID"
          value={productIdInput}
          onChange={(e) => setProductIdInput(e.target.value)}
        />
        <p>
          {error instanceof Error ? error.message : "Unable to load product."}
        </p>
      </div>
    );
  }
  return (
    <div className="form">
      <h2>Edit Product</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          updateMutation.mutate({
            id: parsedProductId,
            ...form,
            price: Number(form.price),
          });
        }}
        className="Profile"
      >
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="Prof-buffer"
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="Prof-buffer"

        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="Prof-buffer"
        />

        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="Prof-buffer"
        />

        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="Prof-buffer"
        />

        <button type="submit" className="Prof-buffer">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProduct;
