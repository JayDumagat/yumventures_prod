import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { toast } from 'react-toastify';

export default function ItemCard({ item, hideItemsSold = false }) {
  const { addToCart } = useCartStore();

  if (!item) {
    return (
      <div className="max-w-full lg:max-w-xs shrink grow-0 bg-white rounded-xl overflow-hidden group p-4">
        <p className="text-gray-500">Loading item...</p>
      </div>
    );
  }

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="max-w-full lg:max-w-xs shrink grow-0 bg-white rounded-xl overflow-hidden group">
      <div className="relative pt-[50%] sm:pt-[70%] rounded-xl overflow-hidden">
        <img
          className="size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded-xl"
          src={`${import.meta.env.VITE_API_URL || ''}${item.image || ''}`}
          alt={item.name || 'Menu item'}
        />
      </div>

      <div className="mt-2 mx-2">
        <h3 className="text-gray-900 font-semibold text-lg">{item.name || 'Unnamed Item'}</h3>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          {item.description || 'No description available.'}
        </p>
        <div className="mt-1 flex justify-between items-center">
          <span className="text-green-800 font-medium text-sm">
            ₱{item.price ? parseFloat(item.price).toFixed(2) : '0.00'}
          </span>
          {!hideItemsSold && (
            <span className="text-gray-500 text-sm flex items-center justify-between gap-1">
              <ShoppingCart className="size-3" /> {item.totalQuantitySold || 0} sold
            </span>
          )}
        </div>
        <button
          onClick={() => handleAddToCart(item)}
          className="mt-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        >
          <ShoppingCart className="size-4" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
