import CheckoutForm from "@/app/components/features/checkout/Checkout";
import stripe from "@/lib/stripe";
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
