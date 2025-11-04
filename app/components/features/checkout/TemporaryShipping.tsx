import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import ShippingModal from "./ShippingModal";

type FormData = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: number;
  city: string;
};

export default function Shipping() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openShippingModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative rounded bg-white p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 rounded px-4 py-2 text-black"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <ShippingModal />
          </div>
        </div>
      )}

      <button
        onClick={openShippingModal}
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        Shipping
      </button>
    </>
  );
}
