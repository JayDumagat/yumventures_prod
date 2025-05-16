import { Filter, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import SearchField from "./SearchField";
import { useEffect, useState } from "react";
import { ReusableDialog } from "./ReusableDialog";
import TableFooter from "./TableFooter";
import EmptyTableTemplate from "./EmptyTableTemplate";
import useFilterStore from "../stores/useFilterStore";
import useUserStore from "../stores/useUserStore";
import AddNewUserForm from "./AddNewStaffForm";
import ViewStaffAccount from "./ViewStaffAccount";

export default function StaffTable() {
  const { users, fetchStaff } = useUserStore();
const [dialogMode, setDialogMode] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const {
    search,
    setSearch,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
  } = useFilterStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const filteredStaff = users.filter((staff) =>
    [staff.firstName, staff.lastName, staff.email, staff.username, staff.role]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentStaff = filteredStaff.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
                <ViewStaffAccount
                  staff={selectedRow}
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
                deleteWith={""}
              />
            </ReusableDialog>
          )}
    
          {dialogMode === "add" && (
            <ReusableDialog
              isOpen={true}
              onClose={closeDialog}
              title="Add New Staff Account"
            >
              <AddNewUserForm closeDialog={closeDialog} />
            </ReusableDialog>
          )}
    <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <SearchField value={search} onChange={handleSearchChange} />
                <div className="sm:col-span-2 md:grow">
                  <div className="flex justify-end gap-x-2">
                    <button
                      type="button"
                      className="hidden py-2 px-3  items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    >
                      <Filter className="shrink-0 size-3.5" />
                      Filters
                    </button>
                    <button
                      onClick={openAddDialog}
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    >
                      <Plus className="shrink-0 size-3.5" />
                      Add Staff
                    </button>
                  </div>
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                      Username
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                      Role
                    </th>
                  </tr>
                </thead>
                {currentStaff.length > 0 ? (
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {currentStaff.map((staff, index) => (
                      <tr
                        key={index}
                        className="bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          <button
                            onClick={() => openViewDialog(staff)}
                            className="w-full text-left text-sm text-gray-800 dark:text-neutral-200 cursor-pointer"
                          >
                            {staff.firstName}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          <button
                            onClick={() => openViewDialog(staff)}
                            className="w-full text-left text-sm text-gray-800 dark:text-neutral-200 cursor-pointer"
                          >
                            {staff.lastName}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          <button
                            onClick={() => openViewDialog(staff)}
                            className="w-full text-left text-sm text-gray-800 dark:text-neutral-200 cursor-pointer"
                          >
                            {staff.email}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          <button
                            onClick={() => openViewDialog(staff)}
                            className="w-full text-left text-sm text-gray-800 dark:text-neutral-200 cursor-pointer"
                          >
                            {staff.username}
                          </button>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                          <button
                            onClick={() => openViewDialog(staff)}
                            className="w-full text-left text-sm text-gray-800 dark:text-neutral-200 cursor-pointer"
                          >
                            {staff.role}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    <tr className="bg-white dark:bg-neutral-900">
                      <td colSpan="7" className="text-center py-10">
                        <EmptyTableTemplate
                          icon="CircleHelp"
                          className="shrink-0 size-6 text-gray-600 dark:text-neutral-400"
                          title={
                            search
                              ? "No matching staff found"
                              : "No staff found"
                          }
                          description={
                            search
                              ? "Try adjusting your search"
                              : "Create a new staff account to get started"
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>

              {currentStaff.length > 0 && (
                <TableFooter
                  value={pageSize}
                  onChange={handlePageSizeChange}
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
