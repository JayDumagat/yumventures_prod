import { Banknote, MessageCircleHeart, PackagePlus, Receipt } from "lucide-react";
import useDashboardStore from "../stores/useDashboardStore";
import { useEffect } from "react";

export default function DashboardStat() {
  const { dashboardStat, fetchDashboardStat } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStat();
  }, [fetchDashboardStat]);

  

  return (
    <div>
      {/* Card Section */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="p-4 md:p-5 flex gap-x-4">
              <div className="shrink-0 flex justify-center items-center size-11 bg-gray-100 rounded-lg dark:bg-neutral-800">
                <Banknote className="shrink-0 size-5 text-gray-600 dark:text-neutral-400"/>
              </div>

              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">
                    Today's Sale
                  </p>
                  
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    {dashboardStat?.totalSales?.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </h3>
                  
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}

          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="p-4 md:p-5 flex gap-x-4">
              <div className="shrink-0 flex justify-center items-center size-11 bg-gray-100 rounded-lg dark:bg-neutral-800">
                <Receipt   className="shrink-0 size-5 text-gray-600 dark:text-neutral-400"/>
              </div>

              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">
                    Avg. order value
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                    {dashboardStat?.averageOrderValue?.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}

          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="p-4 md:p-5 flex gap-x-4">
              <div className="shrink-0 flex justify-center items-center size-11 bg-gray-100 rounded-lg dark:bg-neutral-800">
                <MessageCircleHeart   className="shrink-0 size-5 text-gray-600 dark:text-neutral-400"/>
              </div>

              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">
                    Top selling item
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-md font-medium text-gray-800 dark:text-neutral-200">
                    {dashboardStat?.topSellingItem}
                  </h3>
                  
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}

          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="p-4 md:p-5 flex gap-x-4">
              <div className="shrink-0 flex justify-center items-center size-11 bg-gray-100 rounded-lg dark:bg-neutral-800">
                <PackagePlus   className="shrink-0 size-5 text-gray-600 dark:text-neutral-400"/>
              </div>

              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">
                    Newly added item
                  </p>
                  
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                    {dashboardStat?.newlyAddedMenuItems ? dashboardStat?.newlyAddedMenuItems : "No new items"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Card Section */}
    </div>
  );
}
