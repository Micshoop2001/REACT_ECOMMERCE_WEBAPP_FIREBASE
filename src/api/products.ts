import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type CreateProductInput = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};
export async function createProduct(input: CreateProductInput) {
  const payload = {
    ...input,
    rating: { rate: 0, count: 0 },
  };
  const docRef = await addDoc(collection(db, "products"), payload);
  return { id: docRef.id, ...payload };
}
export async function fetchProducts(category?: string) {
  const productsRef = collection(db, "products");
  const cat = category
    ? query(productsRef, where("category", "==", category))
    : productsRef;

  const snapshot = await getDocs(cat);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Product, "id"> & { id?: string };
    return { id: data.id ?? doc.id, ...data };
  }) as Product[];
}

export async function fetchCategories() {
  const snapshot = await getDocs(collection(db, "products"));
  const categories = snapshot.docs.map((d) => (d.data() as Product).category);
  return Array.from(new Set(categories));
}

export async function getProduct(id: string) {
  const docRef = doc(db, "products", String(id));
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Product not found");
  }

  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<Product, "id">),
  } as Product;
}

export async function updateProduct(
  input: CreateProductInput & { id: string },
) {
  {
    const { id, ...data } = input;
    const docRef = doc(db, "products", String(id));
    await updateDoc(docRef, data);
    return { id, ...data };
  }
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
  return id;
}
