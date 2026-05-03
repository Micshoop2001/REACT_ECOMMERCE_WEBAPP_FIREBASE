import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cartReducer from "../store/cartSlice";
import Home from "../components/Home";

jest.mock("../firebase/firebaseConfig", () => ({
  auth: {
    currentUser: {
      uid: "user-1",
      email: "test@example.com",
    },
  },
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  limit: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
}));

jest.mock("../api/products", () => ({
  fetchProducts: jest.fn(() =>
    Promise.resolve([
      {
        id: "1",
        title: "Test Product",
        price: 29.99,
        image: "product.jpg",
        category: "electronics",
        description: "A test product",
        rating: { rate: 4.5, count: 100 },
      },
    ]),
  ),
  fetchCategories: jest.fn(() => Promise.resolve(["electronics", "clothing"])),
  deleteProduct: jest.fn(),
}));

function renderHomeWithStore() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: { items: [] }, // Start with empty cart
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Home />
      </Provider>
    </QueryClientProvider>,
  );

  return store;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("test of add to cart button", async () => {
  const store = renderHomeWithStore();

  const addButton = await screen.findByRole("button", { name: /Add to Cart/i });

  fireEvent.click(addButton);

  const state = store.getState();
  expect(state.cart.items).toHaveLength(1);
  expect(state.cart.items[0]).toEqual(
    expect.objectContaining({
      id: "1",
      title: "Test Product",
      price: 29.99,
    }),
  );
});

//prompting CICD
