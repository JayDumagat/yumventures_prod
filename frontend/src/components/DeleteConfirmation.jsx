import { TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";

export default function DeleteConfirmation({ closeDialog, data, openViewDialog, title, deleteWith }) {

    const handleDelete = async () => {
        await deleteWith(data.id)
        closeDialog()
        toast.success(` ${data.name} deleted successfully`)
    }

    const goBack = () => {
        closeDialog()
        setTimeout(() => {
            openViewDialog(data)
        }, 100)
    }
  return (
    <div>
      <div className="p-4 sm:p-10 text-center overflow-y-auto">
        {/* Icon */}
        <span className="mb-4 inline-flex justify-center items-center size-15.5 rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500 dark:bg-yellow-700 dark:border-yellow-600 dark:text-yellow-100">
          <TriangleAlert className="shrink-0 size-5" />
        </span>
        {/* End Icon */}

        <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-neutral-200">
          {title || `Delete ${data?.name}`}
        </h3>
        <p className="text-gray-500 dark:text-neutral-500">
          Are you sure you would like to delete {data?.name}? This action
          cannot be undone.
        </p>

        <div className="mt-6 flex justify-center gap-x-4">
          <button
            type="button"
            onClick={handleDelete}
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => goBack()}
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
