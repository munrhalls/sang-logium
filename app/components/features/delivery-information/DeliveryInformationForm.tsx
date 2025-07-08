import AddressForm from "./AddressForm";
import ContactInformationForm from "./ContactInformationForm";
export default function DeliveryInformation() {
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
        Delivery Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Address</h3>
          <AddressForm />
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">
            Contact Information
          </h3>
          <ContactInformationForm />
        </div>
      </div>
    </div>
  );
}
