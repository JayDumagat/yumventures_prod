import usePOSStore from "../stores/usePOSStore";
import { Trash2 } from "lucide-react";

export default function PosOrderCardList() {
  const { cart, updateItemQuantity, removeFromCart } = usePOSStore();

  const reduceQuantity = (itemId) => {
    const itemToUpdate = cart.find((cartItem) => cartItem.id === itemId);
    if (!itemToUpdate) return;

    if (itemToUpdate.quantity > 1) {
      updateItemQuantity(itemId, itemToUpdate.quantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };

  const increaseQuantity = (itemId) => {
    const itemToUpdate = cart.find((cartItem) => cartItem.id === itemId);
    if (itemToUpdate) {
      updateItemQuantity(itemId, itemToUpdate.quantity + 1);
    }
  };

  return (
    <div className="space-y-4 pr-2">
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <div
            key={index}
            className="block border border-gray-200 rounded-lg hover:shadow-2xs focus:outline-hidden dark:border-neutral-700"
          >
            <div className="relative flex items-center overflow-hidden">
              <img
                className="w-12 h-full absolute inset-0 object-cover rounded-s-lg"
                src={`${import.meta.env.VITE_API_URL}${item.image}`}
                alt={`${item.name}`}
              />
              <div className="grow p-4 ms-12">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-neutral-300">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 ml-auto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    {item.quantity} x{" "}
                    {(item.price * item.quantity).toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => reduceQuantity(item.id)}
                      className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full p-4 text-gray-500 dark:text-neutral-400">
          No items in the cart.
        </div>
      )}
    </div>
  );
}
