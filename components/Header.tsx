"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { PackageIcon } from "@sanity/icons";
import Link from "next/link";
import { TrolleyIcon } from "@sanity/icons";
import Form from "next/form";
import { ClerkLoaded } from "@clerk/nextjs";
import logo from "../public/logo compressed.png";
import Image from "next/image";
import imageUrl from "../lib/imageUrl";

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
    <header className="bg-black flex flex-wrap justify-between items-center px-4 py-2">
      <div className="flex w-full flex-wrap justify-between items-center">
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
          <Image
            src={logo}
            alt="Sang Logium Logo"
            className="max-h-15 max-w-15"
          />
        </Link>

        <Form
          action="/search"
          className="flex-1
        sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="
            bg-gray-100
            text-gray-800
            px-4
            py-2
            rounded
            focus:outline-none
            focus:ring-2
            focus:ring-blue-800
            focus:ring-opacity-50
            border
            w-full
            sm:max-w-sm
          "
          />
        </Form>

        <div className="flex flex-items items-center">
          <Link
            href="/basket"
            className="
        flex-1 relative flex justify-center items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          >
            <TrolleyIcon className="w-6 h-6" />
            <span>My basket</span>
          </Link>
        </div>

        <ClerkLoaded>
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
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
