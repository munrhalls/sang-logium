# Payment Methods Implementation Guide

## ✅ COMPLETED: Core Server Actions

**File Created:** `app/actions/paymentMethods.ts`

### Available Functions

#### 1. `getOrCreateStripeCustomer()`

- **Purpose:** Ensures user has a Stripe customer ID
- **Returns:** Stripe customer ID (e.g., `cus_...`)
- **Security:** Authenticated users only (Clerk)
- **Auto-creates:** Customer in Stripe if not exists, saves ID to Sanity

#### 2. `savePaymentMethod(paymentMethodId: string)`

- **Purpose:** Attach payment method to user's Stripe customer
- **Parameters:** Stripe payment method ID (e.g., `pm_...`)
- **Returns:** `{ success: boolean, paymentMethod: object }`
- **Features:**
  - Validates payment method ID
  - Attaches to Stripe customer
  - Stores metadata in Sanity (last4, brand, expiry)
  - Auto-sets as default if first method
  - Prevents duplicates
  - Rollback on error

#### 3. `getUserPaymentMethods()`

- **Purpose:** Get all saved payment methods for current user
- **Returns:** Array of payment method metadata
- **Data Includes:** last4, brand, expiry, isDefault flag

#### 4. `deletePaymentMethod(paymentMethodId: string)`

- **Purpose:** Remove payment method from Stripe and Sanity
- **Security:** Verifies ownership before deletion
- **Smart Default:** Auto-promotes first method if deleting default

#### 5. `setDefaultPaymentMethod(paymentMethodId: string)`

- **Purpose:** Set a specific payment method as default
- **Updates:** Both Stripe customer and Sanity
- **Security:** Validates ownership

#### 6. `getDefaultPaymentMethod()`

- **Purpose:** Get user's default payment method
- **Returns:** Default payment method object or null

#### 7. `validatePaymentMethodOwnership(paymentMethodId: string)`

- **Purpose:** Security check - verify user owns payment method
- **Use Before:** Processing payments with saved methods
- **Returns:** boolean

---

## 🔒 Security Features

✅ **Authentication Required:** All functions use Clerk `auth()`
✅ **Ownership Validation:** Verifies user owns payment methods
✅ **PCI Compliance:** Never stores actual card data
✅ **Stripe References Only:** Stores IDs like `pm_...`, `cus_...`
✅ **Error Rollback:** Auto-cleanup on failures
✅ **Input Validation:** Checks for valid Stripe ID formats

---

## 📋 Next Steps (Not Yet Implemented)

### Phase 3: Modify Checkout Flow

- [ ] Update `app/actions/checkout.ts` to support saved payment methods
- [ ] Add option to save new payment methods during checkout
- [ ] Add option to select from saved payment methods

### Phase 4: UI Components

- [ ] Create `SavedPaymentMethods.tsx` component
- [ ] Create `AddPaymentMethodModal.tsx` component
- [ ] Update checkout summary page to show payment method selection

### Phase 5: Account Management Page

- [ ] Create `/account/payment-methods` page
- [ ] List all saved payment methods
- [ ] Allow users to add/delete/set default

---

## 🧪 Testing Checklist

### Manual Testing (Once UI is built):

1. ☐ Add first payment method (should auto-set as default)
2. ☐ Add second payment method (first should remain default)
3. ☐ Set second method as default (verify update)
4. ☐ Delete non-default method (should work)
5. ☐ Delete default method with others present (should promote new default)
6. ☐ Try to save duplicate payment method (should error)
7. ☐ Try to use another user's payment method ID (should fail)

### Stripe Dashboard Verification:

1. ☐ Check customer is created in Stripe
2. ☐ Verify payment methods attached to customer
3. ☐ Confirm default payment method is set in Stripe

---

## 💡 Usage Example (Future)

```typescript
// In a checkout component
import {
  getUserPaymentMethods,
  savePaymentMethod,
} from "@/app/actions/paymentMethods";

// Get saved methods
const methods = await getUserPaymentMethods();

// Save new method (after Stripe Elements collects card)
await savePaymentMethod(stripePaymentMethodId);
```

---

## 🎯 Current Status

**Phase 2: COMPLETE** ✅
Core server actions are fully implemented and ready to use.

**Estimated Time for Remaining Phases:** ~2.5 hours

- Phase 3 (Checkout): 30 min
- Phase 4 (UI Components): 1 hour
- Phase 5 (Account Page): 1 hour

---

## 📝 Notes

- All payment method data is stored in your `userType` schema
- The `stripeCustomerId` field links your user to their Stripe customer
- Payment method metadata (last4, brand, expiry) is cached in Sanity for fast display
- Actual sensitive card data NEVER leaves Stripe's servers
- Use Stripe Elements on the frontend to collect card details securely
