import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../store";
import { auth } from "../firebase/firebaseConfig";
import { fetchOrdersByUser, createOrder } from "../api/Orders";
import type { OrderDto } from "../api/Orders";

import {
  removeFromCart,
  decreaseQuantity,
  addToCart,
  clearCart,
} from "../store/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await fetchOrdersByUser(user.uid);
      setOrders(data);
    };

    loadOrders();
  }, []);

  if (items.length === 0) {
    return (
      <div>
        <h2>Your cart is empty.</h2>
        {orders.length > 0 && (
          <div>
            <h3>Past Orders</h3>
            {orders.map((order) => (
              <div className="PastOrders" key={order.id}>
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  Total: ${order.totalPrice} — {order.totalItems} items
                </p>
                <p>
                  Date:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}
                </p>
                <button onClick={() => setSelectedOrderId(order.id)}>
                  View Details
                </button>

                {selectedOrderId === order.id && (
                  <div className="PastOrders">
                    <h4>Order Details</h4>
                    <p>
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.totalPrice}
                    </p>
                    <p>
                      <strong>Items:</strong> {order.totalItems}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id} className="product-card">
                          <img src={item.image} alt={item.title} width={80} />
                          {item.title} x{item.quantity} — ${item.price}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setSelectedOrderId(null)}>
                      Back
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await createOrder({
      userId: user.uid,
      items,
      totalItems,
      totalPrice,
      createdAt: new Date().toISOString(),
    });
    dispatch(clearCart());
    sessionStorage.removeItem("cart");
    setMessage("Checkout complete! Your cart has been cleared.");
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <p>Total items: {totalItems}</p>
      <p>Total price: ${totalPrice}</p>

      {message && <p>{message}</p>}
      <button onClick={handleCheckout}>Checkout</button>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} width={80} />

            <div className="cart-info">
              <p>
                <strong>{item.title}</strong>
              </p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>

              <div className="cart-buttons">
                <button onClick={() => dispatch(decreaseQuantity(item.id))}>
                  -
                </button>

                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                      }),
                    )
                  }
                >
                  +
                </button>

                <button onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div>
          <h3>Past Orders</h3>
          {orders.map((order) => (
            <div className="PastOrders" key={order.id}>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                Total: ${order.totalPrice} — {order.totalItems} items
              </p>
              <p>
                Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "—"}
              </p>
              <button onClick={() => setSelectedOrderId(order.id)}>
                View Details
              </button>

              {selectedOrderId === order.id && (
                <div className="PastOrders">
                  <h4>Order Details</h4>
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.totalPrice}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.totalItems}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id} className="product-card">
                        <img src={item.image} alt={item.title} width={80} />
                        {item.title} x{item.quantity} — ${item.price}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setSelectedOrderId(null)}>Back</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
