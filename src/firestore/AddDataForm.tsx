// AddDataForm.tsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  address: string;
}

const AddDataForm = () => {
  const [data, setData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), data);
      alert("Data added!");
      setData({ name: "", email: "", password: "", address: "" }); // reset form
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        name="name"
        value={data.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        name="email"
        type="email"
        value={data.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="address"
        value={data.address}
        onChange={handleChange}
        placeholder="Address"
      />

      <button type="submit">Add User</button>
    </form>
  );
};

export default AddDataForm;
