import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import CategoryButtons from "../components/CategoryButtons";
import SearchField from "../components/SearchField";
import useMenuItemStore from "../stores/useMenuItemStore";
import useCategoryStore from "../stores/useCategoryStore";
import useFilterStore from "../stores/useFilterStore.jsx";

export default function CustomerMenu() {
  const { menuItems, fetchMenuItems, pagination, loading } = useMenuItemStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // ✅ Use the same global filter state for consistency
  const {
    search,
    setSearch,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
  } = useFilterStore();

  // ✅ Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ✅ Handle pagination
  const handlePageChange = (newPage) => {
    const maxPages = pagination?.totalPages || 1;
    if (newPage >= 1 && newPage <= maxPages) {
      setCurrentPage(newPage);
    }
  };

  // ✅ Handle page size
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  // ✅ Fetch data
  useEffect(() => {
    fetchMenuItems(currentPage, "all", search, pageSize);
    fetchCategories();
  }, [currentPage, search, pageSize, fetchMenuItems, fetchCategories]);

  // ✅ Filter items by selected category
  const filteredItems = Array.isArray(menuItems)
    ? menuItems.filter((item) => {
        if (!item || typeof item !== "object") return false;

        const matchesCategory = selectedCategoryId
          ? item.categoryId === selectedCategoryId ||
            (item.category && item.category.id === selectedCategoryId)
          : true;

        return matchesCategory;
      })
    : [];

  return (
    <div>
      <Navbar />
      <div className="mt-20 max-w-[85rem] px-4 mx-auto md:px-8 lg:px-10">
        {/* 🔍 Search */}
        <div className="flex justify-between items-center mb-4">
          <SearchField value={search} onChange={handleSearchChange} />
        </div>

        {/* 🏷️ Categories */}
        <CategoryButtons
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        {/* 🕐 Loading */}
        {loading && (
          <div className="text-center py-6 text-gray-500">Loading menu...</div>
        )}

        {/* 🧩 Items */}
        {!loading && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} hideItemsSold={true} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center text-gray-500 mt-8">
              No menu items found.
            </div>
          )
        )}

        {/* 📄 Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-10">
            {/* Page size */}
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-600">
                Items per page:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {pagination.currentPage || currentPage} of{" "}
                {pagination.totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

