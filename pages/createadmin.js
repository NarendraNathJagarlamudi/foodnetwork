// Import necessary libraries
import { useState } from "react";
import firebase from "@/components/firebase";
import { User } from "@/models/User"; // Assuming this is the correct path to your User model
import { mongooseConnect } from "@/lib/mongoose";
import axios from "axios";
import { useRouter } from "next/router";

// Admin Signup Component
export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [governmentID, setGovernmentID] = useState("");
  const [description, setDescription] = useState("");
  const [shop_name, setShop_name] = useState("");
  const [location, setLocation] = useState("");
  const [legalAcknowledged, setLegalAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const data = {
    email,
    shop_name,
    location,
    governmentID,
    description,
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value);
  const handleGovernmentIDChange = (event) =>
    setGovernmentID(event.target.value);
  const handleShop_nameChange = (event) => setShop_name(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleLegalAcknowledgment = () =>
    setLegalAcknowledged(!legalAcknowledged);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!legalAcknowledged) {
      setError("Please acknowledge the responsibilities.");
      return;
    }

    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Step 2: Create user in MongoDB
      await axios.post("/api/users", data);

      // Reset error state
      setError("");
      router.push("/");

      // You can redirect or perform other actions here
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl font-semibold text-center mb-6">Join Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded-lg p-2"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="shop_name" className="block text-gray-600">
              Shop name/ Branch name
            </label>
            <input
              type="text"
              id="shop_name"
              className="w-full border rounded-lg p-2"
              value={shop_name}
              onChange={handleShop_nameChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-600">
              Location
            </label>
            <input
              type="text"
              id="location"
              className="w-full border rounded-lg p-2"
              value={location}
              onChange={handleLocationChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="governmentID" className="block text-gray-600">
              Government ID (e.g., Shop Registration title, Shop license
              number):
            </label>
            <input
              type="text"
              id="governmentID"
              className="w-full border rounded-lg p-2"
              value={governmentID}
              onChange={handleGovernmentIDChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-600">
              Describe your shop
            </label>
            <textarea
              id="description"
              className="w-full border rounded-lg p-2"
              rows="4"
              value={description}
              onChange={handleDescriptionChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-lg p-2"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-600">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full border rounded-lg p-2"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="legalAcknowledgment"
              className="mt-2 w-7"
              checked={legalAcknowledged}
              onChange={handleLegalAcknowledgment}
            />
            <label htmlFor="legalAcknowledgment" className="text-gray-600">
              I acknowledge the responsibilities of submitting this form.
            </label>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{`Error: ${error}`}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
