import React, { useEffect, useState } from "react";
import useCategoryStore from "../stores/useCategoryStore";


export default function PosScrollCategoryButton({ selectedCategoryId, onSelect }) {
  const { categories, fetchCategories } = useCategoryStore()
  const [activeTab, setActiveTab] = useState("All Menu");

  useEffect(() => {
    fetchCategories(1, "", "", 10); 
  }, [fetchCategories]);

  const activeClass =
    "flex-shrink-0 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700";

  const inactiveClass =
    "py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-hidden focus:border-blue-600 active:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:text-blue-500 dark:focus:border-blue-600 dark:active:text-blue-500 dark:active:border-blue-600";


  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-3 py-2 min-w-max">
        <button
          type="button"
          className={selectedCategoryId === null ? activeClass : inactiveClass}
          onClick={() => onSelect(null)}
        >
          All Menu
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={selectedCategoryId === category.id ? activeClass : inactiveClass}
            onClick={() => onSelect(category.id)}
          >
            
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
