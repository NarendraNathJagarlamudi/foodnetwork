import { useState } from "react";
import { useRouter } from "next/router";
import firebase from "@/components/firebase";
import NextAuth from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";

export default function ChangePassword() {
  //   const { user, firebase } = useAuth(); // Replace useAuth with your authentication context hook

  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Check if the new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      // Reauthenticate the user with their current password
      const credentials = firebase.auth.EmailAuthProvider.credential(
        session?.user?.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credentials);

      // Change the user's password
      await user.updatePassword(newPassword);

      setSuccess("Password changed successfully!");
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Email:</label>
          <input type="text" value={session?.user?.email} readOnly />
        </div>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
