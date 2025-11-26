import { Address } from "../checkout.types";

const DisplayAddress = function ({ address }: { address: Address }) {
  const countryMap: Record<string, string> = {
    GB: "Great Britain",
    PL: "Poland",
  };
  const countryName = countryMap[address.regionCode];
  return (
    <div>
      <h2 className="mb-1 text-base font-bold">Shipping Address</h2>
      <div className="text-base leading-tight text-gray-700">
        <p className="flex gap-1">
          <span>{address.street}</span>
          <span>{address.streetNumber}</span>
        </p>
        <p className="flex gap-1">
          <span>{address.city}</span>
          <span>{address.postalCode}</span>
        </p>
        <p>{countryName}</p>
      </div>
    </div>
  );
};

export default DisplayAddress;
