"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Icon, PackageIcon } from "@sanity/icons";
import Link from "next/link";
import { TrolleyIcon } from "@sanity/icons";
import Form from "next/form";
import { ClerkLoaded } from "@clerk/nextjs";
import logo from "../public/logo.svg";
import Image from "next/image";
import imageUrl from "../lib/imageUrl";
import menu from "../public/icons/Menu.svg";

function Header() {
  const { user } = useUser();

  console.log(user);

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="md:h-[80px] sm:h-[60px] bg-black  flex justify-center items-center">
      <div className="">
        <Link
          href="/"
          className="text-2xl
                font-bold
                text-blue-500
                hover:opacity-50
                cursor-pointer
                mx-auto
                sm:mx-0
            "
        >
          <div className="flex justify-center items-center ">
            <Image src={logo} alt="Sang Logium Logo" height={68} />
            {/* <span
              style={{ color: "#e3c41d" }}
              className="font-garamond  ml-3 font-thin"
            >
              Sang Logium
            </span> */}
          </div>
        </Link>

        {/* <Form
          action="/search"
          className="flex-1 flex justify-center items-center w-full mx-10"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            style={{
              border: "none",
              color: "red",
              borderBottom: "1px solid red",
              maxWidth: "20rem",
            }}
            className="
            font-thin
            bg-black
            placeholder-yellow-500
            text-center
            text-xl
            px-4
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-transparent
            focus:ring-opacity-0
            w-full
            sm:max-w-sm
            h-full
          "
          />
        </Form> */}

        {/* <div className="flex flex-items items-center">
          <Link
            href="/basket"
            style={{ color: "#000", backgroundColor: "#e3c41d" }}
            className="
        flex-1 relative flex justify-center items-center space-x-2 bg-black rounded mr-2 px-4 py-1"
          >
            <TrolleyIcon className="w-8 h-8" />
            <span className="text-xl font-bold">My basket</span>
          </Link>
        </div> */}

        {/* <ClerkLoaded>
          {user && (
            <Link
              href="/orders"
              className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <PackageIcon className="w-6 h-6" />
              <div>My orders</div>
            </Link>
          )}

          {user ? (
            <div>
              <UserButton />

              <div className="hidden sm:block text-xs">
                <p className="text-gray-400">Welcome back</p>
                <p className="font-bold">{user.fullName}</p>
              </div>
            </div>
          ) : (
            <SignInButton mode="modal" />
          )}

          {user?.passkeys.length === 0 && (
            <button
              onClick={createClerkPasskey}
              className="bg-white hover:bg-blue-700 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded border-blue-300 border"
            >
              Create a passkey now
            </button>
          )}
        </ClerkLoaded> */}
      </div>
      <Image src={menu} alt="Sang Logium Logo" height={36} />
    </header>
  );
}

export default Header;
