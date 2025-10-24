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
import { clerkClient, currentUser } from "@clerk/nextjs/server";

interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata: Record<string, string>;
  customer?: string;
  setup_future_usage?: "off_session";
}

export default async function PaymentsPage() {
  // PHASE 1 & 2: HANDLE LOGGED IN VS GUEST + SETUP STRIPE ACCORDINGLY
  const user = await currentUser();

  const data: PaymentIntentData = {
    amount: 1400,
    currency: "eur",
    metadata: {},
  };

  let stripeCustomerId: string | undefined;

  // CRITICAL: Only attach customer ID if user is authenticated AND has valid session
  if (user && user.id) {
    // User is logged in - check if they have a Stripe customer ID
    stripeCustomerId = user.privateMetadata?.stripeCustomerId as
      | string
      | undefined;

    if (stripeCustomerId) {
      // Returning customer: attach customer ID only if it exists and is valid
      // Payment method saving will be handled by frontend checkbox
      data.customer = stripeCustomerId;
      data.setup_future_usage = "off_session"; // Enable payment method reusability
      data.metadata = {
        clerkUserId: user.id,
        orderType: "logged_in_returning",
      };
    } else {
      // Logged in but no Stripe customer yet: create one now
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        metadata: {
          clerkUserId: user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Save stripeCustomerId to Clerk user metadata for future visits
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(user.id, {
        privateMetadata: { stripeCustomerId },
      });

      data.customer = stripeCustomerId;
      data.setup_future_usage = "off_session"; // Enable payment method reusability
      data.metadata = {
        clerkUserId: user.id,
        stripeCustomerId,
        orderType: "logged_in_first_time",
      };
    }
  } else {
    // Guest checkout: CRITICAL - No customer parameter means no saved payment methods
    // This forces Stripe to treat this as a completely new, unauthenticated session
    data.metadata = {
      orderType: "guest",
    };
  }

  // Create PaymentIntent with appropriate configuration
  const paymentIntent = await stripe.paymentIntents.create({
    ...data,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const { client_secret: clientSecret } = paymentIntent;

  if (!clientSecret) {
    throw new Error("No client secret returned from payment intent");
  }

  // PHASE 3: FRONTEND STRIPE COMPS & INITIALIZE
  // Return CheckoutForm with clientSecret
  // CheckoutForm wraps PaymentElement in Elements provider with stripePromise
  // User can select payment method, fill details, and submit payment
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <CheckoutForm
        clientSecret={clientSecret}
        isLoggedIn={!!user}
        userEmail={user?.emailAddresses[0]?.emailAddress}
      />
    </div>
  );
}

// PHASE 4: HANDLE AFTER PAYMENT - Implementation needed:
// - GUEST: Payment processed normally
//   - Optional: If user signs up from success page, create Stripe customer ID and save payment method
// - LOGGED IN USER:
//   - If user checked "save payment method": method is saved to their Stripe customer
//   - If user checked "make default": set as default payment method in Stripe
//   - Next visit: retrieve and display saved payment methods via Stripe API
