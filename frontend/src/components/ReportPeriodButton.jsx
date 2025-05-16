import useStatStore from "../stores/useStatStore";

export default function ReportPeriodButtons() {
  const {type, changeReportType} = useStatStore()

  return (
    <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto flex flex-row items-center justify-end">
      <div className="flex mb-4">
        <div className="flex bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-neutral-700 dark:hover:bg-neutral-600">
          <nav className="flex gap-x-1">
            <button
              type="button"
              onClick={() => changeReportType("Today")}
              className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition
                ${
                  type === "Today"
                    ? "bg-white text-blue-600 dark:bg-neutral-800"
                    : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
                }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => changeReportType("ThisWeek")}
              className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition
                ${
                  type === "ThisWeek"
                    ? "bg-white text-blue-600 dark:bg-neutral-800"
                    : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
                }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => changeReportType("ThisMonth")}
              className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition
                ${
                  type === "ThisMonth"
                    ? "bg-white text-blue-600 dark:bg-neutral-800"
                    : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
                }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => changeReportType("ThisYear")}
              className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition
                ${
                  type === "ThisYear"
                    ? "bg-white text-blue-600 dark:bg-neutral-800"
                    : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
                }`}
            >
              This Year
            </button>
            <button
              type="button"
              onClick={() => changeReportType("Last3Years")}
              className={`py-1.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg transition
                ${
                  type === "Last3Years"
                    ? "bg-white text-blue-600 dark:bg-neutral-800"
                    : "bg-transparent text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-white"
                }`}
            >
              Last 3 Years
            </button>
          </nav>
        </div>
      </div>

      
    </div>
  );
}
