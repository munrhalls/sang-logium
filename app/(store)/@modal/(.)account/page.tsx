import Modal from "@/app/components/ui/modal/Modal";
import AccountDrawer from "@/app/components/features/account-drawer/AccountDrawer";

export default function Page() {
  console.log("MODAL RENDERED");
  return (
    <Modal>
      <AccountDrawer />
    </Modal>
  );
}
