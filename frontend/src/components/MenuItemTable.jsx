import { Filter, Plus } from "lucide-react";
import SearchField from "./SearchField";
import StatusBadge from "./StatusBadge";
import { useEffect, useState } from "react";
import { ReusableDialog } from "./ReusableDialog";
import AddNewMenuForm from "./AddNewMenuForm";
import useMenuItemStore from "../stores/useMenuItemStore";
import TableFooter from "./TableFooter";
import ViewMenuItem from "./ViewMenuItem";
import DeleteConfirmation from "./DeleteConfirmation";
import useCategoryStore from "../stores/useCategoryStore";
import EmptyTableTemplate from "./EmptyTableTemplate";
import useFilterStore from "../stores/useFilterStore";

export default function MenuItemTable() {
  const { fetchMenuItems, menuItems, deleteMenuItem } = useMenuItemStore();
  const { fetchCategories } = useCategoryStore();
  
  // Use all the required filter states
  const { 
    search, 
    setSearch, 
    pageSize, 
    setPageSize, 
    currentPage, 
    setCurrentPage 
  } = useFilterStore();

  const [dialogMode, setDialogMode] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Search change handler
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter((menuItem) =>
    menuItem.name.toLowerCase().includes(search.toLowerCase()) ||
    (menuItem.category?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (menuItem.description || '').toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination details
  const totalItems = filteredMenuItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Calculate the correct start and end indices for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentMenuItems = filteredMenuItems.slice(startIndex, endIndex);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fetch menu items and categories on component mount
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [fetchMenuItems, fetchCategories]);

  // Dialog management functions
  const openViewDialog = (row) => {
    setSelectedRow(row);
    setDialogMode("view");
  };

  const openAddDialog = () => {
    setSelectedRow(null);
    setDialogMode("add");
  };

  const openDeleteDialog = (row) => {
    setSelectedRow(row);
    setDialogMode("delete");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedRow(null);
  };

  return (
    <div>
      {dialogMode === "view" && (
        <ReusableDialog
          isOpen={true}
          onClose={closeDialog}
          title={`Viewing ${selectedRow?.name || "Row"}`}
        >
          {selectedRow ? (
            <ViewMenuItem
              menuItem={selectedRow}
              deleteDialog={openDeleteDialog}
              closeDialog={closeDialog}
            />
          ) : (
            <p>No data to show</p>
          )}
        </ReusableDialog>
      )}

      {dialogMode === "delete" && (
        <ReusableDialog isOpen={true} onClose={closeDialog} title={``}>
          <DeleteConfirmation
            closeDialog={closeDialog}
            data={selectedRow}
            openViewDialog={openViewDialog}
            deleteWith={deleteMenuItem}
          />
        </ReusableDialog>
      )}

      {dialogMode === "add" && (
        <ReusableDialog
          isOpen={true}
          onClose={closeDialog}
          title="Add New Menu Item"
        >
          <AddNewMenuForm closeDialog={closeDialog} />
        </ReusableDialog>
      )}

      {/* Table Section */}
      <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
        {/* Card */}
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
                {/* Header */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <SearchField value={search} onChange={handleSearchChange} />

                  <div className="sm:col-span-2 md:grow">
                    <div className="flex justify-end gap-x-2">
                      <div className="[--placement:bottom-right] relative inline-block">
                        <button
                          type="button"
                          className="hidden py-2 px-3  items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <Filter className="shrink-0 size-3.5" />
                          Filters
                        </button>
                      </div>
                      <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
                        <button
                          onClick={openAddDialog}
                          type="button"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <Plus className="shrink-0 size-3.5" />
                          Add Menu Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Header */}

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                            Name
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                            Category
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                            Description
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                            Price
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                            Status
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  {currentMenuItems.length > 0 ? (
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {/*be able to display an alt if nothing was fetched or if menu items is empty*/}

                      {currentMenuItems.map((menuItem, index) => (
                        <tr
                          key={index}
                          className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        >
                          <td className="size-px whitespace-nowrap align-middle">
                            <div
                              className="block p-6"
                              onClick={() => openViewDialog(menuItem)}
                            >
                              <div className="cursor-pointer flex items-center gap-x-4">
                                <img
                                  className="shrink-0 size-9.5 rounded-lg"
                                  src={
                                    import.meta.env.VITE_API_URL +
                                    menuItem.image
                                  }
                                  alt={`Menu Item ${menuItem.name}`}
                                />

                                <div>
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {menuItem.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap align-middle">
                            <div
                              className="block p-6"
                              onClick={() => openViewDialog(menuItem)}
                            >
                              <div className="flex items-center gap-x-3">
                                <div className="grow">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {menuItem.category?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="h-px w-72 min-w-72 align-middle">
                            <div
                              className="block p-6"
                              onClick={() => openViewDialog(menuItem)}
                            >
                              <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                {menuItem.description ||
                                  "No description available"}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap align-middle">
                            <div
                              className="block p-6"
                              onClick={() => openViewDialog(menuItem)}
                            >
                              <span className="text-sm text-gray-600 dark:text-neutral-400">
                                {parseFloat(menuItem.price).toLocaleString(
                                  "en-PH",
                                  {
                                    style: "currency",
                                    currency: "PHP",
                                  }
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap align-middle">
                            <div
                              className="block p-6"
                              onClick={() => openViewDialog(menuItem)}
                            >
                              <StatusBadge status={menuItem.status} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      <tr className="bg-white dark:bg-neutral-900">
                        <td colSpan="5" className=" object-center ">
                          <EmptyTableTemplate 
                            icon={"CircleHelp"} 
                            className="shrink-0 size-6 text-gray-600 dark:text-neutral-400" 
                            title={search ? "No matching menu items found" : "No menu items found"} 
                            description={search ? "Try adjusting your search" : "Create a new menu item to get started"} 
                          />
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>

                {/* Updated TableFooter */}
                {currentMenuItems.length > 0 && (
                  <TableFooter 
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e)}
                    prev={() => handlePageChange(currentPage - 1)}
                    next={() => handlePageChange(currentPage + 1)}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    disablePrev={currentPage === 1}
                    disableNext={currentPage === totalPages || totalPages === 0}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
