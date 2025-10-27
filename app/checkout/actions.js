/**
 * @fileoverview Stripe Checkout Session Server Action
 *
 * This file implements the server-side logic for creating secure Stripe Checkout Sessions.
 * It MUST run on the server only (Next.js Server Action or API Route).
 *
 * SECURITY ARCHITECTURE:
 * - All Stripe API calls use SECRET_KEY (never exposed to client)
 * - Cart validation occurs server-side via getLineItemsFromCart
 * - Session metadata includes order identifiers for webhook fulfillment
 * - URLs are generated server-side to prevent manipulation
 *
 * @module app/checkout/actions
 */

/**
 * @typedef {Object} CheckoutSessionResult
 * @property {string|null} url - The Stripe Checkout Session URL for client redirect, or null on error
 * @property {string|null} error - Error message if session creation failed, or null on success
 *
 * This return structure allows the client to handle both success and error cases uniformly.
 *
 * @example Success case:
 * {
 *   url: 'https://checkout.stripe.com/c/pay/cs_test_abc123...',
 *   error: null
 * }
 *
 * @example Error case:
 * {
 *   url: null,
 *   error: 'Invalid product ID: xyz. Product not found in pricing catalog.'
 * }
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - Internal product ID
 * @property {number} quantity - Product quantity
 */

/**
 * @typedef {Object} CheckoutMetadata
 * @property {string} userId - The authenticated user's unique identifier (CRITICAL for order fulfillment)
 * @property {string} orderId - The pre-created order ID in the database (enables idempotent fulfillment)
 * @property {string} timestamp - ISO timestamp of checkout initiation (for audit trails)
 * @property {string} [cartHash] - Optional hash of cart contents for integrity verification
 *
 * CRITICAL SECURITY REQUIREMENT:
 * The metadata MUST include sufficient information to:
 * 1. Identify the user/customer who initiated the payment
 * 2. Link the payment to a specific order in the database
 * 3. Prevent duplicate order fulfillment (idempotency)
 * 4. Enable audit trails and fraud detection
 *
 * WEBHOOK FULFILLMENT PATTERN:
 * When the webhook receives 'checkout.session.completed':
 * 1. Extract metadata from session.metadata
 * 2. Use orderId to query database for order status
 * 3. Verify order exists and belongs to userId
 * 4. Check order status is 'PENDING' (not already fulfilled)
 * 5. Update order status to 'PAID' atomically
 * 6. Trigger order fulfillment workflow (email, provisioning, etc.)
 */

