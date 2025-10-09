import Modal from "@/app/components/ui/modal/Modal";

export default function Page() {
  console.log("MODAL RENDERED");
  return (
    <Modal>
      <div className="z-50 fixed top-0 right-0 bottom-0 w-3/4 bg-green-900 h-80  p-8">
        <h1 className="text-white font-black bg-black">
          INTERCEPTED ACCOUNT PAGE 2
        </h1>
      </div>
    </Modal>
  );
}
