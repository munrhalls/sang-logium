import Modal from "@/app/components/ui/modal/Modal";
import AccountDrawer from "@/app/components/features/account-drawer/AccountDrawer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Modal>
      <AccountDrawer>{children}</AccountDrawer>
    </Modal>
  );
}
