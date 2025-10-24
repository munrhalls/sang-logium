# 🔒 STRIPE PAYMENT INTEGRATION - SECURITY AUDIT REPORT

**Date:** October 24, 2025
**Auditor:** GitHub Copilot
**Scope:** Complete Stripe payment flow across authentication states

---

## 📊 EXECUTIVE SUMMARY

**Overall Assessment:** ⚠️ **MODERATE RISK - ACTION REQUIRED**

The implementation demonstrates good security fundamentals but has **6 CRITICAL vulnerabilities** and **4 MEDIUM-SEVERITY issues** that could lead to:

- Unauthorized access to saved payment methods
- User data leakage between sessions
- Stripe Link session persistence issues
- Missing payment method persistence logic

---

## 🔴 CRITICAL VULNERABILITIES

### 1. **NO EMAIL PREFILL CONTROL FOR AUTHENTICATED USERS**

**Severity:** 🔴 HIGH
**File:** `app/components/features/checkout/Checkout.tsx` (Lines 66-71)
**Issue:** PaymentElement options do NOT include user email for authenticated users

**Current Code:**

```typescript
const paymentElementOptions = {
  layout: "accordion" as const,
  defaultValues: {
    billingDetails: {
      email: "", // ❌ ALWAYS EMPTY - even for authenticated users
    },
  },
};
```

**Problem:**

- Authenticated users have their email in Clerk session but it's not passed to Stripe
- This allows Stripe Link to potentially show saved methods from a different email
- Guest users with browser cookies could see another user's Link payment methods

**Fix Required:**

```typescript
// In CheckoutForm, pass user email as prop from server component
interface CheckoutFormProps {
  clientSecret: string;
  isLoggedIn: boolean;
  userEmail?: string; // ADD THIS
}

// In PaymentForm
const paymentElementOptions = {
  layout: "accordion" as const,
  defaultValues: {
    billingDetails: {
      email: isLoggedIn && userEmail ? userEmail : "", // Use authenticated email
    },
  },
};
```

---

### 2. **MISSING STRIPE CUSTOMER ID PERSISTENCE TO CLERK**

**Severity:** 🔴 HIGH
**File:** `app/(store)/checkout/payment/page.tsx` (Lines 72-75)
**Issue:** Stripe customer ID is created but NEVER saved back to Clerk user metadata

**Current Code:**

```typescript
// TODO: Save stripeCustomerId to Clerk user metadata
// await clerkClient.users.updateUserMetadata(user.id, {
//   privateMetadata: { stripeCustomerId }
// });
```

**Problem:**

- New authenticated users get a Stripe customer created on EVERY page visit
- Creates duplicate Stripe customers for the same user
- Payment methods saved in one session won't appear in another session
- Violates Stripe's customer deduplication best practices

**Impact:**

- User A creates customer `cus_123` on first visit, saves payment method
- User A returns, code creates NEW customer `cus_456`
- User A's saved payment method is in `cus_123` but page uses `cus_456`
- User sees no saved methods despite having saved them

**Fix Required:**

```typescript
import { clerkClient } from "@clerk/nextjs/server";

// After customer creation
const customer = await stripe.customers.create({...});
stripeCustomerId = customer.id;

// CRITICAL: Save to Clerk metadata
await clerkClient.users.updateUserMetadata(user.id, {
  privateMetadata: { stripeCustomerId }
});
```

---

### 3. **NO IDEMPOTENCY FOR STRIPE CUSTOMER CREATION**

**Severity:** 🔴 HIGH
**File:** `app/(store)/checkout/payment/page.tsx` (Lines 63-68)
**Issue:** Customer creation lacks idempotency key, risking duplicate customers

**Current Code:**

```typescript
const customer = await stripe.customers.create({
  email: user.emailAddresses[0]?.emailAddress,
  metadata: {
    clerkUserId: user.id,
  },
});
```

**Problem:**

- If page is refreshed during customer creation, multiple customers could be created
- No idempotency key to prevent duplicate API calls
- Race condition: concurrent requests could create multiple customers

**Fix Required:**

