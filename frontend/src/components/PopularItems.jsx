import { ChevronRight } from "lucide-react";
import ItemCard from "./ItemCard";
import { Link } from "react-router-dom";
import useMenuItemStore from "../stores/useMenuItemStore";
import { useEffect } from "react";

export default function PopularItems() {
  const { popularMenuItems, fetchPopularMenuItems } = useMenuItemStore();

  useEffect(() => {
    fetchPopularMenuItems();
  }, [fetchPopularMenuItems]);


  // Limit to first 5 items
  const limitedMenuItems = Array.isArray(popularMenuItems) ? popularMenuItems.slice(0, 5) : [];

  return (
    <div>
      {/* Grid container for popular items */}
      <div className="max-w-[85rem] mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with justified content */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-white">
            Popular Items
          </h2>
          <Link
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            to={{ pathname: "/menu", search: "?filter=popular" }}
          >
            View All
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Grid of items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 mt-4">
          {Array.isArray(limitedMenuItems) && limitedMenuItems.length > 0 ? (
            limitedMenuItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-5 text-center py-8">
              <p className="text-gray-500">
                {Array.isArray(limitedMenuItems) 
                  ? "No popular items available."
                  : "Loading popular items..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
