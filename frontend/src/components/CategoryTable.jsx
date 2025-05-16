import React, { useEffect, useState } from "react";
import { Filter, Plus } from "lucide-react";
import AddNewCategoryForm from "./AddNewCategoryForm";
import { ReusableDialog } from "./ReusableDialog";
import useCategoryStore from "../stores/useCategoryStore";
import EmptyTableTemplate from "./EmptyTableTemplate";
import SearchField from "./SearchField";
import TableFooter from "./TableFooter";
import ViewCategory from "./ViewCategory";
import DeleteConfirmation from "./DeleteConfirmation";
import useFilterStore from "../stores/useFilterStore";

export default function CategoryTable() {
  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
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

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination details
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Calculate the correct start and end indices for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddDialog = () => {
    setSelectedRow(null);
    setDialogMode("add");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedRow(null);
  };

  const openViewDialog = (row) => {
    setSelectedRow(row);
    setDialogMode("view");
  };

  const openDeleteDialog = (row) => {
    setSelectedRow(row);
    setDialogMode("delete");
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
            <ViewCategory
              category={selectedRow}
              deleteDialog={openDeleteDialog}
              closeDialog={closeDialog}
              categories={categories}
            />
          ) : (
            <p>No data to show</p>
          )}
        </ReusableDialog>
      )}
      {dialogMode === "add" && (
        <ReusableDialog
          isOpen={true}
          onClose={closeDialog}
          title="Add New Category"
        >
          <AddNewCategoryForm
            closeDialog={closeDialog}
            categories={categories}
          />
        </ReusableDialog>
      )}

      {dialogMode === "delete" && (
        <ReusableDialog isOpen={true} onClose={closeDialog} title={``}>
          <DeleteConfirmation
            closeDialog={closeDialog}
            data={selectedRow}
            openViewDialog={openViewDialog}
            deleteWith={deleteCategory}
          />
        </ReusableDialog>
      )}
      <div className="max-w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-4 mx-auto">
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
                          className="py-2 px-3 hidden items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                          Add Category
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
                            Description
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {currentCategories.length > 0 ? (
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {currentCategories.map((category, index) => (
                        <tr
                          key={index}
                          className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        >
                          <td
                            onClick={() => {
                              openViewDialog(category);
                            }}
                            className="cursor-pointer px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
                          >
                            {category.name}
                          </td>
                          <td
                            onClick={() => {
                              openViewDialog(category);
                            }}
                            className="cursor-pointer px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-neutral-400"
                          >
                            {category.description || "No description provided"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr className="bg-white dark:bg-neutral-900">
                        <td colSpan="5" className=" object-center">
                          <EmptyTableTemplate
                            icon="CircleHelp"
                            className="shrink-0 size-6 text-gray-600 dark:text-neutral-400"
                            title={search ? "No matching categories found" : "No categories found"}
                            description={search ? "Try adjusting your search" : "Create a new category to get started"}
                          />
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
                {/* End Table */}

                {/* TableFooter with pagination */}
                {currentCategories.length > 0 && (
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
        {/* End Card */}
      </div>
      {/* End Table Section */}
    </div>
  );
}