```typescript
const customer = await stripe.customers.create(
  {
    email: user.emailAddresses[0]?.emailAddress,
    metadata: {
      clerkUserId: user.id,
    },
  },
  {
    idempotencyKey: `customer_create_${user.id}`, // Prevents duplicates
  }
);
```

---

### 4. **STRIPE LINK SESSION NOT PROPERLY ISOLATED**

**Severity:** 🔴 HIGH
**File:** `app/components/features/checkout/Checkout.tsx` (Lines 119-123)
**Issue:** Elements component doesn't explicitly control Link session email

**Current Code:**

```typescript
const options: StripeElementsOptions = {
  clientSecret,
  appearance,
  // ❌ MISSING: No control over Link email binding
};
```

**Problem:**

- Stripe Link uses browser storage to persist email/session
- Even with logout clearing localStorage, Link might use HTTP cookies
- No explicit `customerSessionClientSecret` to isolate customer sessions
- PaymentElement may still show Link autofill from browser cache

**Stripe Link Behavior:**

- If guest user previously used email `user@example.com` with Link
- Link cookies persist that email association
- Next guest checkout on same browser might auto-show that email's saved methods
- This happens EVEN IF backend omits `customer` parameter

**Fix Required:**

```typescript
const options: StripeElementsOptions = {
  clientSecret,
  appearance,
  // For authenticated users with customer ID, create customer session
  ...(isLoggedIn &&
    userEmail && {
      customerOptions: {
        customer: customerId, // From PaymentIntent
        ephemeralKey: ephemeralKeySecret, // Create ephemeral key server-side
      },
    }),
};
```

**Additional Backend Change:**
For authenticated users, create ephemeral key:

```typescript
const ephemeralKey = await stripe.ephemeralKeys.create(
  { customer: stripeCustomerId },
  { apiVersion: "2024-10-28.acacia" }
);
```

---

### 5. **NO VALIDATION OF EXISTING STRIPE CUSTOMER**

**Severity:** 🟡 MEDIUM
**File:** `app/(store)/checkout/payment/page.tsx` (Lines 52-60)
**Issue:** Code trusts Clerk metadata without validating customer exists in Stripe

**Current Code:**

```typescript
if (stripeCustomerId) {
  // Returning customer: attach customer ID only if it exists and is valid
  // ❌ NO VALIDATION - customer might be deleted in Stripe
  data.customer = stripeCustomerId;
}
```

**Problem:**

- Customer could be deleted in Stripe dashboard but still in Clerk metadata
- Stripe API will reject PaymentIntent with non-existent customer ID
- No error handling for invalid customer IDs

**Fix Required:**

```typescript
if (stripeCustomerId) {
  try {
    // Validate customer exists in Stripe
    await stripe.customers.retrieve(stripeCustomerId);
    data.customer = stripeCustomerId;
  } catch (error) {
    // Customer deleted or invalid - create new one
    console.warn(`Invalid customer ID ${stripeCustomerId}, creating new one`);
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress,
      metadata: { clerkUserId: user.id },
    });
    stripeCustomerId = customer.id;
    // Update Clerk metadata with new ID
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: { stripeCustomerId },
    });
    data.customer = stripeCustomerId;
  }
}
```

---

### 6. **SETUP_FUTURE_USAGE NOT SET FOR PAYMENT METHOD SAVING**

**Severity:** 🔴 HIGH
**File:** `app/(store)/checkout/payment/page.tsx` (Lines 94-98)
**Issue:** PaymentIntent lacks `setup_future_usage` parameter for authenticated users

