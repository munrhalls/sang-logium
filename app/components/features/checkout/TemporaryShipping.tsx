import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: number;
  city: string;
};

export default function Shipping() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiValidationError, setApiValidationError] = useState<string | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleShipping = () => {
    setIsModalOpen(true);
  };

  const handleAddressSubmit = async (data: FormData) => {
    const apiValidation = await fetch("/api/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const apiValidationData = await response.json();
    console.log(apiValidationData, " --- ADDRESS VALIDATION RESPONSE");

    const addressActions = {
      EDIT: "Please edit your address. A required component is missing or incorrect.",
      CONFIRM: "We couldn't fully confirm this address. Is it correct?",
      NULL: "Address successfully validated.",
    };
    if (
      apiValidationData.verdict &&
      apiValidationData.verdict.possibleNextAction === "FIX"
    ) {
      setApiValidationError(
        "This address cannot be found. Please make sure the address is correct and try again."
      );
    }
  };

  return (
    <>
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-4">
              <form
                onSubmit={handleSubmit(handleAddressSubmit)}
                className="w-80"
              >
                <h2 className="mb-4 text-lg font-bold">
                  Enter Shipping Address
                </h2>
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
                  disabled={Object.keys(errors).length > 0}
                  type="submit"
                  className={`w-full rounded px-4 py-2 ${
                    Object.keys(errors).length > 0
                      ? "cursor-not-allowed bg-gray-400 text-gray-600"
                      : "bg-black text-white"
                  }`}
                >
                  Submit Address
                </button>
              </form>

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 rounded bg-black px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleShipping}
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        Shipping
      </button>
    </>
  );
}
