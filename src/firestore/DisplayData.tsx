// DisplayData.tsx
import { useState, useEffect } from "react";
import {
  deleteUser as deleteAuthUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useAuth } from "../firebase/useAuth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

interface User {
  id?: string;
  name: string;
  email: string;
  address: string;
}

type EditableUserFields = Pick<User, "name" | "email" | "address">;

const DisplayData = () => {
  const [userData, setUser] = useState<User | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const { user, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [nextPassword, setNextPassword] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  const updateUser = async (
    userId: string,
    updatedData: Partial<EditableUserFields>,
  ) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, updatedData);
  };

  const deleteUserAccount = async () => {
    const ok = window.confirm("Delete your account? This cannot be undone.");
    if (!ok) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteAuthUser(currentUser);
      alert("Account deleted.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Delete failed: " + message);
    }
  };

  const changePassword = async () => {
    setPasswordMessage("");

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setPasswordMessage("No authenticated user found.");
      return;
    }

    if (!nextPassword.trim() || nextPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }

    try {
      await updatePassword(currentUser, nextPassword);
      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setNextPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";

      if (message.includes("requires-recent-login")) {
        if (!currentUser.email) {
          setPasswordMessage(
            "Re-authentication required, but email is unavailable.",
          );
          return;
        }
        if (!currentPassword) {
          setPasswordMessage("Enter your current password to re-authenticate.");
          return;
        }

        try {
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword,
          );
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, nextPassword);

          setPasswordMessage("Password updated successfully.");
          setCurrentPassword("");
          setNextPassword("");
        } catch (reauthErr: unknown) {
          const reauthMessage =
            reauthErr instanceof Error ? reauthErr.message : "Unknown error";
          setPasswordMessage("Password update failed: " + reauthMessage);
        }
        return;
      }

      setPasswordMessage("Password update failed: " + message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUser({
          id: userDoc.id,
          ...userDoc.data(),
        } as User);
      } else {
        setUser(null);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your profile.</div>;
  if (!userData) return <div>No profile data found.</div>;

  return (
    <div className="form">
      <h2 className="Prof-buffer">Your Profile</h2>
      <div className="Profile">
        <p className="Prof-buffer">Name: {userData.name || "(not set)"}</p>
        <p className="Prof-buffer">Email: {userData.email}</p>
        <p className="Prof-buffer">
          Address: {userData.address || "(not set)"}
        </p>
        <hr />
        <h3 className="Prof-buffer">Update Profile</h3>
        <section className="Prof-buffer">
          <input
            placeholder="New address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!newAddress.trim()) return;
              await updateUser(user.uid, { address: newAddress.trim() });
              setUser((prev) =>
                prev ? { ...prev, address: newAddress.trim() } : prev,
              );
              setNewAddress("");
            }}
          >
            Update Address
          </button>
        </section>

        <section className="Prof-buffer">
          <input
            placeholder="New name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!newName.trim()) return;
              await updateUser(user.uid, { name: newName.trim() });
              setUser((prev) =>
                prev ? { ...prev, name: newName.trim() } : prev,
              );
              setNewName("");
            }}
          >
            Update Name
          </button>
        </section>
        <section className="Prof-buffer">
          <input
            type="email"
            placeholder="New email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!newEmail.trim()) return;
              await updateUser(user.uid, { email: newEmail.trim() });
              setUser((prev) =>
                prev ? { ...prev, email: newEmail.trim() } : prev,
              );
              setNewEmail("");
            }}
          >
            Update Email
          </button>
          <hr />
          <h3>Change Password</h3>
        </section>
        <section className="Prof-buffer">
          <input
            type="password"
            placeholder="Current password (used if re-auth is required)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            value={nextPassword}
            onChange={(e) => setNextPassword(e.target.value)}
          />

          <button onClick={changePassword}>Update Password</button>

          {passwordMessage && <p>{passwordMessage}</p>}
          <button
            style={{ backgroundColor: "crimson" }}
            onClick={deleteUserAccount}
          >
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default DisplayData;