**Current Code:**

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  ...data, // data.setup_future_usage is defined in interface but NEVER SET
  automatic_payment_methods: {
    enabled: true,
  },
});
```

**Problem:**

- `allow_redisplay: "always"` in frontend is NOT sufficient alone
- Backend must set `setup_future_usage: "off_session"` to authorize saving
- Without this, Stripe may NOT save the payment method even if user checks the box
- Payment methods might save but not be reusable for future charges

**Current Flow (BROKEN):**

1. User checks "save payment method" checkbox → `allow_redisplay: "always"` sent
2. Backend creates PaymentIntent WITHOUT `setup_future_usage`
3. Stripe saves payment method but marks it as NOT reusable for future charges
4. Next visit: payment methods appear but can't be charged without user present

**Fix Required:**

```typescript
// For authenticated users who might want to save
if (user && user.id) {
  data.customer = stripeCustomerId;
  data.setup_future_usage = "off_session"; // CRITICAL: Authorize future use
  data.metadata = {
    clerkUserId: user.id,
    orderType: stripeCustomerId
      ? "logged_in_returning"
      : "logged_in_first_time",
  };
}
```

**Note:** The interface defines `setup_future_usage?: "off_session"` (line 31) but it's NEVER assigned!

---

## 🟡 MEDIUM SEVERITY ISSUES

### 7. **STORAGE CLEARING IS TOO BROAD**

**Severity:** 🟡 MEDIUM
**File:** `app/components/features/auth/AuthMenu.tsx` (Lines 18-27)
**Issue:** Clearing all keys containing "stripe" or "Link" is risky

**Current Code:**

```typescript
Object.keys(localStorage).forEach((key) => {
  if (key.startsWith("stripe") || key.includes("Link")) {
    localStorage.removeItem(key);
  }
});
```

**Problems:**

- Too broad: might clear unrelated keys (e.g., "LinkedInAuth", "StripedBackground")
- No consideration for Stripe cookies (only clears localStorage/sessionStorage)
- Stripe Link also uses IndexedDB which is NOT cleared

**Better Approach:**

```typescript
// More specific key patterns
const stripeKeyPatterns = [
  /^stripe\./, // stripe.com cookies
  /^__stripe_/, // Stripe SDK keys
  /^stripe-js-/, // Stripe.js cache
  /^link\./, // Link-specific
];

Object.keys(localStorage).forEach((key) => {
  if (stripeKeyPatterns.some((pattern) => pattern.test(key))) {
    localStorage.removeItem(key);
  }
});

// Also clear IndexedDB
const deleteIndexedDB = indexedDB.deleteDatabase("stripe");
```

---

### 8. **NO ERROR BOUNDARY FOR PAYMENT COMPONENT**

**Severity:** 🟡 MEDIUM
**File:** `app/components/features/checkout/Checkout.tsx`
**Issue:** Payment errors could crash entire checkout page

**Problem:**

- Stripe Elements errors not wrapped in error boundary
- If `loadStripe()` fails, entire page breaks
- No fallback UI for Stripe initialization failures

**Fix Required:**
Create error boundary wrapper:

```typescript
// app/components/features/checkout/PaymentErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

export class PaymentErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2>Payment system unavailable</h2>
          <p>Please try again or contact support</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### 9. **WEBHOOK HANDLER NOT SAVING PAYMENT METHODS**

**Severity:** 🟡 MEDIUM
**File:** `app/api/webhooks/stripe/route.ts` (Lines 30-36)
**Issue:** `payment_intent.succeeded` webhook does nothing with payment data

**Current Code:**

```typescript
case "payment_intent.succeeded":
  data = event.data.object;
  console.log(`Payment status: ${data.status}`); // ❌ Only logs, no action
  break;
```

**Problem:**

- Payment succeeds but no order is created in database
- No confirmation email sent
- No inventory update
- Payment method saved to Stripe but not reflected in app database

**Fix Required:**

```typescript
case "payment_intent.succeeded":
  data = event.data.object;

  // Extract metadata
  const { clerkUserId, orderType } = data.metadata;

  // Save order to database
  await saveOrder({
    paymentIntentId: data.id,
    amount: data.amount,
    currency: data.currency,
    userId: clerkUserId,
    status: 'completed',
  });

  // If first-time user with saved payment method
  if (orderType === "logged_in_first_time" && data.payment_method) {
    // Update user's default payment method
    await stripe.customers.update(data.customer, {
      invoice_settings: {
        default_payment_method: data.payment_method,
      },
    });
  }

  break;
```

---

### 10. **SUCCESS PAGE DOESN'T VERIFY PAYMENT**

**Severity:** 🟡 MEDIUM
**File:** `app/(store)/checkout/success/page.tsx` (Lines 20-32)
**Issue:** Success page trusts URL parameters without verification

**Current Code:**

