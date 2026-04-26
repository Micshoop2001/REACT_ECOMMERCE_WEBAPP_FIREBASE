import "./App.css";
import Home from "./components/Home";
import Cart from "./components/Cart";
import CreateProduct from "./components/CreateProduct";
import Register from "./firebase/Register";
import Login from "./firebase/Login";
import DisplayData from "./firestore/DisplayData";

import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { useState } from "react";

import { useAuth } from "./firebase/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import EditProduct from "./components/EditProduct";

export type View =
  | "home"
  | "cart"
  | "profile"
  | "login"
  | "register"
  | "create-product"
  | "edit-product";

function App() {
  const [view, setView] = useState<View>("home");
  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Checking authentication...</p>;
  }
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out!");
  };
  return (
    <div>
      <header className="app-header">
        <h1>FakeStore Shop</h1>

        <nav className="nav-buttons">
          <button onClick={() => setView("home")}>Home</button>

          <button disabled={!user} onClick={() => user && setView("cart")}>
            Cart ({totalItems})
          </button>
          <button disabled={!user} onClick={() => user && setView("profile")}>
            Profile
          </button>
          {!user && (
            <>
              <button onClick={() => setView("login")}>Login</button>
              <button onClick={() => setView("register")}>Register</button>
            </>
          )}

          {user && <button onClick={handleLogout}>Logout</button>}
          <button
            disabled={!user}
            onClick={() => user && setView("create-product")}
          >
            Create Product
          </button>
          <button
            disabled={!user}
            onClick={() => user && setView("edit-product")}
          >
            Edit Product
          </button>
        </nav>
      </header>

      {view === "home" && <Home />}
      {view === "cart" && <Cart />}
      {view === "profile" && <DisplayData />}
      {view === "login" && <Login onLoginSuccess={() => setView("home")} />}
      {view === "register" && (
        <Register onRegisterSuccess={() => setView("home")} />
      )}
      {view === "create-product" && <CreateProduct setView={setView} />}
      {view === "edit-product" && <EditProduct setView={setView} />}
    </div>
  );
}

export default App;
