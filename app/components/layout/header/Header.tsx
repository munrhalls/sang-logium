import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Truck } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import SearchForm from "../../features/homepage/search/SearchForm";
import AuthenticationWrapper from "@/app/components/features/auth/AuthenticationWrapper";

export default function Header() {
  return (
    <header className="grid h-[4rem] grid-flow-col place-content-center bg-black lg:grid-cols-[3fr_4fr_4fr]">
      <Link href="/" className="grid place-content-center">
        <Image src={logo} alt="Logo" height={50} width={180} priority />
      </Link>
      <div className="hidden lg:grid lg:place-content-center">
        <SearchForm />
      </div>
      <div className="hidden grid-flow-col place-content-center gap-8 lg:grid">
        <AuthenticationWrapper />
        <Link href="/basket" className="text-white" prefetch={false}>
          <div className="grid place-content-center">
            <ShoppingCartIcon height={24} width={24} />
          </div>
          <span>Basket</span>
        </Link>
        <Link href="/tracking" className="text-white" prefetch={false}>
          <div className="grid place-content-center">
            <Truck className="h-6 w-6" />
          </div>
          <span>Track</span>
        </Link>
      </div>
    </header>
  );
}
