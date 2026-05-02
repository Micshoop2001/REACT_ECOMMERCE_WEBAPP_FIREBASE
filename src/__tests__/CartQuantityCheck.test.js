import cartReducer, { addToCart } from "../store/cartSlice";

describe("cartSlice reducer", () => {
  test("adds a new product with quantity 1", () => {
    const initialState = { items: [] };

    const action = addToCart({
      id: "1",
      title: "Test Product",
      price: 29.99,
      image: "product.jpg",
      quantity: 1,
    });

    const nextState = cartReducer(initialState, action);

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual(
      expect.objectContaining({
        id: "1",
        title: "Test Product",
        price: 29.99,
        quantity: 1,
      }),
    );
  });

  test("check for quantity increase", () => {
    const initialState = {
      items: [
        {
          id: "1",
          title: "Test Product",
          price: 29.99,
          image: "product.jpg",
          quantity: 1,
        },
      ],
    };

    const action = addToCart({
      id: "1",
      title: "Test Product",
      price: 29.99,
      image: "product.jpg",
      quantity: 1,
    });

    const nextState = cartReducer(initialState, action);

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(2);
  });
});
