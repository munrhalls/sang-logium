/**
 * @fileoverview Stripe Webhook Handler - Secure Payment Event Processing
 *
 * This file implements the server-side webhook endpoint for processing Stripe events.
 * It is the CRITICAL component for order fulfillment and payment verification.
 *
 * WEBHOOK SECURITY ARCHITECTURE:
 * Webhooks are the ONLY reliable way to confirm payment completion in Stripe.
 * Client-side redirects can be manipulated - NEVER trust them for order fulfillment.
 * This endpoint implements the "Three Banals of Webhook Security":
 * 1. Raw Body Extraction (signature verification requires raw bytes)
 * 2. Signature Header Validation (proves request came from Stripe)
 * 3. Event Verification (confirms webhook payload is authentic)
 *
 * @module app/api/webhooks/stripe/route
 */

/**
 * @typedef {Object} StripeEvent
 * @property {string} id - Unique event identifier (evt_xxx)
 * @property {string} type - Event type (e.g., 'checkout.session.completed')
 * @property {Object} data - Event data container
 * @property {Object} data.object - The actual Stripe object (Session, PaymentIntent, etc.)
 * @property {number} created - Unix timestamp of when event occurred
 * @property {boolean} livemode - Whether event is from live mode (true) or test mode (false)
 *
 * Stripe sends webhook events as POST requests to your endpoint.
 * The event object contains all information about what happened.
 */

/**
 * @typedef {Object} CheckoutSession
 * @property {string} id - Session ID (cs_xxx)
 * @property {string} payment_status - 'paid' | 'unpaid' | 'no_payment_required'
 * @property {string} status - 'complete' | 'expired' | 'open'
 * @property {Object} metadata - Custom metadata from session creation
 * @property {string} metadata.userId - User ID from createCheckoutSession
 * @property {string} metadata.orderId - Order ID from createCheckoutSession
 * @property {string} metadata.timestamp - Checkout initiation timestamp
 * @property {string|null} customer_email - Customer's email address
 * @property {number} amount_total - Total amount charged (in cents)
 * @property {string} currency - Currency code (e.g., 'usd')
 * @property {string} payment_intent - Payment Intent ID (pi_xxx)
 *
 * This is the session object from 'checkout.session.completed' events.
 */

