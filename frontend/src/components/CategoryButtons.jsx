

export default function CategoryButtons({ categories, selectedCategoryId, onSelect }) {
 

  

  return (
    <div className="flex overflow-x-auto gap-2 p-4 bg-white">
      <button
        onClick={() => onSelect(null)} // All
        className={`px-4 py-2 rounded-full border text-sm transition whitespace-nowrap ${
          selectedCategoryId === null
            ? "border-neutral-900 text-neutral-900 font-medium"
            : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full border text-sm transition whitespace-nowrap ${
            selectedCategoryId === category.id
              ? "border-neutral-900 text-neutral-900 font-medium"
              : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
