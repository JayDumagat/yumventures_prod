import { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import usePOSStore from "../stores/usePOSStore";
import {toast} from "react-toastify"

export default function OrderPaymentForm({closeDialog, openOrderConfirm}) {
  const { cart, clearCart, submitOrder } = usePOSStore();
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const totalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const formatCurrency = (value) =>
    value.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const handleOpenConfirmation = (details, response) => {
      closeDialog()
        
        clearCart()
       setTimeout(() => {
        openOrderConfirm(details, response);
  
       }, 100);
      }


  return (
    <Formik
      initialValues={{ tendered: "" }}
      validationSchema={Yup.object({
        tendered: Yup.number()
          .typeError("Amount must be a number")
          .min(0, "Amount must be at least 0")
          .required("This field is required"),
      })}
      onSubmit={async (values, { resetForm }) => {
        setIsSubmitting(true);
        try {
          const tender = parseFloat(values.tendered);
          const change = tender - totalAmount;

          const submittedDetails = {
            orderedItems: cart.map((item) => ({
              menuItemId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
            total: totalAmount,
            tenderedAmount: tender,
            change: change > 0 ? change : 0,
          };

          const response = await submitOrder(submittedDetails);
          handleOpenConfirmation(submittedDetails, response)
          toast.success("Order submitted successfully!");
          
          

        
          await new Promise((resolve) => setTimeout(resolve, 1000));
          resetForm();
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {({ values, touched, errors }) => {
        const numericTender = parseFloat(values.tendered) || 0;
        const change = numericTender - totalAmount;

        return (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 border-r border-gray-200 md:pr-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium mb-4">Order summary</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {cart.length === 0
                      ? "No items found"
                      : `${cart.length} ${cart.length === 1 ? "item" : "items"}`}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white border border-gray-200 shadow-2xs rounded-md p-4 md:p-2.5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                    >
                      <span className="text-sm truncate max-w-[90px]">
                        {`${item.quantity} x ${item.name}`}
                      </span>
                      <span className="text-xs font-medium">
                        {formatCurrency(item.quantity * item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-3 bg-gray-50 p-4 rounded-lg space-y-6">
              <div>
                <label className="text-sm font-medium block mb-1">Cash due</label>
                <input
                  type="text"
                  readOnly
                  value={formatCurrency(totalAmount)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Tendered amount
                </label>
                <Field
                  type="number"
                  name="tendered"
                  className={`w-full border rounded-lg px-3 py-2 bg-white ${
                    touched.tendered && errors.tendered
                      ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
                      : touched.tendered && !errors.tendered
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <ErrorMessage
                  name="tendered"
                  component="p"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amount paid</span>
                  <span className="font-medium">
                    {formatCurrency(numericTender)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3 font-medium">
                  <span>Change</span>
                  <span className={change < 0 ? "text-red-500" : ""}>
                    {formatCurrency(change > 0 ? change : 0)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={numericTender < totalAmount || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Complete transaction"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