```typescript
const paymentIntent = searchParams.get("payment_intent");
const redirectStatus = searchParams.get("redirect_status");

if (redirectStatus === "succeeded") {
  setStatus("success"); // ❌ Trusts client-side parameter
}
```

**Problem:**

- URL parameters can be manipulated by user
- No server-side verification of payment status
- User could manually navigate to `/checkout/success?redirect_status=succeeded`
- No check that payment actually succeeded in Stripe

**Fix Required:**

```typescript
// Create API route to verify payment
// app/api/verify-payment/route.ts
export async function POST(req: Request) {
  const { paymentIntentId } = await req.json();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  return Response.json({
    status: paymentIntent.status,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });
}

// In success page, verify server-side
useEffect(() => {
  if (paymentIntent) {
    fetch("/api/verify-payment", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId: paymentIntent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "succeeded") {
          setStatus("success");
        }
      });
  }
}, [paymentIntent]);
```

---

## ✅ SECURITY STRENGTHS

### What's Working Well:

1. ✅ **Server-Side Payment Intent Creation**
   - PaymentIntent correctly created server-side (not exposed to client)
   - Secret keys never exposed to frontend

2. ✅ **Clerk Authentication Integration**
   - Proper use of `currentUser()` server-side function
   - Session validation before customer ID attachment

3. ✅ **Guest Checkout Isolation**
   - Guest users correctly get PaymentIntent without `customer` parameter
   - Metadata tracking for order types (`guest`, `logged_in_returning`)

4. ✅ **Client Secret Handling**
   - Client secret properly passed through server component props
   - No client-side generation of secrets

5. ✅ **Stripe Elements Best Practices**
   - Using official `@stripe/react-stripe-js` components
   - Elements provider properly wrapping PaymentElement

6. ✅ **Logout Session Clearing Attempt**
   - Recognizes need to clear Stripe data on logout
   - Implements localStorage/sessionStorage clearing

---

## 📋 AUDIT FINDINGS BY USER STATE

### State 1: Guest User (Not Logged In)

| Criterion                       | Status     | Finding                                                                  |
| ------------------------------- | ---------- | ------------------------------------------------------------------------ |
| No customer ID in PaymentIntent | ✅ PASS    | Line 89: `data.customer` correctly omitted                               |
| No `setup_future_usage`         | ✅ PASS    | Field not set for guests                                                 |
| Link suppression                | 🔴 FAIL    | No explicit Link email control - could show cached Link methods          |
| Email prefill disabled          | ⚠️ PARTIAL | Email hardcoded to `""` (line 68) but should explicitly check auth state |

**Vulnerabilities:**

- Guest on shared computer might see previous user's Link saved methods
- No IndexedDB clearing means Link session could persist across logouts

---

### State 2: Authenticated User (New - No Stripe Customer)

| Criterion                  | Status  | Finding                                                     |
| -------------------------- | ------- | ----------------------------------------------------------- |
| Customer creation          | ✅ PASS | Lines 63-68: Customer created with Clerk email and metadata |
| Customer ID saved to Clerk | 🔴 FAIL | Lines 72-75: TODO comment - NOT IMPLEMENTED                 |
| Idempotency key            | 🔴 FAIL | No idempotency key for customer creation                    |
| `setup_future_usage` set   | 🔴 FAIL | Not set despite interface definition                        |
| Email prefilled            | 🔴 FAIL | User email not passed to PaymentElement                     |

**Critical Issues:**

- Duplicate customers created on page refresh
- Payment methods saved but not reusable for future off-session charges
- User's own email not prefilled, allowing Link confusion

---

### State 3: Authenticated User (Existing Stripe Customer)

| Criterion                | Status             | Finding                                             |
| ------------------------ | ------------------ | --------------------------------------------------- |
| Customer ID included     | ✅ PASS            | Line 58: `data.customer = stripeCustomerId`         |
| Customer validation      | 🔴 FAIL            | No check if customer still exists in Stripe         |
| Saved methods displayed  | ⚠️ PARTIAL         | Will show IF customer ID is valid, but see Issue #2 |
| `setup_future_usage` set | 🔴 FAIL            | Not set for new payment method saves                |
| Default method handling  | ❌ NOT IMPLEMENTED | No code to set/retrieve default payment method      |

