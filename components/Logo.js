import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex">
      {/* <div className=" flex items-center justify-center"> */}
      <img
        src="/images/food-network-1-logo-png-transparent.png"
        alt="EcommerceAdmin Logo"
        className=""
      />
      {/* </div> */}
    </Link>
  );
}
