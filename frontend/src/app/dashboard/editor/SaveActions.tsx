interface SaveActionsProps {
  loading: boolean;
  onSave: () => void;
  onSaveAndAddAnother: () => void;
  onSaveAndContinue: () => void;
}

export default function SaveActions({ loading, onSave, onSaveAndAddAnother, onSaveAndContinue }: SaveActionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xs ml-auto sticky top-8">
      <button
        type="button"
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition disabled:opacity-50"
        onClick={onSave}
        disabled={loading}
      >
        Save
      </button>
      <button
        type="button"
        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition disabled:opacity-50"
        onClick={onSaveAndAddAnother}
        disabled={loading}
      >
        Save and add another
      </button>
      <button
        type="button"
        className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
        onClick={onSaveAndContinue}
        disabled={loading}
      >
        Save and continue editing
      </button>
    </div>
  );
}
