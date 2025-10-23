import CheckoutForm from "@/app/components/features/checkout/Checkout";
import { stripe } from "@/lib/stripe";

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
    <div id="checkout">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  );
}
