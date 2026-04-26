import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/products";
import type { View } from "../App";

function CreateProduct({
  setView,
}: {
  setView: Dispatch<SetStateAction<View>>;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImage("");

      // navigate back to home
      setView("home"); // but we need access to setView
    },
  });

  return (
    <div className="form">
      <h2 className="Prof-buffer">Create Product</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate({
            title,
            price: Number(price),
            description,
            category,
            image,
          });
        }}
        className="Profile"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="Prof-buffer"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="Prof-buffer"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="Prof-buffer"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="Prof-buffer"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="Prof-buffer"
        />

        <button type="submit" className="Prof-buffer">
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
