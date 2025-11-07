"use client";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import Loader from "@/app/components/common/Loader";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ConfirmationView from "./confirmation/ConfirmationView";

type FormData = {
  regionCode: string;
  postalCode: string;
  street: string;
  streetNumber: string;
  city: string;
};

const FormView = function ({
  handleAddressSubmit,
  isLoading,
}: {
  handleAddressSubmit: (data: FormData) => void;
  isLoading: boolean;
}) {
  const { validateShipping, addressApiValidation, shippingAddress } =
    useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: shippingAddress ?? undefined,
  });

  return (
    <div className="flex min-h-screen justify-center">
      <div className="relative rounded bg-white p-4">
        <div className="relative min-h-96 w-80">
          {!isLoading && (
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
                {...register("postalCode", {
                  required: "Postal Code is required.",
                  minLength: {
                    value: 5,
                    message: "Postal Code must be at least 5 characters.",
                  },
                  maxLength: {
                    value: 10,
                    message: "Postal Code cannot exceed 10 characters.",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s-]+$/,
                    message:
                      "Invalid format. Use letters, numbers, and spaces/hyphens.",
                  },
                })}
                type="text"
                placeholder="Postal Code"
                className="mb-2 w-full border border-gray-300 p-2"
              />
              {errors.postalCode && (
                <p className="mb-4 text-xs font-semibold text-red-500">
                  {errors.postalCode.message || "Invalid Postal Code."}
                </p>
              )}

              <div className="grid grid-cols-8 gap-2">
                <div className="col-span-6">
                  <p className="text-sm font-black tracking-wide">Street</p>
                  <input
                    {...register("street", {
                      required: "Street is required.",
                      minLength: {
                        value: 3,
                        message: "Street name must be at least 3 characters.",
                      },
                      maxLength: {
                        value: 70,
                        message: "Street name must be under 70 characters.",
                      },
                    })}
                    type="text"
                    placeholder="Street"
                    className="mb-2 w-full border border-gray-300 p-2"
                  />
                  {errors.street && (
                    <p className="mb-4 text-xs font-semibold text-red-500">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <p className="text-sm font-black tracking-wide">Number</p>
                  <input
                    {...register("streetNumber", {
                      required: "Number is required.",
                      minLength: {
                        value: 1,
                        message: "Must be at least 1 character.",
                      },
                      maxLength: {
                        value: 10,
                        message: "Number cannot exceed 10 characters.",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9\-\/]+$/,
                        message:
                          "Invalid format. Use numbers, letters, -, or /.",
                      },
                    })}
                    type="text"
                    placeholder="..."
                    className="mb-2 flex w-full items-center justify-center border border-gray-300 p-2"
                  />
                  {errors.streetNumber && (
                    <p className="mb-4 text-xs font-semibold text-red-500">
                      {errors.streetNumber.message}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm font-black tracking-wide">City</p>
              <input
                {...register("city", {
                  required: "City name is required.",
                  minLength: {
                    value: 3,
                    message: "City name must be at least 3 characters long.",
                  },
                  maxLength: {
                    value: 50,
                    message: "City name cannot exceed 50 characters.",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s-]+$/,
                    message:
                      "Invalid format. City name can only contain letters, spaces, or hyphens.",
                  },
                })}
                type="text"
                placeholder="City"
                className="mb-2 w-full border border-gray-300 p-2"
              />
              {errors.city && (
                <p className="mb-4 text-xs font-semibold text-red-500">
                  {errors.city.message}
                </p>
              )}
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
          {addressApiValidation === "FIX" && (
            <p className="mt-4 text-sm text-red-600">
              Could not locate provided address on the map. Please review and
              make sure it is correct.
            </p>
          )}
          {isLoading && (
            <Loader message="Processing..." color="border-t-black" />
          )}
        </div>
      </div>
    </div>
  );
};
// TODO FIX FLICKER UPON REDIRECT TO //checkout/shipping/confirmation

// TODO handle API error state in the UI

// TODO prevent DDOS etc. by disabling submit button while loading and by limiting amount submits per minute / hour / day

export default function Page() {
  const { validateShipping, addressApiValidation, shippingAddress } =
    useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: shippingAddress ?? undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const handleAddressSubmit = async (data: FormData) => {
    setIsLoading(true);
    await validateShipping(data);
    if (addressApiValidation === "FIX") {
      setIsLoading(false);
    } else {
      router.push("/checkout/shipping?step=confirmation");
      setIsLoading(false);
    }
  };

  return step === "confirmation" ? (
    <ConfirmationView />
  ) : (
    <FormView handleAddressSubmit={handleAddressSubmit} isLoading={isLoading} />
  );
}
