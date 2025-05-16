import { CircleAlert, CircleCheck, CookingPot, ShoppingBag } from "lucide-react";

export default function StatusBadge({ status }) {
  return (
    <>
      {status === "available" && (
        <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
          <CircleCheck className="size-2.5" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}

      {status === "unavailable" && (
        <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
          <CircleAlert className="size-2.5" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}

      {/* Status for orders*/}
      {status === "processing" && (
        <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
          <CookingPot className="size-2.5" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}

      {status === "ready for pick up" && (
        <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-500/10 dark:text-blue-500">
          <ShoppingBag className="size-2.5" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}
      {status === "completed" && (
        <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
          <CircleCheck className="size-2.5" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}
    </>
  );
}
