import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

function loadCartFromSession() {
  try {
    const stored = sessionStorage.getItem("cart");
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

const preloadedState = {
  cart: {
    items: loadCartFromSession(),
  },
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  sessionStorage.setItem("cart", JSON.stringify(state.cart.items));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
