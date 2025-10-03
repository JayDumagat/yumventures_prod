import useOrderStore from "../stores/useOrderStore";
import { useEffect, useState } from "react";
import OrderTabButtons from "../components/OrderTabButtons";
import StatusBadge from "../components/StatusBadge";
import Layout from "../layouts/Layout";
import OrderCard from "../components/OrderCard";
import FormatDateTime from "../utils/DateTimeFormatter";
import { X } from "lucide-react";
import {toast} from "react-toastify";
import { socket } from "../lib/socket";

export default function PosOrders() {
  const { orders, fetchOrders, changeOrderStatus, appendOrder, replaceOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleChangeOrderStatus = async () => {
    if (!selectedOrder) return;

    const newStatus =
      selectedOrder.status === "processing"
        ? "ready for pick up"
        : "completed";

    await changeOrderStatus(selectedOrder.id, newStatus);
    toast.success("Order status updated successfully!");

    setSelectedOrder({
      ...selectedOrder,
      status: newStatus,
    });

    await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Socket event handlers
    const onAdded = (order) => {
      console.log('🔄 Socket: Order added event received:', order);
      appendOrder(order);
    };

    const onUpdated = (order) => {
      console.log('🔄 Socket: Order updated event received:', order);
      replaceOrder(order);
    };

    const onConnect = () => {
      console.log('✅ Socket connected');
    };

    const onDisconnect = (reason) => {
      console.log('❌ Socket disconnected:', reason);
    };

    const onError = (error) => {
      console.error('⚠️ Socket error:', error);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error', onError);
    socket.on("orderAdded", onAdded);
    socket.on("orderStatusUpdated", onUpdated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error', onError);
      socket.off("orderAdded", onAdded);
      socket.off("orderStatusUpdated", onUpdated);
    };
  }, [appendOrder, replaceOrder]);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[calc(100vh-3rem)] h-[calc(100vh-6rem)]">
        {/* Left Panel */}
        <div className="col-span-1 lg:col-span-2 overflow-y-auto pr-2 p-2">
          <OrderTabButtons activeTab={activeTab} setActiveTab={setActiveTab}/>
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  orderNumber={order.id}
                  time={order.createdAt}
                  itemCount={order.orderItems.length}
                  referenceNumber={order.referenceNumber}
                  status={order.status}
                  onClick={() => handleOpenOrderDetails(order)}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-neutral-400">
                No orders available.
              </div>
            )}
          </div>
        </div>

        {selectedOrder ? (
          <div className="h-full col-span-1 flex flex-col bg-white border border-gray-200 dark:bg-neutral-800 rounded-xl p-4 overflow-hidden">
            {/* Top Section */}
            <div className="mb-4 space-y-1 text-sm font-medium dark:text-neutral-300">
              <div className="flex justify-between">
                <span>Order #{selectedOrder.id}</span>
                <span>{FormatDateTime(selectedOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-neutral-400">
                <span>{selectedOrder.orderItems.length} {selectedOrder.orderItems.length > 1 ? (
                  "items"
                ) : (
                  "item"
                )}</span>
                <span>
                  <StatusBadge status={selectedOrder.status} />
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedOrder.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-white border border-gray-200 shadow-2xs rounded-xl p-4 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                >
                  <img
                    src={`${
                      item.menuItem?.image
                    }`}
                    alt={item.menuItem?.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-center w-full">
                    <span className="font-medium text-gray-800 dark:text-neutral-200">
                      {item.menuItem?.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400 flex items-center gap-x-1">
                      <X className=" shrink-0 size-3.5"/>{item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
             {selectedOrder.status === "processing" || selectedOrder.status === "ready for pick up" ? (
               <button
               onClick={handleChangeOrderStatus}
               type="button"
               className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
             >
               {selectedOrder.status === "processing"
                 ? "Mark as ready for pick up"
                 : "Complete Order"}
             </button>
             )
            :
              <button
                onClick={() => setSelectedOrder(null)}
                type="button"
                className="w-full py-3 px-4 flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20 dark:hover:text-neutral-300 dark:focus:bg-white/20 dark:focus:text-neutral-300"
              >
                Close
              </button>
            }
            </div>
          </div>
        ) : (
          <div className="h-full col-span-1 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 dark:bg-neutral-800 rounded-xl p-4">
            <span className="text-gray-500 dark:text-neutral-400">
              Select an order to view details.
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
}
