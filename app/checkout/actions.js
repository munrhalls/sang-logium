/**
 * Next.js Server Action responsible for securely creating a Stripe Checkout Session.
 * This function enforces the principle of server-side trust for pricing.
 */

// Add the "use server" directive at the top to mark this as a Next.js Server Action.

// Import necessary utility functions (e.g., getProductData) from lib/data/pricing.
// The import path should be "@/lib/data/pricing" to use the Next.js path alias.

// Import the Stripe SDK.
// Use the default import from the "stripe" package.

// Define the async Server Action function, createCheckoutSession, which accepts formData.
// The formData parameter will be of type FormData (standard Web API).
// The function should be exported as a named export.
// Begin a try/catch block for robust error handling.

// 1. SECURITY VALIDATION: Initialize Stripe using the secret key (process.env.STRIPE_SECRET_KEY).
// Store the Stripe instance in a constant named 'stripe'.
// Validate that STRIPE_SECRET_KEY exists before initialization.
// If missing, throw an error: "Stripe secret key is not configured"

// 2. DATA EXTRACTION: Safely extract the product ID and quantity from the formData object.
// Use formData.get('productId') to extract the product ID string.
// Use formData.get('quantity') to extract the quantity string.
// Convert the quantity to a number using parseInt or Number().
// Store extracted values in constants: productId and quantity.

// 3. INPUT VALIDATION: Validate that the quantity is a positive integer.
// Check if quantity is not a number (isNaN) or is less than 1.
// If invalid, throw an error: "Invalid quantity. Must be a positive integer"
// Also validate that productId is not null or empty string.
// If invalid, throw an error: "Product ID is required"

// 4. SECURE LOOKUP VALIDATION: Use getProductData to retrieve the secure priceId and details
// based on the extracted productId.
// Store the result in a constant named 'productData'.
// The getProductData function will throw an error if the product is not found.
// Let the error propagate naturally to the catch block.

// 5. LINE ITEMS CONSTRUCTION: Construct the required Stripe line_items array.
// The line item must use the securely retrieved Price ID and the validated quantity.
// Create an array with a single object containing:
// - price: The priceId from productData
// - quantity: The validated quantity number
// Store this in a constant named 'lineItems'.

// 6. URL CONSTRUCTION: Build the success and cancel URLs.
// Use process.env.NEXT_PUBLIC_BASE_URL as the base URL.
// Fallback to "http://localhost:3000" if not set.
// Success URL should be: "{baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}"
// Cancel URL should be: "{baseUrl}/checkout/cancel"
// Note: {CHECKOUT_SESSION_ID} is a Stripe template variable that will be replaced.

// 7. SESSION CREATION: Create the Stripe Checkout Session using stripe.checkout.sessions.create.
// Pass a configuration object with the following properties:
// - mode: Must be 'payment' (one-time payment, not subscription).
// - line_items: Must use the securely created lineItems array.
// - success_url: Must redirect to the constructed success URL.
// - cancel_url: Must redirect to the constructed cancel URL.
// - metadata: Include a unique order ID for later webhook fulfillment.
//   Generate the order ID using crypto.randomUUID().
//   Metadata object should contain: { orderId: generatedUUID }
// - automatic_tax: Set to { enabled: true } if you want Stripe to calculate tax.
// Store the created session in a constant named 'session'.

// 8. RESPONSE: Return the newly created session URL for client-side redirection.
// Return an object with two properties:
// - url: The session.url property (Stripe hosted checkout page URL)
// - error: Set to null to indicate success
// The return type should be { url: string | null, error: string | null }

// 9. ERROR HANDLING: In the catch block, log the error for debugging.
// Use console.error to log the full error object.
// Log with a prefix: "Error creating checkout session:"
// Return a JSON object with:
// - url: Set to null
// - error: The error message string (error.message or a generic message)
// Never expose sensitive error details to the client.
// Use a generic message: "Failed to create checkout session" for unknown errors.