/**
 * createCheckoutSession - Server Action to create a Stripe Checkout Session
 *
 * PURPOSE:
 * This async function is the secure gateway between the client checkout flow
 * and the Stripe Checkout API. It validates cart data, creates a payment session,
 * and returns a URL for client-side redirect.
 *
 * EXECUTION CONTEXT:
 * - Next.js 15+ Server Action (use 'use server' directive at top of file)
 * - Runs in Node.js runtime on server only
 * - Has access to environment variables and server-side modules
 * - Can perform database operations and external API calls
 *
 * FUNCTION SIGNATURE:
 * @async
 * @function createCheckoutSession
 * @param {CartItem[]} cart - Array of cart items from client (UNTRUSTED)
 * @param {string} userId - Authenticated user ID from session/auth (MUST validate)
 * @param {string} orderId - Pre-created order ID from database
 * @returns {Promise<CheckoutSessionResult>} - Session URL or error message
 *
 * IMPLEMENTATION REQUIREMENTS:
 *
 * 1. STRIPE INITIALIZATION:
 *    - Import Stripe SDK: require('stripe') or import Stripe from 'stripe'
 *    - Initialize with SECRET_KEY from environment:
 *      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
 *    - NEVER use PUBLISHABLE_KEY here (that's client-side only)
 *    - Verify STRIPE_SECRET_KEY is defined, throw if missing
 *
 * 2. INPUT VALIDATION:
 *    - Verify cart is an array with length > 0
 *    - Verify userId is a non-empty string (from authenticated session)
 *    - Verify orderId is a non-empty string (pre-created in database)
 *    - If any validation fails, return { url: null, error: 'descriptive message' }
 *
 * 3. AUTHENTICATION CHECK:
 *    - Retrieve authenticated user from request context (e.g., Clerk, NextAuth)
 *    - Verify userId parameter matches authenticated user ID
 *    - If mismatch, return { url: null, error: 'Unauthorized' }
 *    - This prevents users from creating sessions for other users' orders
 *
 * 4. SECURE LINE ITEM GENERATION:
 *    - Import getLineItemsFromCart from lib/pricing.js
 *    - Call: const lineItems = getLineItemsFromCart(cart)
 *    - Wrap in try-catch to handle validation errors:
 *      - If error thrown, return { url: null, error: error.message }
 *    - This ensures all prices come from server-side PRODUCT_MAP
 *
 * 5. URL GENERATION:
 *    - Construct success_url for post-payment redirect:
 *      `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`
 *    - The {CHECKOUT_SESSION_ID} placeholder will be replaced by Stripe
 *    - Construct cancel_url for user-cancelled payment:
 *      `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`
 *    - Ensure NEXT_PUBLIC_BASE_URL includes protocol (https://)
 *    - For local development, support http://localhost:3000
 *
 * 6. METADATA CONSTRUCTION:
 *    - Create metadata object with REQUIRED fields:
 *      {
 *        userId: userId,                           // CRITICAL: identifies the customer
 *        orderId: orderId,                         // CRITICAL: links to database order
 *        timestamp: new Date().toISOString(),      // Audit trail
 *        environment: process.env.NODE_ENV         // Track dev vs prod payments
 *      }
 *    - Optional fields to consider:
 *      - cartItemCount: cart.length
 *      - userEmail: user.email (for reconciliation)
 *      - checkoutInitiatedFrom: 'web' | 'mobile'
 *    - Stripe metadata values MUST be strings (convert numbers/booleans)
 *    - Maximum 50 keys, each key ≤ 40 chars, each value ≤ 500 chars
 *
 * 7. STRIPE SESSION CREATION:
 *    - Call stripe.checkout.sessions.create() with parameters:
 *
 *      REQUIRED PARAMETERS:
 *      - mode: 'payment'
 *        (Use 'subscription' for recurring, 'setup' for future payments)
 *
 *      - line_items: lineItems
 *        (Validated line items from getLineItemsFromCart)
 *
 *      - success_url: constructed URL with {CHECKOUT_SESSION_ID}
 *        (Where customer is redirected after successful payment)
 *
 *      - cancel_url: constructed URL
 *        (Where customer is redirected if they cancel)
 *
 *      - metadata: metadata object
 *        (CRITICAL: used by webhook to fulfill order)
 *
 *      OPTIONAL BUT RECOMMENDED PARAMETERS:
 *      - customer_email: user.email
 *        (Pre-fills email in Stripe Checkout)
 *
 *      - client_reference_id: orderId
 *        (Alternative way to track orders, appears in Stripe Dashboard)
 *
 *      - payment_intent_data: {
 *          metadata: metadata,
 *          description: `Order ${orderId} for user ${userId}`
 *        }
 *        (Passes metadata to PaymentIntent for webhook access)
 *
 *      - billing_address_collection: 'required'
 *        (Collect billing address for tax/fraud prevention)
 *
 *      - shipping_address_collection: {
 *          allowed_countries: ['US', 'CA', 'GB', ...]
 *        }
 *        (For physical goods)
 *
 *      - automatic_tax: { enabled: true }
 *        (Enable Stripe Tax if configured)
 *
 *      - expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
 *        (Session expires in 30 minutes)
 *
 *      - locale: 'auto' | 'en' | 'es' | ...
 *        (Checkout page language)
 *
 * 8. ERROR HANDLING:
 *    - Wrap stripe.checkout.sessions.create() in try-catch
 *    - Log errors with context (userId, orderId) for debugging
 *    - Return user-friendly error message:
 *      { url: null, error: 'Failed to create checkout session. Please try again.' }
 *    - Do NOT expose Stripe error details to client (security)
 *    - Consider logging to error tracking service (Sentry, DataDog)
 *
 * 9. SUCCESS RESPONSE:
 *    - Extract session.url from created session
 *    - Return { url: session.url, error: null }
 *    - The client will redirect to session.url to complete payment
 *
 * 10. DATABASE OPERATIONS (OPTIONAL):
 *     - Before creating session, update order status to 'CHECKOUT_INITIATED'
 *     - Store session.id in order record for reference
 *     - Set order expiration timestamp based on session.expires_at
 *     - This enables cleanup of abandoned checkouts
 *
 * EXAMPLE FLOW:
 * 1. Client calls createCheckoutSession(cart, userId, orderId)
 * 2. Server validates inputs and authenticates user
 * 3. Server transforms cart to secure line items
 * 4. Server creates Stripe session with metadata
 * 5. Server returns { url: 'https://checkout.stripe.com/...', error: null }
 * 6. Client redirects user to session URL
 * 7. User completes payment in Stripe Checkout
 * 8. Stripe redirects to success_url with session_id
 * 9. Stripe sends webhook 'checkout.session.completed'
 * 10. Webhook handler uses metadata to fulfill order
 *
 * TESTING REQUIREMENTS:
 * - Test with valid cart (should return session URL)
 * - Test with empty cart (should return error)
 * - Test with invalid product ID (should return error)
 * - Test with mismatched userId (should return error)
 * - Test with missing environment variables (should throw/error)
 * - Test Stripe API failure (should return error, not crash)
 * - Verify metadata is correctly attached to session
 * - Verify session URLs are correctly constructed
 *
 * SECURITY CHECKLIST:
 * ✓ Stripe SECRET_KEY never sent to client
 * ✓ Prices fetched from server-side PRODUCT_MAP only
 * ✓ User authentication verified before session creation
 * ✓ Metadata includes userId and orderId for webhook verification
 * ✓ Input validation on all parameters
 * ✓ Error messages don't expose sensitive details
 * ✓ HTTPS enforced for production URLs
 */
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
