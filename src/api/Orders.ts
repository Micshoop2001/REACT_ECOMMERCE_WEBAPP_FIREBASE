import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDto {
  id: string;
  userId: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: string;
  createdAt: string;
}

export async function fetchOrdersByUser(userId: string): Promise<OrderDto[]> {
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<OrderDto, "id">),
  }));
}

export async function createOrder(
  order: Omit<OrderDto, "id">,
): Promise<OrderDto> {
  const docRef = await addDoc(collection(db, "orders"), order);
  return { id: docRef.id, ...order };
}
