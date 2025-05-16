import React from "react";
import usePOSStore from "../stores/usePOSStore";

export default function PosOrderSummary() {
  const { cart } = usePOSStore();
  return (
    <ul className="w-full mt-3 flex flex-col">
      <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
        <div className="flex items-center justify-between w-full">
          <span>Subtotal</span>
          <span>
            {cart
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })}
          </span>
        </div>
      </li>
      <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
        <div className="flex items-center justify-between w-full">
          <span>Total</span>
          <span>
            {cart
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })}
          </span>
        </div>
      </li>
    </ul>
  );
}
