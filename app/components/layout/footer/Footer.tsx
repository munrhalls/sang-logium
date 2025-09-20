// import SegmentTitle from "../../ui/segment-title/SegmentTitle";
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
    <div className="h-auto grid justify-center content-start p-2 text-xl text-white-600 font-black">
      <h1>{title}</h1>
    </div>
  );
};
export default function Footer() {
  return (
    <footer className="relative bg-black grid grid-rows-[auto_4rem_1fr]  text-white px-4 pt-8">
      {/* <SegmentTitle title="Sang Logium" white={true} /> */}
      <div className=" w-full max-w-[600px] md:max-w-[1400px] mx-auto grid md:grid-cols-4 gap-6 justify-content-center py-8">
        <div className=" grid content-start gap-4">
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
        <div className=" grid content-start gap-4">
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
        <div className=" grid content-start gap-4">
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
        <div className=" md:grid-rows-[4rem_1fr] md:col-start-1 md:col-span-3  grid justify-center gap-1">
          <ColTitle title="FIND US" />
          <ul className="grid grid-rows-2 md:grid-rows-1 grid-cols-2 justify-center md:grid-flow-col gap-12">
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
        <div className=" content-start md:row-start-1 md:row-span-2 md:col-start-4 md:col-span-1 grid justify-center md:justify-content-start gap-4">
          <ColTitle title="BEST BRANDS" />
          <ul className="grid gap-2 justify-center">
            {[
              { name: "Sennheiser" },
              { name: "Sony" },
              { name: "Bose" },
              { name: "AKG" },
              { name: "Audio-Technica" },
              { name: "Beyerdynamic" },
              { name: "DPA" },
              { name: "Dynaudio" },
              { name: "Focal" },
              { name: "Genelec" },
              { name: "JBL" },
              { name: "Klipsch" },
              { name: "Mackie" },
              { name: "Pioneer" },
              { name: "Presonus" },
              { name: "Roland" },
              { name: "Shure" },
              { name: "Universal Audio" },
            ].map((brand) => (
              <li key={brand.name} className="text-center">
                <Link
                  className="text-xl grid place-content-center"
                  href={`/brands/${brand.name.toLowerCase().replace(" ", "-")}`}
                >
                  <span>{brand.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