/**
 * POST - Stripe Webhook Event Handler
 *
 * PURPOSE:
 * This async function receives and processes webhook events from Stripe.
 * It is the authoritative source for payment confirmation and order fulfillment.
 *
 * EXECUTION CONTEXT:
 * - Next.js 15+ Route Handler (app/api/webhooks/stripe/route.js)
 * - Runs as a serverless function or Node.js API route
 * - Publicly accessible endpoint (Stripe must be able to POST to it)
 * - Must respond within 10 seconds or Stripe will retry
 *
 * ROUTE HANDLER SIGNATURE:
 * @async
 * @function POST
 * @param {Request} request - Standard Web API Request object
 * @returns {Promise<Response>} - Standard Web API Response object
 *
 * IMPLEMENTATION REQUIREMENTS:
 *
 * 1. RAW BODY EXTRACTION (BANAL #1):
 *    - Webhook signature verification requires the RAW request body (bytes)
 *    - Next.js body parsing interferes with signature verification
 *    - Extract raw body using: const rawBody = await request.text()
 *    - Store in variable: rawBody (type: string)
 *    - Do NOT use request.json() - it parses the body and breaks signatures
 *    - The raw body is the exact bytes Stripe sent, used for HMAC verification
 *
 * 2. SIGNATURE HEADER EXTRACTION (BANAL #2):
 *    - Stripe includes signature in 'stripe-signature' header
 *    - Extract using: request.headers.get('stripe-signature')
 *    - Store in variable: signature (type: string | null)
 *    - If signature is null or empty, return 400 Bad Request immediately:
 *      return new Response('Missing stripe-signature header', { status: 400 })
 *    - The signature format: t=timestamp,v1=hash,v0=legacy_hash
 *
 * 3. WEBHOOK SECRET RETRIEVAL:
 *    - Stripe webhook secret is different from API secret key
 *    - Retrieve from environment: process.env.STRIPE_WEBHOOK_SECRET
 *    - This secret is shown ONCE when you create webhook in Stripe Dashboard
 *    - Format: whsec_xxx for test mode, whsec_xxx for live mode
 *    - If missing, throw error: 'Webhook secret not configured'
 *    - Store in variable: webhookSecret
 *
 * 4. EVENT VERIFICATION (BANAL #3):
 *    - Initialize Stripe: const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
 *    - Verify webhook using: stripe.webhooks.constructEvent()
 *    - Parameters:
 *      - payload: rawBody (the raw request body string)
 *      - signature: signature (the stripe-signature header)
 *      - secret: webhookSecret (your webhook endpoint secret)
 *    - This function:
 *      - Verifies the signature is valid (prevents spoofing)
 *      - Verifies the timestamp is recent (prevents replay attacks)
 *      - Parses the JSON payload into a Stripe event object
 *    - Wrap in try-catch:
 *      - On error (invalid signature), return 400 Bad Request:
 *        return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 })
 *    - Store verified event: const event = stripe.webhooks.constructEvent(...)
 *
 * 5. EVENT TYPE ROUTING:
 *    - Extract event type: const eventType = event.type
 *    - Use switch statement to route different event types
 *    - Stripe sends many event types - handle only what you need
 *    - Common event types to handle:
 *      - 'checkout.session.completed' - Customer completed checkout
 *      - 'checkout.session.async_payment_succeeded' - Async payment succeeded (bank transfers)
 *      - 'checkout.session.async_payment_failed' - Async payment failed
 *      - 'payment_intent.succeeded' - PaymentIntent succeeded
 *      - 'payment_intent.payment_failed' - Payment failed
 *      - 'charge.refunded' - Charge was refunded
 *      - 'customer.subscription.created' - New subscription
 *      - 'customer.subscription.deleted' - Subscription cancelled
 *
 * 6. CHECKOUT.SESSION.COMPLETED HANDLER:
 *    - This is the PRIMARY event for payment confirmation
 *    - Extract session object: const session = event.data.object
 *    - Type assertion for TypeScript: session as CheckoutSession
 *
 *    CRITICAL VALIDATION CHECKS:
 *    a) Payment Status Check:
 *       - Verify session.payment_status === 'paid'
 *       - If not 'paid', log warning and return 200 OK (acknowledge but don't fulfill)
 *       - Some payment methods are asynchronous (bank transfers) - wait for async_payment_succeeded
 *
 *    b) Session Status Check:
 *       - Verify session.status === 'complete'
 *       - Only complete sessions should trigger fulfillment
 *
 *    c) Metadata Extraction:
 *       - Extract userId: const userId = session.metadata.userId
 *       - Extract orderId: const orderId = session.metadata.orderId
 *       - Extract timestamp: const checkoutTimestamp = session.metadata.timestamp
 *       - Validate all are present and non-empty
 *       - If missing, log error and return 400 Bad Request:
 *         'Missing required metadata: userId and orderId required'
 *
 * 7. DATA INTEGRITY BANAL (Order Fulfillment):
 *    - This is where you update your database to mark the order as PAID
 *    - This MUST be idempotent (safe to run multiple times)
 *    - Stripe may send the same webhook multiple times if:
 *      - Your endpoint didn't respond within 10 seconds
 *      - Your endpoint returned non-200 status
 *      - Network issues during delivery
 *
 *    IDEMPOTENT FULFILLMENT PATTERN:
 *    a) Query Database for Order:
 *       - Use orderId from metadata to find order
 *       - Example: const order = await db.orders.findUnique({ where: { id: orderId } })
 *       - If order not found, log error and return 400 Bad Request:
 *         'Order not found: {orderId}'
 *
 *    b) Verify Order Ownership:
 *       - Check order.userId === userId from metadata
 *       - If mismatch, log CRITICAL security alert and return 400:
 *         'Order user mismatch - possible fraud attempt'
 *       - This prevents attackers from paying for someone else's order with stolen payment
 *
 *    c) Check Current Order Status:
 *       - If order.status === 'PAID', log info and return 200 OK
 *       - Message: 'Order already fulfilled - duplicate webhook'
 *       - This makes the operation idempotent - safe to run multiple times
 *       - If order.status === 'CANCELLED' or 'REFUNDED', log warning and return 200
 *
 *    d) Verify Order Amount (CRITICAL SECURITY):
 *       - Compare session.amount_total with order.totalAmount
 *       - Account for currency conversion if needed
 *       - If mismatch, log CRITICAL alert and DO NOT fulfill:
 *         'Payment amount mismatch: expected {order.totalAmount}, received {session.amount_total}'
 *       - This prevents partial payment attacks
 *
 *    e) Atomic Status Update:
 *       - Update order status to 'PAID' in single database transaction
 *       - Store payment details:
 *         - stripeSessionId: session.id
 *         - stripePaymentIntentId: session.payment_intent
 *         - paidAt: new Date()
 *         - amountPaid: session.amount_total
 *         - currency: session.currency
 *       - Example:
 *         await db.orders.update({
 *           where: { id: orderId },
 *           data: {
 *             status: 'PAID',
 *             stripeSessionId: session.id,
 *             paidAt: new Date(),
 *             amountPaid: session.amount_total
 *           }
 *         })
 *
 *    f) Trigger Fulfillment Workflow:
 *       - Send order confirmation email to customer
 *       - Trigger inventory update (decrement stock)
 *       - Create shipment record (for physical goods)
 *       - Provision digital access (for subscriptions/digital goods)
 *       - Send notification to admin/fulfillment team
 *       - Log successful fulfillment for analytics
 *       - Consider using job queue for async operations (Bull, Celery)
 *
 * 8. ERROR HANDLING:
 *    - Wrap database operations in try-catch
 *    - On database error, log error and return 500 Internal Server Error
 *    - Stripe will retry webhooks that return 500
 *    - DO NOT return 500 for business logic errors (invalid order, etc.)
 *    - Return 400 for client errors (invalid data)
 *    - Return 200 for duplicate/already processed webhooks
 *
 * 9. SUCCESS RESPONSE:
 *    - After successful order update, return 200 OK
 *    - Include JSON body: { received: true, orderId: orderId }
 *    - This tells Stripe the webhook was processed successfully
 *    - Stripe will not retry webhooks that return 200
 *    - Log success with context: 'Order {orderId} fulfilled successfully'
 *
 * 10. DEFAULT CASE (Unknown Event Types):
 *     - For event types you don't handle, return 200 OK
 *     - Log: 'Unhandled event type: {eventType}'
 *     - This prevents Stripe from retrying unhandled events
 *     - You can add handlers for new event types later
 *
 * NEXT.JS ROUTE HANDLER CONFIGURATION:
 * - Export the POST function as: export async function POST(request) { ... }
 * - Export config to disable body parsing:
 *   export const config = {
 *     api: {
 *       bodyParser: false  // Required for signature verification
 *     }
 *   }
 * - For Next.js 15+ App Router, body parsing is disabled by default for route handlers
 *
 * STRIPE WEBHOOK SETUP (Dashboard Instructions):
 * 1. Go to Stripe Dashboard > Developers > Webhooks
 * 2. Click "Add endpoint"
 * 3. Enter endpoint URL: https://yourdomain.com/api/webhooks/stripe
 * 4. Select events to send:
 *    - checkout.session.completed
 *    - checkout.session.async_payment_succeeded
 *    - checkout.session.async_payment_failed
 * 5. Copy the webhook signing secret (whsec_xxx)
 * 6. Add to environment variables: STRIPE_WEBHOOK_SECRET=whsec_xxx
 * 7. Test webhook using Stripe CLI: stripe trigger checkout.session.completed
 *
 * TESTING WEBHOOK LOCALLY:
 * - Use Stripe CLI to forward webhooks to localhost:
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 * - The CLI will output a webhook secret - use it in .env.local
 * - Trigger test events: stripe trigger checkout.session.completed
 * - Verify your endpoint logs the event and updates database
 *
 * WEBHOOK RELIABILITY BEST PRACTICES:
 * - Respond quickly (within 10 seconds) or Stripe will retry
 * - Return 200 OK as soon as you receive the webhook
 * - Process heavy work (emails, etc.) asynchronously in background jobs
 * - Use database transactions for atomic updates
 * - Log all webhook events for debugging and auditing
 * - Monitor webhook delivery in Stripe Dashboard
 * - Set up alerts for repeated webhook failures
 * - Implement exponential backoff if calling external APIs
 *
 * SECURITY CHECKLIST:
 * ✓ Always verify webhook signature before processing
 * ✓ Use raw request body for signature verification
 * ✓ Validate metadata contains expected fields
 * ✓ Verify order ownership (userId match)
 * ✓ Verify payment amount matches order total
 * ✓ Check order hasn't already been fulfilled (idempotency)
 * ✓ Use HTTPS in production (Stripe requires it)
 * ✓ Keep webhook secret secure (environment variable)
 * ✓ Log security events (fraud attempts, mismatches)
 * ✓ Rate limit webhook endpoint to prevent abuse
 *
 * COMMON WEBHOOK ERRORS:
 * - "No signatures found matching the expected signature" - Wrong webhook secret
 * - "Timestamp outside the tolerance zone" - Server clock skew
 * - "Webhook signature verification failed" - Body was parsed/modified
 * - "Webhook timeout" - Endpoint took >10 seconds to respond
 * - "Webhook URL returned 500" - Database/server error during processing
 *
 * EXAMPLE EVENT FLOW:
 * 1. Customer completes payment in Stripe Checkout
 * 2. Stripe creates 'checkout.session.completed' event
 * 3. Stripe POSTs event to your webhook endpoint
 * 4. Your endpoint verifies signature
 * 5. Your endpoint extracts orderId from metadata
 * 6. Your endpoint queries database for order
 * 7. Your endpoint verifies order status is 'PENDING'
 * 8. Your endpoint updates order status to 'PAID' atomically
 * 9. Your endpoint returns 200 OK to Stripe
 * 10. Your endpoint triggers async fulfillment job
 * 11. Customer receives order confirmation email
 *
 * @example Successful Response
 * return new Response(
 *   JSON.stringify({ received: true, orderId: 'order_123' }),
 *   { status: 200, headers: { 'Content-Type': 'application/json' } }
 * )
 *
 * @example Error Response (Invalid Signature)
 * return new Response(
 *   'Webhook signature verification failed',
 *   { status: 400 }
 * )
 */
