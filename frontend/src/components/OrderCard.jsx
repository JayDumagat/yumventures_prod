import StatusBadge from "./StatusBadge";
import FormatDateTime from "../utils/DateTimeFormatter";
export default function OrderCard({
  orderNumber,
  time,
  itemCount,
  referenceNumber,
  status,
  onClick,
}) {
  return (
    <div>
      <div
        onClick={onClick}
        className="cursor-pointer flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
      >
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-gray-700 dark:text-neutral-300">
            Order #{orderNumber} / Ref: {referenceNumber}
          </span>
          <span className="text-gray-500 dark:text-neutral-500">
            {FormatDateTime(time)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-neutral-400">
            {itemCount} {itemCount > 1 ? "items" : "item"}
          </span>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
