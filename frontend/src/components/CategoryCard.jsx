import { Link } from "react-router-dom";
import DynamicIcon from "./DynamicIcon";
import { useEffect, useState } from "react";
import { ReusableDialog } from "./ReusableDialog";
import AddNewMenuForm from "./AddNewMenuForm";
import useStatStore from "../stores/useStatStore";
import useCategoryStore from "../stores/useCategoryStore";

export default function CategoryCard() {
  const {categoryStats, fetchCategoryStats} = useStatStore()
  const {loading: categoryLoading} = useCategoryStore()
  const [dialogMode, setDialogMode] = useState(null);

  useEffect(() => {
    fetchCategoryStats()
  }, [fetchCategoryStats]);

  useEffect(() => {
    if (!categoryLoading) {
      fetchCategoryStats();
    }
  }, [categoryLoading, fetchCategoryStats]);


  const openAddDialog = () => {
    setDialogMode("add");
  };

  const closeDialog = () => {
    setDialogMode(null);
    fetchCategoryStats()
  };

  const firstFourCategories = Array.isArray(categoryStats)
    ? categoryStats.slice(0, 4)
    : Object.entries(categoryStats)
        .slice(0, 4)
        .map(([name, count]) => ({ name, amountOfMenuItems: count }));
  return (
    <div>
      {dialogMode === "add" && (
              <ReusableDialog
                isOpen={true}
                onClose={closeDialog}
                title="Add New Menu Item"
              >
                <AddNewMenuForm closeDialog={closeDialog}/>
              </ReusableDialog>
            )}
      {/* Card Blog */}
      <div className="max-w-full px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
        {/* Grid */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Grid */}
          <div className="col-span-1 lg:col-span-2 grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {firstFourCategories.length > 0 ? (
              firstFourCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800"
                >
                  <div className="p-4 md:p-5 flex gap-x-4">
                   

                    <div className="grow">
                      <div className="flex items-center gap-x-2">
                        <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">
                          Total {category.name}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2">
                        <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                          {category.amountOfMenuItems}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) :  (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800 animate-pulse"
                >
                  <div className="p-4 md:p-5 flex gap-x-4">
                    <div className="grow space-y-2">
                      <div className="w-1/3 h-4 bg-gray-300 rounded dark:bg-neutral-700" />
                      <div className="w-1/4 h-6 bg-gray-300 rounded dark:bg-neutral-700" />
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* End Grid */}



          </div>
          {/* End Card Section */}

          {/* Card */}
          <div className="col-span-1 group relative flex flex-col w-full min-h-60 bg-[url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80')] bg-center bg-cover rounded-xl hover:shadow-lg focus:outline-hidden focus:shadow-lg transition">
            <span className="absolute top-0 end-0 rounded-se-xl rounded-es-xl text-xs font-medium bg-white/20 text-white py-1.5 px-3 dark:bg-neutral-900">
              Quick Access
            </span>
            <div className="flex-auto p-4 md:p-6 mt-4">
              <h3 className="text-xl text-white/90 group-hover:text-white">
                <span className="font-bold">Quick Access</span> lets you instantly create new menu items with a click of a button.
              </h3>
            </div>
            <div className="pt-0 p-4 md:p-6">
              <button
                onClick={openAddDialog}
                type="button"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white/20 text-white shadow-2xs hover:bg-white/40 focus:outline-hidden focus:bg-white/40 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                Add Menu Items
              </button>
            </div>
          </div>
          {/* End Card */}
          {/* End Card */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Card Blog */}
    </div>
  );
}
