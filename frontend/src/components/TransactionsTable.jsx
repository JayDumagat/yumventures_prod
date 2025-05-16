import { useEffect, useState } from "react";
import useTransactionStore from "../stores/useTransactionStore";
import TableFooter from "./TableFooter";
import EmptyTableTemplate from "./EmptyTableTemplate";

export default function TransactionsTable() {
  const { transactions, fetchTransactions } = useTransactionStore();
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const filteredTransactions = transactions.filter((t) => {
    const total = t.total.toString().toLowerCase();
    const tendered = t.tenderedAmount.toString().toLowerCase();
    const orderType = t.orderedBy ? "online" : "in store";

    return (
      total.includes(filter.toLowerCase()) ||
      tendered.includes(filter.toLowerCase()) ||
      orderType.includes(filter.toLowerCase())
    );
  });

  const start = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(start, start + pageSize);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
              
              {/* Header with filter */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Transactions
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    View and manage your transactions here.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Filter by total, tender, or order type"
                  value={filter}
                  onChange={handleFilterChange}
                  className="max-w-xs py-2 px-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                />
              </div>

              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Total</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Tender</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Change</th>
                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Order Type</th>
                  </tr>
                </thead>

                {paginatedTransactions.length > 0 ? (
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {paginatedTransactions.map((transaction, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <td className="whitespace-nowrap px-6 py-2 text-sm text-gray-600 dark:text-neutral-400">
                          {parseFloat(transaction.total).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2 text-sm text-gray-600 dark:text-neutral-400">
                          {parseFloat(transaction.tenderedAmount).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2 text-sm text-gray-600 dark:text-neutral-400">
                          {parseFloat(transaction.change).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2 text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          {transaction.orderedBy ? "Online" : "In store"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={4}>
                        <EmptyTableTemplate
                          icon={"CircleHelp"}
                          className="shrink-0 size-6 text-gray-600 dark:text-neutral-400"
                          title={"No transactions found"}
                          description={"Start processing orders"}
                        />
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>

              {/* Footer */}
              <TableFooter
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                prev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                next={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disablePrev={currentPage === 1}
                disableNext={currentPage >= totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
