import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Nav from "@/components/Nav_admin";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "./Logo";
import Link from "next/link";
import { getAdminEmails } from "./Get_Emails";

export default function Layout_admin({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);

  useEffect(() => {
    const fetchAdminEmails = async () => {
      const emails = await getAdminEmails();
      setAdminEmails(emails);
    };

    fetchAdminEmails();
  }, []); // Run the effect only once on component mount

  const isAuthorized = adminEmails
    ?.map((email) => email.toLowerCase())
    ?.includes(session?.user?.email.toLowerCase());

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

  if (session && !isAuthorized) {
    // User is authenticated but not authorized
    return (
      <div className="bg-bgGray min-h-screen">
        <p>Unauthorized access.</p>
        {/* You might want to redirect to a different page or show a different message */}
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
