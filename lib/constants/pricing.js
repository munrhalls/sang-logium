/**
 * Defines the secure, centralized mapping of local product IDs to their
 * corresponding Stripe Price IDs, ensuring client-side data is never trusted.
 * The price IDs must be loaded from environment variables for security.
 */

// Define the constant object PRODUCT_DATA for secure price mapping.
// Each key is the local product ID (e.g., 'starter').
// Each object contains:
// - priceId: The required Stripe Price ID, loaded from process.env.
// - name: The descriptive name of the product.
// - price: The fixed price (for reference, though Stripe uses the Price ID).

// Define the 'starter' product mapping.
// The priceId should come from process.env.STRIPE_PRICE_ID_STARTER
// The name should be "Starter Plan"
// The price should be 999 (representing $9.99)

// Define the 'premium' product mapping.
// The priceId should come from process.env.STRIPE_PRICE_ID_PREMIUM
// The name should be "Premium Plan"
// The price should be 2999 (representing $29.99)

// Define the 'enterprise' product mapping.
// The priceId should come from process.env.STRIPE_PRICE_ID_ENTERPRISE
// The name should be "Enterprise Plan"
// The price should be 9999 (representing $99.99)

// Define a function, getProductData, that accepts a localProductId string.
// This function should securely look up and return the full product object from PRODUCT_DATA.
// First, check if the localProductId exists as a key in PRODUCT_DATA.
// If the product ID is not found, it must throw a specific error indicating invalid product data.
// The error message should be "Invalid product ID: {localProductId}"
// If found, return the complete product object including priceId, name, and price.
// Additionally, validate that the priceId is not undefined or empty string.
// If the priceId is missing, throw an error: "Price ID not configured for product: {localProductId}"
