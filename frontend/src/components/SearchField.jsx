import { Search } from "lucide-react";


export default function SearchField({search, onChange}) {
  return (
    <div className="sm:col-span-1">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <input type="text" id="search" name="search" value={search} onChange={onChange} className="py-2 px-3 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Search"/>
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
            <Search className="size-4 text-gray-400 dark:text-neutral-500"/>
          </div>
        </div>
      </div>
  )
}
