import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import CategoryButtons from "../components/CategoryButtons";
import SearchField from "../components/SearchField";
import useMenuItemStore from "../stores/useMenuItemStore";
import useCategoryStore from "../stores/useCategoryStore";

export default function CustomerMenu() {
  const { menuItems, fetchMenuItems } = useMenuItemStore();
  const {categories, fetchCategories} = useCategoryStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    fetchMenuItems(); // fetch all items initially
    fetchCategories(); // fetch all categories initially
  }, [fetchMenuItems, fetchCategories]);

 const filteredItems = Array.isArray(menuItems) ? menuItems.filter((item) => {
    // Skip null or undefined items
    if (!item || typeof item !== 'object') {
      console.warn("Invalid item in menuItems array:", item);
      return false;
    }

    // Check for category match with both possible category ID locations
    const matchesCategory = selectedCategoryId
      ? (item.categoryId === selectedCategoryId || 
         (item.category && item.category.id === selectedCategoryId))
      : true;

    // Check for search term match
    const matchesSearchTerm = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesSearchTerm;
  }) : [];

  

  return (
    <div>
      <Navbar />
      <div className="mt-20 max-w-[85rem] px-4 mx-auto md:px-8 lg:px-10">
        <div className="flex justify-between items-center mb-4">
          <SearchField value={searchTerm} onChange={handleSearchChange} />
        </div>

        

        <CategoryButtons
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} hideItemsSold={true} />
            ))}
          </div>
        ) : (
          <div>No menu items available in this category</div>
        )}
      </div>
    </div>
  );
}
