// REQUIREMENTS
// - user selects a method, pays, payment goes through via stripe, customer id is saved here, if customer is logged & checked checkbox then the customer id is saved to sanity cms to his user doc and only customer id
// - if customer comes back his default payment method is retrieved from stripe and used to auto-fill, along with all his other methods - if he doesn't have any methods, he can add them - and he can change the default payment method - all of this is done via requests to stripe and is stored on stripe only - sanity cms (my whole app) - only has access to stripe customer id, nothing else

// BIG CODE CHUNKS
// 1 HANDLE LOGGED IN VS GUEST
// - if !auth skip adding client stripe id and their payments methods and default payment method to clientSecret; else request customer id payment meyhods and default payment method from stripe and add them to clientSecret
// 2 SETUP STRIPE ACCORDINGLY
// - payment intent create:
// - if guest, normal payment intent create
// - setup, if stripe customer id - also pass customer id payment methods and default payment, so it ends up in the resulting client secret
// - else, if logged in - pass what's needed to create stripe customer id + enable saving payment methods
// 3 FRONTEND STRIPE COMPS & INITIALIZE
// - payments page - return CheckoutForm top lvl comp, it takes clientSecret props
// - inside CheckoutForm - return Elements top lvl provider which takes both clientSecret BUT ALSO stripePromise from loadStripe
// - enable PAYMENT METHOD SELECTION + FILL + SEND PAYMENT
// 4 HANDLE AFTER PAYMENT
// - GUEST? JUST PROCESS PAYMENT NORMALLY // IF HE CLICKS SIGN UP FROM /REVIEW PAGE -> CREATE HIS CLERK ACC -> THEN USE THAT TO CR8 CUSTOMER STRIPE ID -> ADD THAT PAYMENT'S DATA METHOD TO HIS LIST & MAKE DEFAULT -> DISPLAY CONFIRMATION TOAST
// - IF LOGGED & CHECKED 'SAVE METHOD' -> ADD METHOD TO HIS STRIPE LIST
// - IF CHECKED 'MAKE DEFAULT' -> MAKE DEFAULT @STRIPE
import CheckoutForm from "@/app/components/features/checkout/Checkout";
import { stripe } from "@/lib/stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";

const createStripeCustomer = async (userId) => {
  const { user } = await auth({ userId });
  const stripeCustomer = await stripe.customers.create({
    email: user.emailAddresses[0].emailAddress,
    metadata: {
      clerkUserId: user.id,
    },
  });
  return stripeCustomer.id;
};

const saveStripeCustomerIdToClerk = async (userId, stripeCustomerId) => {
  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      stripeCustomerId: stripeCustomer.id,
    },
  });
};

export default async function PaymentsPage() {
  const { userId } = await auth();

  const paymentIntentParams = {
    amount: 1400,
    currency: "eur",
  };

  if (userId) {
    try {
      const user = await clerkClient.users.getUser(userId);
      let stripeCustomerId = user.privateMetadata.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!stripeCustomerId) {
        const stripeCustomer = await stripe.customers.create({
          email: user.emailAddresses[0].emailAddress,
          metadata: { clerkUserId: userId },
        });
        stripeCustomerId = stripeCustomer.id;

        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { stripeCustomerId },
        });
      }

      // Associate payment with customer & enable saving methods
      paymentIntentParams.customer = stripeCustomerId;
      paymentIntentParams.setup_future_usage = "off_session"; // KEY LINE

      // Verify customer still exists in Stripe
      const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
      if (stripeCustomer.deleted) {
        throw new Error("Customer was deleted");
      }
    } catch (error) {
      console.error("Error with Stripe customer:", error);
    }
  }

  const { client_secret: clientSecret } =
    await stripe.paymentIntents.create(paymentIntentParams);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  );
}
