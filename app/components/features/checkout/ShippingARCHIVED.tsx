import { useState } from "react";
import ShippingModal from "./Shipping";

export default function Shipping() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openShippingModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && <ShippingModal onClose={() => setIsModalOpen(false)} />}

      <button
        onClick={openShippingModal}
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        Shipping
      </button>
    </>
  );
}
