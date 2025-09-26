import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioHeader({ user = { name: "Admin" }, onBack }: { user?: { name: string }, onBack?: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setShowModal(true);
    }
  };

  // These handlers can be passed down or replaced as needed
  const handleDiscard = () => {
    setShowModal(false);
    router.push("/dashboard/editor");
  };
  const handleSaveAndBack = () => {
    setShowModal(false);
    // Ideally, trigger save logic here, then navigate
    // For now, just navigate
    router.push("/dashboard/editor");
  };

  return (
    <header className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-200 shadow-sm mb-10">
      <div className="flex items-center gap-6">
        <button
          className="mr-4 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-medium shadow-sm transition-all"
          onClick={handleBack}
        >
          &larr; Back
        </button>
        <Image src="/digno-logo.svg" alt="Digno Logo" width={96} height={48} />
        <span className="font-roboto text-2xl font-regular text-secondary">Studio</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="inline-block w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-700 border border-gray-300">
          {user.name[0]}
        </span>
        <span className="hidden md:inline text-base font-medium text-gray-700">{user.name}</span>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-6 text-gray-600">Do you want to leave this page?</p>
            <div className="flex flex-col gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-medium"
                onClick={handleDiscard}
              >
                Yes, don't save draft
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark font-medium"
                onClick={handleSaveAndBack}
              >
                Yes, save draft
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium mt-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
