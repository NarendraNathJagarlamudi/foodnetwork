import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "./Logo";
import Link from "next/link";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import NewProducts from "./NewProducts";

export default function Layout({ children, featuredProduct, newProducts }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    signIn("credentials", { email, password });
  };

  if (!session) {
    return (
      <div className="bg-gray-300 w-screen h-screen flex items-center justify-center">
        <div className="w-1/2">
          <Logo />
        </div>
        <div className="w-1/2 pt-20 pb-20 pl-10 pr-10 ">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4 ml-4 flex items-center justify-center w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-white p-2 rounded-lg px-4 w-1/2"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4 ml-4 flex items-center justify-center w-full">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="bg-white p-2 rounded-lg px-4 w-1/2"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-4 flex items-center justify-center w-full">
              <button
                type="submit"
                className="mr-1 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
              >
                Sign In
              </button>
              <Link
                href="/signup"
                className="ml-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Sign up
              </Link>
            </div>
          </form>

          <div className="mb-4 flex items-center justify-center w-full">
            <button
              onClick={() => signIn("google")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-0 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 flex items-center"
            >
              <img
                src="/images/googleplus_icon.png"
                alt="Google Icon"
                width="20px"
                style={{ marginBottom: "3px", marginRight: "5px" }}
                className="w-8 h-8 mt-1" // Add the SVG styling class
              />
              Sign In with Google
            </button>
          </div>
          <div className="mb-4 flex items-center justify-center w-full mt-20">
            <Link
              href="/createadmin"
              className="bg-gray-900 hover:bg-gray-600 text-blue-300 font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 flex items-center"
            >
              Want to join your store/shop? Click here!
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
}
