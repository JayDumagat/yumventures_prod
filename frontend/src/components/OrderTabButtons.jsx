export default function OrderTabButtons({ activeTab, setActiveTab }) {
  return (
    <div className="flex mb-4">
      <div className="flex bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-neutral-700 dark:hover:bg-neutral-600">
        <nav className="flex gap-x-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition ${
              activeTab === "all"
                ? "bg-white text-blue-600 dark:bg-neutral-800"
                : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            All Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("processing")}
            className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition ${
              activeTab === "processing"
                ? "bg-white text-blue-600 dark:bg-neutral-800"
                : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Processing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ready for pick up")}
            className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition ${
              activeTab === "ready for pick up"
                ? "bg-white text-blue-600 dark:bg-neutral-800"
                : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Ready to Pick Up
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition ${
              activeTab === "completed"
                ? "bg-white text-blue-600 dark:bg-neutral-800"
                : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Completed
          </button>
        </nav>
      </div>
    </div>
  );
}
