import { useCheckout } from "@/app/(store)/checkout/layout";

const DisplayAddress = function () {
  const { shippingAddress } = useCheckout();
  //   const shippingAddress: ShippingAddress = {
  //     regionCode: "EN",
  //     postalCode: "EC1Y 8SY",
  //     street: "Featherstone Street",
  //     streetNumber: "49",
  //     city: "LONDON",
  //   };

  const countryMap: Record<string, string> = {
    EN: "England",
    PL: "Poland",
  };
  const countryName = countryMap[shippingAddress.regionCode];

  return (
    <div className="max-w-[325px] rounded-lg border-2 border-gray-800 bg-slate-100 p-6">
      <h2 className="text-lg font-bold">Your Shipping Address</h2>{" "}
      <p>{shippingAddress.postalCode}</p>
      <div className="flex gap-2">
        <p>{shippingAddress.street}</p>
        <p>{shippingAddress.streetNumber}</p>
      </div>
      <p>{shippingAddress.city}</p>
      <p>{countryName}</p>
    </div>
  );
};

export default DisplayAddress;
