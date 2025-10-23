import CheckoutForm from "@/app/components/features/checkout/Checkout";
import { stripe } from "@/lib/stripe";

// REQUIREMENTS
// - user selects a method, pays, payment goes through via stripe, customer id is saved here, if customer is logged & checked checkbox then the customer id is saved to sanity cms to his user doc and only customer id
// - if customer comes back his default payment method is retrieved from stripe and used to auto-fill, along with all his other methods - if he doesn't have any methods, he can add them - and he can change the default payment method - all of this is done via requests to stripe and is stored on stripe only - sanity cms (my whole app) - only has access to stripe customer id, nothing else

// BIG CHUNKS
// 1 DATA READ & ADAPT PAYMENT INTERFACE
// 2 SETUP PAYMENT INTENT /W PROMISE AND CLIENT SECRET
// 3 DISPLAY ADAPTED PAYMENT INTERFACE
// 4 WEBHOOK PROCESS AND STORE AFTER PAYMENT DATA, REDIRECT TO /REVIEW

export default async function PaymentsPage() {
  const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: calculateOrderAmount([{ id: "xl-tshirt" }]),
    currency: "eur",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return (
    <div
      id="checkout"
      className="flex min-h-screen flex-col items-center justify-center py-2"
    >
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  );
}
