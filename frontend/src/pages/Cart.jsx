
import Navbar from "../components/Navbar";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import useAuthStore from "../stores/useAuthStore";
import  useTransactionStore  from "../stores/useTransactionStore";
import { Formik, Form } from "formik"
import * as Yup from "yup";

export default function Cart() {
 
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const { fetchPaymentLink, loading } = useTransactionStore();

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Formik initial values
  const initialValues = {
    orderedItems: items.map(item => ({
      menuItemId: item.id,
      quantity:   item.quantity,
      price:      item.price,
      subtotal:   item.price * item.quantity
    })),
    total:          totalAmount,
    tenderedAmount: totalAmount,
    change:         0
  };

  // Yup schema: require at least one item
  const validationSchema = Yup.object({
    orderedItems: Yup.array()
      .min(1, "Your cart is empty. Add items to proceed.")
      .required()
  });

  const handleSubmit = async (values) => {
    const result = await fetchPaymentLink(values);
    const link = result?.paymentLink || result?.checkoutUrl;
    if (link) {
      window.location.href = link;
    } else {
      console.error("Failed to get checkout link", result);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mt-20 mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shopping Bag */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Your cart</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-300 pb-6">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name}
                    className="w-28 h-28 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        })}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Qty:</div>
                    <div className="mt-2">
                      <div className="py-2 inline-block bg-white">
                        <div className="flex items-center gap-x-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="size-6 inline-flex justify-center items-center text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50"
                          >
                            <Minus className="shrink-0 size-3.5" />
                          </button>
                          <input
                            type="text"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateQuantity(item.id, isNaN(val) || val < 1 ? 1 : val);
                            }}
                            className="h-10 w-10 bg-transparent border border-gray-200 rounded-lg text-gray-800 text-center focus:ring-0 appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="size-6 inline-flex justify-center items-center text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50"
                          >
                            <Plus className="shrink-0 size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-blue-600 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Order summary</h3>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {totalAmount.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                PHP{" "}
                {totalAmount.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </span>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isValid, isSubmitting }) => (
              <Form>
                {/* Show validation error if cart empty */}
                {!isValid && (
                  <p className="text-red-500 text-sm mb-2">
                    Your cart is empty. Add items to proceed.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!user || loading || !isValid || isSubmitting}
                  className={`mt-2 w-full py-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg text-white ${
                    !user
                      ? "bg-gray-200 cursor-not-allowed"
                      : loading || isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading || isSubmitting
                    ? "Processing..."
                    : !user
                    ? "Log in to checkout"
                    : "Proceed to Checkout"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
