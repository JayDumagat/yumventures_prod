import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrderDetails from "../components/OrderDetails";
import useOrderStore from "../stores/useOrderStore";
import useAuthStore from "../stores/useAuthStore";
import { socket } from "../lib/socket";

const statuses = ["All", "Pending", "Processing", "Completed", "Cancelled"];
const PAGE_SIZE = 5;

const Order = () => {
  const { user } = useAuthStore();
  const { orders, fetchUserOrders, appendOrder, replaceOrder } = useOrderStore();
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  useEffect(() => {
    setPage(1); // Reset to first page when filter changes
  }, [filter]);

  useEffect(() => {
    if (!user) return;

    const onAdded = (order) => {
      if (order.orderedBy === user.id) { 
        appendOrder(order);
      }
    };

    const onUpdated = (order) => {
      if (order.orderedBy === user.id) {   // 
        replaceOrder(order);
      }
    };

    socket.on("orderAdded", onAdded);
    socket.on("orderStatusUpdated", onUpdated);

    return () => {
      socket.off("orderAdded", onAdded);
      socket.off("orderStatusUpdated", onUpdated);
    };
  }, [user, appendOrder, replaceOrder]);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-6 mt-20">
        <div className="flex items-center overflow-x-auto gap-2 p-4 bg-white">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full border text-sm transition whitespace-nowrap ${
                filter === status
                  ? "border-neutral-900 text-neutral-900 font-medium"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {status}
            </button>
          ))}
          {/* Pagination controls beside statuses */}
          <div className="inline-flex gap-x-2 ml-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Prev
            </button>
            {/* New design for 1/1 */}
            <div className="inline-flex items-center gap-x-2">
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Showing:
              </p>
              <div className="max-w-sm space-y-3">
                <select
                  className="py-2 px-3 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                  value={page}
                  onChange={e => setPage(Number(e.target.value))}
                >
                  {Array.from({ length: totalPages || 1 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                of {totalPages || 1}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Next
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="w-full max-w-6xl overflow-y-auto bg-white rounded shadow p-4">
          <OrderDetails orders={paginatedOrders} />
        </div>
      </div>
    </div>
  );
};

export default Order;
