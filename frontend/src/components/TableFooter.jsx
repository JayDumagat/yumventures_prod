import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function TableFooter({
  value, 
  onChange, 
  prev, 
  next, 
  disablePrev = false,
  disableNext = false
}) {
  return (
    <div>
      {/* Footer */}
      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
        <div className="max-w-sm space-y-3">
          <select value={value} onChange={onChange} className="py-2 px-3 pe-9 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
          {[5, 10, 15].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          </select>
        </div>

        <div className="flex items-center gap-x-2">
        
          
          <div className="inline-flex gap-x-2">
            <button
              onClick={prev}
              disabled={disablePrev}
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <ChevronLeft className="shrink-0 size-4" />
              Prev
            </button>

            <button
              onClick={next}
              disabled={disableNext}
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              Next
              <ChevronRight className="shrink-0 size-4" />
            </button>
          </div>
        </div>
      </div>
      {/* End Footer */}
    </div>
  );
}
