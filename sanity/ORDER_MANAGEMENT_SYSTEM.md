Granular Finite State Machine (FSM). Literally, every single thing that can physically happen with the physical order - it is represented entirely in on 'status' field by a long list of ENUMS.

It's simplest possible.

Phase 1: The Money (Genesis)
CREATED_UNPAID: User exists, Cart exists. No money yet.

PAYMENT_FAILED: Card declined. User retrying.

PAID_CONFIRMED: Money in bank. Ready for warehouse.

Phase 2: The Warehouse (The Forward Pipe)
TO_PACK: The standard state. Visible in "Active Duty" queue.

PACKING_LOCKED: A worker has opened it. (Prevents double-packing).

PACKED_LABEL_GENERATED: Box is sealed, label is on. Waiting for truck.

SHIPPED_IN_TRANSIT: Scanned by carrier.

DELIVERED_SUCCESS: End of line (Happy Path).

Phase 3: The Exceptions (The Holds)
HOLD_INVENTORY_MISSING: Packer couldn't find item.

HOLD_ADDRESS_INVALID: API rejected the address.

HOLD_WAITING_CUSTOMER_CHOICE: We emailed them: "Ship partial or cancel?"

HOLD_WAITING_PAYMENT_BALANCE: They changed the order, now owe $5 more.

Phase 4: The Cancellation (The Backward Pipe)
This is where your insight shines. "Cancelled" is a process, not a state.

CANCELLED_PENDING_UNPACK: Manager clicked cancel, but the box is physically sitting on the packing table. Worker Task: "Open box, put items on shelf."

CANCELLED_RESTOCKED: Worker confirmed items are back on shelf. Inventory +1. (Dead State).

REFUNDED_NO_RESTOCK: Cancelled before it was ever touched. (Dead State).

Phase 5: The Returns (Post-Delivery)
RETURN_REQUESTED: Label sent to customer.

RETURN_RECEIVED_PENDING_INSPECTION: Box arrived at warehouse.

RETURNED_RESTOCKED: Item good. Inventory +1.

RETURNED_DISCARDED

# branch control

// The "Unpack" Protocol
if (status === 'CANCELLED_PENDING_UNPACK') {
// 1. Show in "Restock Queue" (Not Packing Queue)
// 2. UI says: "OPEN ORDER #123 AND PUT ITEMS BACK"
// 3. Worker scans items to confirm restock.
// 4. System auto-transitions to -> CANCELLED_RESTOCKED
}

The History Log (or Audit Trail) is a strictly append-only list that remembers the "Story" of the order.

History log:
The Schema:

TypeScript

// Inside your Order Document
{
// ... other fields
status: 'HOLD_INVENTORY_MISSING', // The Current Truth

// The History Log
timeline: [
{
timestamp: '2025-12-21T10:00:00Z',
status: 'PACKING_LOCKED',
actor: 'worker_bob',
note: 'Locked for packing'
},
{
timestamp: '2025-12-21T10:05:00Z',
status: 'HOLD_INVENTORY_MISSING',
actor: 'worker_bob',
note: 'Could not find Red Socks'
}
]
}

Phase 1: The Warehouse (Your Control)

TO_PACK (Queue)

PACKING_LOCKED (Worker is checking items. Button is grey).

PACKED_READY_FOR_PICKUP (Label printed. Box is waiting on the dock).

Phase 2: The Carrier (API Control)

SHIPPED_IN_TRANSIT (Carrier scanned it).

DELIVERED (Final "Happy" State).

DELIVERY_FAILED (Lost/Return to Sender).

Phase 3: The Aftermath (Customer Control)

COMPLETED (Auto-set after 14 days if no complaints).

DISPUTE_OPEN (Customer reported Damaged/Overtime).

RETURNED\_... (The Reverse Logistics flow).

Why this is better: It maps 1:1 to reality. The Packer controls the checklist. The Carrier controls the movement. The Customer controls the dispute.
