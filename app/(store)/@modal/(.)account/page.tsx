import Modal from "@/app/components/ui/modal/Modal";

export default function Page() {
  console.log("MODAL RENDERED");
  return (
    <Modal>
      <div className="fixed inset-10 bg-white h-80 w-full p-8">
        <h1>INTERCEPTED ACCOUNT PAGE 2</h1>
      </div>
    </Modal>
  );
}
