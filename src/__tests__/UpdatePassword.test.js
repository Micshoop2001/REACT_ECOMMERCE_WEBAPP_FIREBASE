import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DisplayData from "../firestore/DisplayData";
import { updatePassword } from "firebase/auth";

jest.mock("../firebase/useAuth", () => ({
  useAuth: () => ({
    user: { uid: "user-1", email: "test@example.com" },
    loading: false,
  }),
}));

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
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() =>
    Promise.resolve({
      id: "user-1",
      exists: () => true,
      data: () => ({
        name: "Test User",
        email: "test@example.com",
        address: "123 Test St",
      }),
    }),
  ),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
}));

jest.mock("firebase/auth", () => ({
  deleteUser: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
  EmailAuthProvider: {
    credential: jest.fn(() => ({})),
  },
}));

describe("Profile update password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("test of update password button in profile", async () => {
    render(<DisplayData />);

    const newPasswordInput =
      await screen.findByPlaceholderText(/new password/i);
    fireEvent.change(newPasswordInput, { target: { value: "newpass123" } });

    fireEvent.click(
      screen.getByRole("button", {
        name: /update password/i,
      }),
    );

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledTimes(1);
      expect(updatePassword).toHaveBeenCalledWith(
        expect.objectContaining({ uid: "user-1" }),
        "newpass123",
      );
    });

    expect(
      screen.getByText(/password updated successfully\./i),
    ).toBeInTheDocument();
  });
});
