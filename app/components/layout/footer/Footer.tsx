import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";

const ColTitle = function ({ title }: { title: string }) {
  return (
    <div className="h-full grid justify-center content-start p-2 text-xl text-white font-black">
      <h1>{title}</h1>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="h-full  bg-black grid grid-rows-[4rem_1fr_1fr]  text-white pt-8 pb-16">
      <SegmentTitle title="Sang Logium" white={true} />
      <div className="w-full max-w-[1400px] mx-auto grid md:grid-cols-4 gap-12 justify-content-center py-8">
        <div className="h-full grid justify-center content-start gap-4">
          <ColTitle title="PURCHASES" />
          <ul className="grid gap-2 justify-center">
            <li>
              <Link className="text-xl " href="/purchases/order-status">
                Order Status
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/purchases/shipping-policy">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/purchases/returns">
                Returns Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="h-full grid justify-center content-start gap-4">
          <ColTitle title="SUPPORT" />
          <ul className="grid gap-2 justify-center">
            <li>
              <Link className="text-xl " href="/support/contact">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/support/faq">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div className="h-full grid justify-center content-start gap-4">
          <ColTitle title="ABOUT US" />
          <ul className="grid gap-2 justify-center">
            <li>
              <Link className="text-xl " href="/support/privacy-policy">
                About Us
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/support/privacy-policy">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/support/privacy-policy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="h-full grid justify-center content-start gap-4">
          <ColTitle title="BEST BRANDS" />
          <ul className="grid gap-2 justify-center">
            <li>
              <Link className="text-xl " href="/brands/sennheiser">
                Sennheiser
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/brands/sony">
                Sony
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/brands/bose">
                Bose
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/brands/akg">
                AKG
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/brands/audiotechnica">
                Audio-Technica
              </Link>
            </li>
            <li>
              <Link className="text-xl " href="/brands/philips">
                Philips
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="grid justify-center gap-4">
        <ColTitle title="FIND US" />
        <ul className="grid grid-rows-2 md:grid-rows-1  grid-flow-col gap-12">
          <li>
            <FaTwitter size={32} />
          </li>
          <li>
            <FaFacebook size={32} />
          </li>
          <li>
            <FaInstagram size={32} />
          </li>
          <li>
            <FaPinterest size={32} />
          </li>
          <li>
            <FaYoutube size={32} />
          </li>
        </ul>
      </div>
    </footer>
  );
}
