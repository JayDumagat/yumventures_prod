import { useEffect } from "react";
import useMenuItemStore from "../stores/useMenuItemStore";
import usePOSStore from "../stores/usePOSStore";

export default function PosMenuItems() {
  const { menuItems, fetchMenuItems } = useMenuItemStore();
  const { addToCart} = usePOSStore()

  useEffect(() => {
    fetchMenuItems(1, "", "", 10); 
  }, [fetchMenuItems]);

  

  return (
    <div>
     
      {/* Scrollable Wrapper */}
      <div className="overflow-y-auto">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Your Cards */}
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <div
                onClick={() => addToCart(item)}
                role="button"
                key={index}
                className="group flex flex-col border border-gray-200 hover:border-transparent hover:shadow-lg focus:outline-hidden focus:border-transparent focus:shadow-lg transition duration-300 rounded-xl p-2 dark:border-neutral-700 dark:hover:border-transparent dark:hover:shadow-black/40 dark:focus:border-transparent dark:focus:shadow-black/40"
              >
                <div className="w-full aspect-square overflow-hidden rounded-xl">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className=" p-2">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-neutral-300 dark:group-hover:text-white">
                    {item.name}  
                  </h3>
                  <p className=" text-gray-600 dark:text-neutral-400">
                  {parseFloat(item.price).toLocaleString(
                                  "en-PH",
                                  {
                                    style: "currency",
                                    currency: "PHP",
                                  }
                                )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full p-4 text-gray-500 dark:text-neutral-400">
              No menu items available.
            </div>
          )}
        </div>
        {/* End Grid */}
      </div>
      {/* End Scrollable Wrapper */}
    </div>
  );
}
