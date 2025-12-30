# Orders Management System feature

- it triggers finite state machine changes to allowed, pre-determined next state
- each pre-determined state change is followed by pre-determined actions of handling the order, e.g. send e-mail
- actions are idempotent via inngest

# Core

- finite state machine is operated by packer UI and manager UI to change order state into next pre-determined allowed state

# Packer UI

- login/out feature
  -- login via QR code
  -- automatic log out after 5 minutes of inactivity
  -- log out mid-order equals order packer unlocked and backed to queue

- order feature
  -- any button and its associated handler function is only visible and possible to trigger if the current order state allows it
  -- enable packer id to view queue of orders
  -- enable packer id to lock in order id
  -- enable packer id to view individual order id
  -- enable packer id order items checklist pre final step
  -- enable packer id to print label as final step
  -- an order button triggers allowed pre-determined state change
  -- simultaenous same order overwrite is prevented by checking \_rev field in the order doc pre-patch
  -- two packers cannot pack same order is handled via locking an order to packer id

# Manager UI
