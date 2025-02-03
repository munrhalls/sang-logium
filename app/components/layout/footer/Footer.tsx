import SegmentTitle from "../../ui/segment-title/SegmentTitle";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
const ColTitle = function ({ title }: { title: string }) {
  return (
    <div className="h-full grid justify-center content-start p-2 text-white font-black">
      <h1>{title}</h1>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="h-full bg-black grid grid-rows-[4rem_1fr_auto]  text-white pt-8 pb-16">
      <SegmentTitle title="Sang Logium" white={true} />
      <div className="grid grid-cols-4 justify-content-center py-8">
        <div className="h-full grid justify-center content-start">
          <ColTitle title="PURCHASES" />
        </div>
        <div className="h-full grid justify-center content-start">
          <ColTitle title="SUPPORT" />
        </div>
        <div className="h-full grid justify-center content-start">
          <ColTitle title="COMMUNITY" />
        </div>
        <div className="h-full grid justify-center content-start">
          <ColTitle title="BEST BRANDS" />
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
