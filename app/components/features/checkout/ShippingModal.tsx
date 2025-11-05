import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import Loader from "@/app/components/common/Loader";
import ShippingConfirmation from "./ShippingConfirmation";

type FormData = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: number;
  city: string;
};

interface ShippingModalProps {
  onClose: () => void;
}

export default function ShippingModal({ onClose }: ShippingModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onBlur" });
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [status, setStatus] = useState<"form" | "loading" | "confirmation">(
    "form"
  );

  const handleAddressSubmit = async (data: FormData) => {
    setStatus("loading");
    const apiValidation = await fetch("/api/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const apiValidationData = await apiValidation.json();
    setStatus("confirmation");
    setApiResponse(apiValidationData);
    console.log(apiValidationData, " --- ADDRESS VALIDATION RESPONSE");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded bg-white p-4">
        {status !== "loading" && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-50 rounded px-4 py-2 text-black"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        )}
        <div className="relative min-h-96 w-80">
          {status === "form" && (
            <form onSubmit={handleSubmit(handleAddressSubmit)}>
              <h2 className="mb-4 text-lg font-bold">Enter Shipping Address</h2>
              <p className="text-sm font-black tracking-wide">Country</p>
              <select
                {...register("regionCode", { required: true })}
                className="mb-4 w-full border border-gray-300 p-2"
              >
                <option value="PL">Poland</option>
                <option value="EN">England</option>
              </select>
              <p className="text-sm font-black tracking-wide">Postal code</p>
              <input
                {...register("postalCode", { required: true })}
                type="text"
                placeholder="Postal Code"
                className="mb-2 w-full border border-gray-300 p-2"
              />
              <div className="grid grid-cols-8 gap-2">
                <div className="col-span-6">
                  <p className="text-sm font-black tracking-wide">Street</p>
                  <input
                    {...register("street", { required: true })}
                    type="text"
                    placeholder="Street"
                    className="mb-2 w-full border border-gray-300 p-2"
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-black tracking-wide">Number</p>
                  <input
                    {...register("streetNumber", { required: true })}
                    type="number"
                    placeholder="..."
                    className="mb-2 flex w-full items-center justify-center border border-gray-300 p-2"
                  />
                </div>
              </div>
              <p className="text-sm font-black tracking-wide">City</p>
              <input
                {...register("city", { required: true })}
                type="text"
                placeholder="City"
                className="mb-2 w-full border border-gray-300 p-2"
              />
              <button
                disabled={!isValid}
                type="submit"
                className={`w-full rounded px-4 py-2 ${
                  !isValid
                    ? "cursor-not-allowed bg-gray-400 text-gray-600"
                    : "bg-black text-white"
                }`}
              >
                Submit Address
              </button>
            </form>
          )}
          {status === "loading" && (
            <Loader message="Processing..." color="border-t-black" />
          )}
          {status === "confirmation" && <ShippingConfirmation />}
        </div>
      </div>
    </div>
  );
}
