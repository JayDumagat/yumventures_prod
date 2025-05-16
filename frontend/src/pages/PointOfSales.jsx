import PosOrderCardList from "../components/PosOrderCardList";
import PosOrderSummary from "../components/PosOrderSummary";
import Layout from "../layouts/Layout";
import PosMenuItems from "../components/PosMenuItems";
import SearchField from "../components/SearchField";
import PosScrollCategoryButton from "../components/PosScrollCategoryButton";
import { HandCoins } from "lucide-react";
import usePOSStore from "../stores/usePOSStore";
import { useState } from "react";
import { ReusableDialog } from "../components/ReusableDialog";
import OrderPaymentForm from "../components/OrderPaymentForm";
import PosOrderConfirmation from "../components/POSOrderConfirmation";
export default function PointOfSales() {
  const { cart } = usePOSStore();
  const [dialogMode, setDialogMode] = useState(null);
  const [submittedOrderDetails, setSubmittedOrderDetails] = useState(null);
  const [response, setResponse] = useState(null);
  const openPaymentDialog = () => {
    setDialogMode("payment");
  };

  const closeDialog = () => {
    setDialogMode(null);
  };

  const openViewConfirmation = (details, response) => {
    setSubmittedOrderDetails(details);
    setResponse(response);
    console.log('Response:', response); 
    setDialogMode("confirm");
};
  return (
    <Layout>
      {dialogMode === "payment" && (
        <ReusableDialog isOpen={true} onClose={closeDialog} title="Pay Order">
          <OrderPaymentForm
            closeDialog={closeDialog}
            openOrderConfirm={openViewConfirmation}
          />
        </ReusableDialog>
      )}

      {dialogMode === "confirm" && (
        <ReusableDialog
          isOpen={true}
          onClose={closeDialog}
          title="Order Confirmation"
        >
          <PosOrderConfirmation closeDialog={closeDialog} order={submittedOrderDetails} response={response} />
        </ReusableDialog>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[calc(100vh-3rem)] h-[calc(100vh-6rem)]">
        {/* Left Panel: scrollable */}
        <div className="col-span-1 lg:col-span-2 overflow-y-auto pr-2 p-2">
          <SearchField />
          <PosScrollCategoryButton />
          <PosMenuItems />
        </div>

        <div className="col-span-1 flex flex-col bg-white border border-gray-200 dark:bg-neutral-800 rounded-xl p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto ">
            <PosOrderCardList />
          </div>
          <div className="mt-4 shrink-0">
            <PosOrderSummary />
          </div>
          <div className="mt-4 shrink-0">
            <button
              onClick={openPaymentDialog}
              disabled={cart.length === 0}
              type="button"
              className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to payment
              <HandCoins className="shrink-0 size-4" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
