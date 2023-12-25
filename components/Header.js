// Import necessary libraries and components
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import BarsIcon from "@/components/icons/Bars";
import Center from "@/components/Center";
import { CartContext } from "@/components/CartContext";
import { data } from "autoprefixer";
import CartIcon from "./icons/CartIcon";
import { getAdminEmails } from "./Get_Emails";

// Styled components for styling
const StyledHeader = styled.header`
  background-color: #222;
  padding: 5px 0;
`;

const Logo = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  transition: transform 0.2s, color 0.2s;
  margin-right: 20px; /* Increased margin to add space */
  margin-left: 300px;

  &:hover {
    transform: scale(1.05);
    color: #ffcc00;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align items vertically in the center */
`;

const StyledNav = styled.nav`
  ${(props) =>
    props.mobileNavActive
      ? `
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%; /* Set width to 100% */
    position: absolute;
    top: 60px;
    right: 0;
    background-color: #222;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 1;
    padding: 20px;
  `
      : `
    display: none;
  `}

  @media screen and (min-width: 768px) {
    display: flex;
    width: auto; /* Set back to auto for wider screens */
    gap: 15px;
    position: static;
    padding: 0;
  }
`;

const NavLink = styled.a`
  display: flex;
  align-items: center; /* Center the content vertically */
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;

  @media screen and (min-width: 768px) {
    padding: 0;
  }

  &:hover {
    color: #fff; /* Change the color on hover */
  }
`;

// Styled component for ADMIN link
const AdminLink = styled(NavLink)`
  color: #ffcc00; // Change the color for ADMIN link
  font-weight: bold; // Make it bold
  border: 2px solid #ffcc00; // Add a border
  padding: 6px 10px; // Adjusted padding
  border-radius: 4px; // Add border-radius for rounded corners
  transition: color 0.2s, border-color 0.2s, transform 0.2s;

  &:hover {
    color: #222; // Change the color on hover
    background-color: #ffcc00; // Change the background color on hover
    border-color: #ffcc00; // Change the border color on hover
    transform: scale(1.05);
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 3;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled.a`
  display: flex;
  align-items: center; /* Center the content vertically */
  color: #aaa;
  text-decoration: none;
  cursor: pointer;

  @media screen and (min-width: 768px) {
    padding: 0;
  }

  &:hover {
    color: #fff; /* Change the color on hover */
  }
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #222;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;

  a {
    display: block;
    padding: 12px 16px;
    text-decoration: none;
    color: #aaa;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      color: #fff;
      background-color: #333;
    }
  }
`;

const AccountIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px; /* Increased margin to add space */
  cursor: pointer;
  color: #fff;
  font-size: 2.2rem;
  flex-direction: column;
  text-align: center;
  position: relative;

  &:hover ${DropdownContent} {
    display: block;
    right: 0; /* Align the dropdown to the right */
  }
`;

const AccountName = styled.span`
  font-size: 1rem;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AccountContainer = styled.div`
  position: relative;
`;

const AccountImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 5px;
  object-fit: cover; /* Ensure the image covers the entire container */
`;

const AccountLabel = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`;

// Main component for the header
export default function Header() {
  const { data: session } = useSession();
  const profilePicture = session?.user?.picture || "/images/user.png";
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const router = useRouter();
  const { pathname } = router;
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

  // Close the mobile navigation when the route changes
  useEffect(() => {
    setMobileNavActive(false);
  }, [pathname]);

  // Handle logout
  async function logout() {
    await signOut();
    // Use the router to navigate to the home page after logout
    router.push("/");
  }

  return (
    <StyledHeader>
      <>
        <Wrapper>
          <Logo onClick={() => router.push("/")}>Food Network</Logo>
          <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
            <BarsIcon />
          </NavButton>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All products</NavLink>
            <NavLink href={"/cart"}>
              {" "}
              <CartIcon /> Cart ({cartProducts.length})
            </NavLink>
            {isAuthorized && <AdminLink href={"/admin"}>ADMIN</AdminLink>}
          </StyledNav>
          <AccountContainer>
            <AccountIcon onClick={() => setShowDropdown(!showDropdown)}>
              <AccountImage src={profilePicture} alt="Profile Picture" />

              <AccountName>
                Hello,{" "}
                {session?.user?.name
                  ? session?.user?.name.slice(0, 10)
                  : session?.user?.email.split("@")[0].slice(0, 10)}
                ..
              </AccountName>
              <AccountLabel>Account Settings</AccountLabel>
            </AccountIcon>
            <DropdownContent show={showDropdown}>
              <NavLink href={"/change_password"}>Change Password</NavLink>
              <LogoutButton onClick={logout}>Logout</LogoutButton>
            </DropdownContent>
          </AccountContainer>
        </Wrapper>
      </>
    </StyledHeader>
  );
}