**Critical Issues:**

- Customer ID from Clerk never updated after first creation (Issue #2)
- Returning users likely see NO saved methods due to duplicate customer creation
- Deleted Stripe customers cause PaymentIntent creation failure

---

## 🎯 PRIORITY RECOMMENDATIONS

### IMMEDIATE (Before Production):

1. **Fix Customer ID Persistence** (Issue #2)
   - Uncomment and implement Clerk metadata update
   - Add idempotency key to customer creation

2. **Add `setup_future_usage`** (Issue #6)
   - Set to `"off_session"` for authenticated users
   - This is CRITICAL for payment method reusability

3. **Verify Payment on Success Page** (Issue #10)
   - Add server-side payment verification
   - Never trust client-side URL parameters

4. **Add Customer Validation** (Issue #5)
   - Check if customer exists before using ID
   - Handle deleted customer scenario

### HIGH PRIORITY (Within 1 Week):

5. **Implement Email Prefill** (Issue #1)
   - Pass user email from server component to PaymentElement
   - Explicitly bind Link to authenticated user's email

6. **Enhance Logout Clearing** (Issues #4, #7)
   - Clear IndexedDB for Stripe Link
   - Use more specific key patterns
   - Consider server-side session invalidation

7. **Complete Webhook Handler** (Issue #9)
   - Save orders to database
   - Send confirmation emails
   - Update inventory

### MEDIUM PRIORITY:

8. **Add Error Boundaries** (Issue #8)
   - Wrap payment components in error boundaries
   - Implement graceful degradation

---

## 🔍 SPECIFIC FILE/LINE ISSUES SUMMARY

| File                                            | Lines   | Issue                            | Severity    |
| ----------------------------------------------- | ------- | -------------------------------- | ----------- |
| `app/(store)/checkout/payment/page.tsx`         | 72-75   | Customer ID never saved to Clerk | 🔴 CRITICAL |
| `app/(store)/checkout/payment/page.tsx`         | 63-68   | No idempotency key               | 🔴 CRITICAL |
| `app/(store)/checkout/payment/page.tsx`         | 94-98   | Missing `setup_future_usage`     | 🔴 CRITICAL |
| `app/(store)/checkout/payment/page.tsx`         | 52-60   | No customer validation           | 🟡 MEDIUM   |
| `app/components/features/checkout/Checkout.tsx` | 66-71   | Email always empty               | 🔴 CRITICAL |
| `app/components/features/checkout/Checkout.tsx` | 119-123 | No Link session isolation        | 🔴 CRITICAL |
| `app/components/features/auth/AuthMenu.tsx`     | 18-27   | Too broad storage clearing       | 🟡 MEDIUM   |
| `app/(store)/checkout/success/page.tsx`         | 20-32   | No server-side verification      | 🟡 MEDIUM   |
| `app/api/webhooks/stripe/route.ts`              | 30-36   | Webhook does nothing             | 🟡 MEDIUM   |

---

## 📊 RISK ASSESSMENT

### Likelihood of Exploitation:

- **High:** Issues #2, #6 (affecting all users)
- **Medium:** Issues #1, #4, #5 (specific scenarios)
- **Low:** Issues #7, #8, #9, #10 (edge cases)

### Impact if Exploited:

- **Critical:** Payment method leakage between users (Issue #4)
- **High:** Saved methods not working (Issues #2, #6)
- **Medium:** UX degradation, customer confusion (Issues #1, #5)
- **Low:** System errors, missing features (Issues #8, #9, #10)

### Overall Risk Score: **7.5/10** (High Risk)

---

## ✅ CONCLUSION

The implementation has **solid architectural foundations** but requires **immediate fixes** before production deployment. The three most critical issues are:

1. **Stripe Customer IDs are never persisted** → Users can't actually use saved payment methods
2. **`setup_future_usage` is missing** → Saved methods aren't reusable for future charges
3. **No email binding to PaymentElement** → Link sessions can leak between users

**Recommendation:** ⛔ **DO NOT DEPLOY TO PRODUCTION** until Issues #1, #2, and #6 are resolved.

---

**End of Audit Report**
