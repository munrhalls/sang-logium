/**
 * @fileoverview Server-side pricing map. NEVER import in client components.
 * @module lib/pricing
 */

/**
 * @typedef {Object} ProductPriceMapping
 * @property {string} priceId - Stripe Price ID from environment variable
 * @property {string} name - Product name for error messages
 * @property {number} unitAmount - Price in cents
 */

/**
 * PRODUCT_MAP - Server-side product pricing
 *
 * Structure: { 'product-id': { priceId: process.env.STRIPE_PRICE_X, name: 'Name', unitAmount: 999 } }
 * Environment variables: STRIPE_PRICE_* (e.g., STRIPE_PRICE_BASIC_PLAN)
 * All env vars MUST be defined at runtime
 *
 * @const {Object.<string, ProductPriceMapping>}
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - Product ID matching PRODUCT_MAP keys
 * @property {number} quantity - Positive integer
 */

/**
 * @typedef {Object} StripeLineItem
 * @property {string} price - Stripe Price ID
 * @property {number} quantity - Validated quantity
 */

/**
 * getLineItemsFromCart - SECURITY BOUNDARY: Validates cart and returns Stripe line items
 *
 * @param {CartItem[]} cart - UNTRUSTED client input
 * @returns {StripeLineItem[]} - Validated line items
 * @throws {Error} "Invalid product ID: {id}. Product not found in pricing catalog."
 * @throws {Error} "Invalid quantity for product {id}: {quantity}. Must be a positive integer."
 *
 * VALIDATION LOGIC:
 * 1. Check item.id exists in PRODUCT_MAP, throw if not found
 * 2. Verify quantity: typeof === 'number', Number.isInteger(), > 0
 * 3. Map to: { price: PRODUCT_MAP[item.id].priceId, quantity: item.quantity }
 */
