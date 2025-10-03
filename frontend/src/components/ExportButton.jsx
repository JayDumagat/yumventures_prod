import React, { useState } from "react";
import useOrderStore from "../stores/useOrderStore";
import Papa from "papaparse";
import * as FileSaver from "file-saver";

const ExportButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchOrdersForExport } = useOrderStore();

  const handleExport = async (filter) => {
    try {
      setLoading(true);
      const orders = await fetchOrdersForExport(filter);

      if (!orders || orders.length === 0) {
        console.warn("No orders found for this filter");
        return;
      }

      const csv = Papa.unparse(orders);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      FileSaver.saveAs(blob, `orders_${filter}.csv`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hs-dropdown relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        {loading ? "Exporting..." : "Export"}
      </button>

	{open && (
      <div className="hs-dropdown-menu transition z-10 bg-white shadow-md rounded-lg p-2 mt-2 min-w-48 divide-y divide-gray-200">
        <div className="py-2">
          <span className="block py-2 px-3 text-xs font-medium uppercase text-gray-400">
            Select Range
          </span>

          {[
            { label: "Last 7 Days", value: "7days" },
            { label: "Last 30 Days", value: "30days" },
            { label: "This Month", value: "thisMonth" },
            { label: "All Time", value: "all" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleExport(value)}
              disabled={loading}
              className="flex w-full items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
     )}
    </div>
  );
};

export default ExportButton;

