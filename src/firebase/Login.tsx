// Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
      alert("Login successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };
  {
    /*}
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  };*/
  }

  return (
    <div className="form">
      <form onSubmit={handleLogin} className="Profile">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="Prof-buffer"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="Prof-buffer"
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      {/*<button onClick={handleLogout} className="Prof-buffer">Logout</button>*/}
    </div>
  );
};

export default Login;
