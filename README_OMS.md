ORDERS MANAGEMENT SYSTEM (OMS)

# HOW DOES THIS FEATURE RELATE TO BUSINESS PROBLEM?

A lot can go wrong with any order:

- missing items
- damaged items
- wrong items
- packer employees stealing with no consequence
- charging wrong amount of money for an order
- failing to communicate order updates to customer via e-mail/user account
- failing to respond to customer choices/questions
- inefficient process of packing
- lack of synchronization between buying shipping label and packing an order
- errors handling returns -> losing inventory
- errors handling money on returns -> damaging brand, lawsuits
- errors re-stocking -> losing inventory
- errors handling timeline -> losing track of orders -> desorganization

In short: it's easy for things to spiral out into total chaos, damaging brand, losing money and going out of business. If payments are the "lungs" of the system that pour oxygen of money in, this feature is the "heart" that pumps exchange oxygen - the orders - out to the client "cells".

Goal: > 90% orders result in successful delivery, 10% of exceptions result in properly handled return or refund

# HOW DOES THIS FEATURE SOLVE THE BUSINESS PROBLEM?

### What's actually needed:

- possibilities containment
- that means organizing possibilities space such that there are no "leaks" - there is no possibility left for any order issue to not be accounted for

## Central idea:

- use finite state machine with pre-determined, allowed state transitions that any order can go through
- that includes two pathways:
- STANDARD and EXCEPTION
- the finite state machine is operated by two UI's
  -- packer UI and manager UI
  -- STANDARD PATH: order goes only through STANDARD state transitions all the way to final state, which represents successful delivery
  -- EXCEPTION PATH: order goes through EXCEPTION state transitions all the way to either CANCELLED or REFUNDED or RETURNED state

- both UI's can only trigger allowed pre-determined state transition of the order
- state transition is accompanied (but de-coupled from) events of handling the order, which are:
  -- updating inventory
  -- sending e-mail/user account notification
  -- putting an order on hold, to wait for manager/customer decision
  -- returning money
  -- re-stocking
  -- printing shipping
