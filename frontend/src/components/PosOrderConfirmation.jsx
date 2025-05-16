import {  Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import PrintableReceipt from "./PrintableReceipt";

export default function PosOrderConfirmation({ closeDialog, order, response }) {
  const navigate = useNavigate();
  const handleNavigateToOrders = () => {
      closeDialog();
      setTimeout(() => {
          navigate('/client/orders');
      }, 100);
  };
  
  const receiptRef = useRef();

  const handlePrintReceipt = () => {
      const element = receiptRef.current;
      const options = {
        margin: 10,
        filename: `receipt-order-${response.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a6", orientation: "portrait" },
    };

      html2pdf().set(options).from(element).save();
  };
  return (
    <div className="p-4 sm:p-10 text-center overflow-y-auto">
      {/* Icon */}
      <span className="mb-4 inline-flex justify-center items-center size-15.5 rounded-full border-4 border-green-50 bg-green-100 text-green-500 dark:bg-green-700 dark:border-green-600 dark:text-green-100">
        <Zap className="shrink-0 size-5" />
      </span>

      {/* Heading */}
      <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-neutral-200">
        Order Placed Successfully
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-neutral-400">
        The transaction has been completed. You can view this order in the Orders panel or print a receipt for the customer.
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-x-4">
        <button
          type="button"
          onClick={() => handleNavigateToOrders()}
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          View in Orders
        </button>
        <button
          type="button"
          onClick={handlePrintReceipt}
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          Print Receipt
        </button>
      </div>
      <div style={{ display: "none" }}>
      <PrintableReceipt ref={receiptRef} order={order} response={response} />
      </div>
    </div>
  );
}
