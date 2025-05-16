import { Check } from "lucide-react";

export default function OrderDetails({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-neutral-400">
        No orders found.
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "processing":
        return "bg-indigo-500";
      case "completed":
        return "bg-gray-800";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-PH");

  const formatCurrency = (value) =>
    Number(value).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });

  // Step definitions
  const statusSteps = [
    "order placed",
    "processing",
    "ready for pick up",
    "completed",
  ];
  const stepLabels = [
    "Order placed",
    "Preparing order",
    "Ready to pick up",
    "Completed",
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {orders.map((order) => {
        const status = (order.status || "").toLowerCase();
        const currentStep = statusSteps.indexOf(status);

        return (
          <div
            key={order.id}
            className="bg-gray-100 max-w-full w-3xl shrink-0 grow flex flex-col p-2 border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          >
            <div className="bg-white rounded-lg p-4 md:p-5">
              <div className="pb-4 mb-4">
                <div className="flex justify-evenly border-b border-gray-300 rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
                  <div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                      Status
                    </p>
                    <p
                      className={`flex justify-between items-center gap-1 text-sm font-semibold text-gray-800 dark:text-white`}
                    >
                      <span
                        className={`rounded-full w-3 h-3 ${getStatusColor(
                          order.status
                        )}`}
                      />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                      Order number
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      #{order.id}
                    </p>
                  </div>
                  <div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                      Order date
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                      Total
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-xs font-medium px-1">
                  {stepLabels.map((label, idx) => {
                    // completed: idx < currentStep
                    // current: idx === currentStep
                    // upcoming: idx > currentStep
                    if (idx < currentStep) {
                      // completed
                      return (
                        <span
                          key={label}
                          className="w-full flex items-center justify-center text-gray-800 dark:text-gray-200 font-semibold"
                        >
                          <div className="flex items-center gap-x-1">
                            <Check className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                            {label}
                          </div>
                        </span>
                      );
                    } else if (idx === currentStep) {
                      // current
                      return (
                        <span
                          key={label}
                          className="w-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold"
                        >
                          <div className="flex items-center gap-x-1">
                            <span className="rounded-full w-2 h-2 bg-indigo-600 dark:bg-indigo-400" />
                            {label}
                          </div>
                        </span>
                      );
                    } else {
                      // upcoming
                      return (
                        <span
                          key={label}
                          className="w-full flex items-center justify-center text-gray-400 dark:text-neutral-600"
                        >
                          {label}
                        </span>
                      );
                    }
                  })}
                </div>
                <div className="flex items-center gap-x-1">
                  {stepLabels.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-full h-2.5 rounded-full flex flex-col justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition duration-500 ${
                        idx < currentStep
                          ? "bg-gray-800"
                          : idx === currentStep
                          ? "bg-indigo-600 dark:bg-indigo-400"
                          : "bg-gray-300 dark:bg-neutral-600"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-6 px-4 md:px-5 py-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.menuItem.image}`}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800 dark:text-white">
                      {item.menuItem.name}
                    </p>
                    <div className="flex space-x-2 text-sm text-gray-500 dark:text-neutral-400">
                      <span className="text-gray-900 font-semibold dark:text-white">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Subtotal: {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
