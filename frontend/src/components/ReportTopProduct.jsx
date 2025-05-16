import React from 'react'

export default function ReportTopProduct() {
  return (
    <div>{/* Table Section */}
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Card */}
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  Top Products
                </h2>
               
              </div>
              {/* End Header */}
    
              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start whitespace-nowrap">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        #
                      </span>
                    </th>
    
                    <th scope="col" className="px-6 py-3 text-start whitespace-nowrap min-w-64">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Name
                      </span>
                    </th>
    
                    <th scope="col" className="px-6 py-3 text-start whitespace-nowrap">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Category
                      </span>
                    </th>
    
                    <th scope="col" className="px-6 py-3 text-start whitespace-nowrap">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Sold
                      </span>
                    </th>
    
                    <th scope="col" className="px-6 py-3 text-start whitespace-nowrap">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Revenue
                      </span>
                    </th>
    
                  </tr>
                </thead>
    
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  <tr>
                    <td className="size-px whitespace-nowrap px-6 py-3">
                      <button type="button" className="flex items-center gap-x-2 text-gray-800 hover:text-gray-600 focus:outline-hidden focus:text-gray-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400">
                        <span className="text-sm text-gray-800 dark:text-neutral-200">1</span>
                      </button>
                    </td>
                    <td className="size-px whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-x-3">
                       <span className="font-semibold text-sm text-gray-800 dark:text-white">Adobong Manok</span>
                        
                      </div>
                    </td>
                    <td className="size-px whitespace-nowrap px-6 py-3">
                      <span className="text-sm text-gray-800 dark:text-white">Lunch</span>
                    </td>
                   
                    <td className="size-px whitespace-nowrap px-6 py-3">
                      <span className="text-sm text-gray-800 dark:text-white">500</span>
                    </td>
                    <td className="size-px whitespace-nowrap px-6 py-3">
                      <span className="text-sm text-gray-800 dark:text-white">$524,007,508,943</span>
                    </td>
                    
                  </tr>
    
                  
                </tbody>
              </table>
              {/* End Table */}
            </div>
          </div>
        </div>
      </div>
      {/* End Card */}
    </div>
    {/* End Table Section */}</div>
  )
}
