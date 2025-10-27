/**
 * @fileoverview Secure Pricing Map - Server-Side Product Pricing Configuration
 *
 * This file defines the authoritative source of truth for product pricing in the application.
 * All price lookups MUST occur server-side to prevent client-side price manipulation.
 *
 * SECURITY CRITICAL: This file should NEVER be imported or accessed from client components.
 * Price IDs are stored in environment variables to enable environment-specific configurations
 * (development, staging, production) without code changes.
 *
 * @module lib/pricing
 */

/**
 * @typedef {Object} ProductPriceMapping
 * @property {string} priceId - The Stripe Price ID (from environment variables)
 * @property {string} name - Human-readable product name for error messages and logging
 * @property {number} unitAmount - Price in smallest currency unit (cents) for validation
 *
 * @example
 * {
 *   priceId: process.env.STRIPE_PRICE_BASIC_PLAN,
 *   name: 'Basic Plan',
 *   unitAmount: 999 // $9.99
 * }
 */

/**
 * PRODUCT_MAP - Secure mapping of internal product IDs to Stripe Price IDs
 *
 * This constant object serves as the single source of truth for product pricing.
 * Each key represents an internal product identifier used throughout the application.
 * Each value contains the corresponding Stripe Price ID loaded from environment variables.
 *
 * STRUCTURE REQUIREMENTS:
 * - Keys: Internal product IDs (e.g., 'prod_001', 'basic-plan', 'premium-subscription')
 * - Values: Objects conforming to ProductPriceMapping typedef
 *
 * ENVIRONMENT VARIABLE NAMING CONVENTION:
 * - Use STRIPE_PRICE_* prefix for all Stripe Price IDs
 * - Example: process.env.STRIPE_PRICE_BASIC_PLAN
 * - Example: process.env.STRIPE_PRICE_PREMIUM_PLAN
 * - Example: process.env.STRIPE_PRICE_ENTERPRISE_PLAN
 *
 * VALIDATION REQUIREMENTS:
 * - All environment variables MUST be defined at runtime
 * - Missing environment variables should cause application startup failure
 * - Consider using a validation function to check all required env vars on initialization
 *
 * EXAMPLE STRUCTURE:
 * const PRODUCT_MAP = {
 *   'basic-plan': {
 *     priceId: process.env.STRIPE_PRICE_BASIC_PLAN,
 *     name: 'Basic Plan',
 *     unitAmount: 999
 *   },
 *   'premium-plan': {
 *     priceId: process.env.STRIPE_PRICE_PREMIUM_PLAN,
 *     name: 'Premium Plan',
 *     unitAmount: 1999
 *   }
 * }
 *
 * @const {Object.<string, ProductPriceMapping>}
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - The internal product ID matching keys in PRODUCT_MAP
 * @property {number} quantity - The quantity of this product (must be positive integer)
 *
 * @example
 * {
 *   id: 'basic-plan',
 *   quantity: 2
 * }
 */

/**
 * @typedef {Object} StripeLineItem
 * @property {string} price - The Stripe Price ID from PRODUCT_MAP
 * @property {number} quantity - The validated quantity from the cart item
 *
 * This is the format required by Stripe's checkout.sessions.create API
 *
 * @example
 * {
 *   price: 'price_1ABC123xyz',
 *   quantity: 2
 * }
 */

/**
 * getLineItemsFromCart - Secure server-side transformation of cart to Stripe line items
 *
 * PURPOSE:
 * This function is the CRITICAL security boundary between untrusted client data
 * and trusted Stripe API calls. It transforms client-provided cart items into
 * validated Stripe line items by performing secure lookups against PRODUCT_MAP.
 *
 * SECURITY REQUIREMENTS:
 * 1. NEVER trust client-provided prices - always lookup from server-side PRODUCT_MAP
 * 2. Validate that every product ID exists in PRODUCT_MAP
 * 3. Validate that quantities are positive integers
 * 4. Throw specific, actionable errors for invalid inputs
 * 5. Log validation failures for security monitoring
 *
 * FUNCTION SIGNATURE:
 * @param {CartItem[]} cart - Array of cart items from client (UNTRUSTED INPUT)
 * @returns {StripeLineItem[]} - Validated array of Stripe line items ready for API
 * @throws {Error} When product ID not found in PRODUCT_MAP
 * @throws {Error} When quantity is invalid (not a positive integer)
 *
 * VALIDATION LOGIC REQUIREMENTS:
 *
 * 1. PRODUCT ID VALIDATION:
 *    - For each cart item, check if item.id exists as a key in PRODUCT_MAP
 *    - If NOT found, throw Error with message:
 *      "Invalid product ID: {id}. Product not found in pricing catalog."
 *    - This prevents attackers from injecting arbitrary product IDs
 *
 * 2. QUANTITY VALIDATION:
 *    - Verify quantity is a number: typeof item.quantity === 'number'
 *    - Verify quantity is an integer: Number.isInteger(item.quantity)
 *    - Verify quantity is positive: item.quantity > 0
 *    - If any validation fails, throw Error with message:
 *      "Invalid quantity for product {id}: {quantity}. Must be a positive integer."
 *    - Consider adding maximum quantity limits (e.g., max 999 per item)
 *
 * 3. TRANSFORMATION LOGIC:
 *    - Map each validated cart item to Stripe line item format
 *    - Extract priceId from PRODUCT_MAP[item.id].priceId
 *    - Use validated quantity directly from cart item
 *    - Return array of objects: [{ price: priceId, quantity: validatedQuantity }]
 *
 * ERROR HANDLING STRATEGY:
 * - Use specific error messages that identify the problematic product/quantity
 * - Include the invalid value in error message for debugging
 * - Consider using custom Error types (e.g., ProductNotFoundError, InvalidQuantityError)
 * - Log errors with severity level 'warning' or 'error' for monitoring
 * - Do NOT expose internal product map structure in error messages
 *
 * PERFORMANCE CONSIDERATIONS:
 * - For large carts (>100 items), consider adding performance logging
 * - PRODUCT_MAP lookup is O(1), but validate cart length before processing
 * - Consider adding a maximum cart size limit (e.g., 100 items)
 *
 * EXAMPLE USAGE:
 * const clientCart = [
 *   { id: 'basic-plan', quantity: 1 },
 *   { id: 'premium-plan', quantity: 2 }
 * ];
 * const lineItems = getLineItemsFromCart(clientCart);
 * // Returns:
 * // [
 * //   { price: 'price_1ABC123xyz', quantity: 1 },
 * //   { price: 'price_1DEF456xyz', quantity: 2 }
 * // ]
 *
 * TESTING REQUIREMENTS:
 * - Test with valid cart items (should return valid line items)
 * - Test with invalid product ID (should throw ProductNotFoundError)
 * - Test with zero quantity (should throw InvalidQuantityError)
 * - Test with negative quantity (should throw InvalidQuantityError)
 * - Test with decimal quantity (should throw InvalidQuantityError)
 * - Test with string quantity (should throw InvalidQuantityError)
 * - Test with empty cart array (should return empty array)
 * - Test with large cart (100+ items, verify performance)
 */
