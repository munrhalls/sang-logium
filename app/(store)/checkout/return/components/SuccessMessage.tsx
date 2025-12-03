import { CheckCircle } from "lucide-react";

export function SuccessMessage() {
  return (
    <>
      <div className="mb-6 flex justify-center">
        <CheckCircle className="h-20 w-20 text-green-500" />
      </div>
      <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
        Payment Successful!
      </h1>
      <p className="mb-8 text-center text-lg text-gray-600">
        Thank you for your order. We&apos;ve received your payment and are
        processing your order.
      </p>
    </>
  );
}
