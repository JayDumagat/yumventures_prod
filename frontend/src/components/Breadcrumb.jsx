import { ChevronRight, PanelRightClose, PanelRightOpen } from "lucide-react";
import useSidebarStore from "../stores/useSidebarStore";
import { useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  const path = location.pathname.split("/").filter(Boolean);
  return (
    <div>
      {" "}
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center py-2">
          {/* Navigation Toggle */}
          <button
            onClick={toggleSidebar}
            type="button"
            className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
          >
            <span className="sr-only">Toggle Navigation</span>

            <PanelRightClose
              className={` ${
                isSidebarOpen ? "hidden" : "block"
              } shrink-0 size-4`}
            />
            <PanelRightOpen
              className={` ${
                isSidebarOpen ? "block" : "hidden"
              } shrink-0 size-4`}
            />
          </button>
          {/* End Navigation Toggle */}

          {/* Breadcrumb */}
          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
              User
              <ChevronRight className="shrink-0 mx-3 overflow-visible size-3.5 text-gray-400 dark:text-neutral-500" />
            </li>
            <li className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400">
              <div className="flex flex-row items-center space-x-1">
                {path.map((item, index) => (
                  <span key={index} className="capitalize flex items-center">
                    {item}
                    {index < path.length - 1 && (
                      <ChevronRight className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500" />
                    )}
                  </span>
                ))}
              </div>
            </li>
          </ol>
          {/* End Breadcrumb */}
        </div>
      </div>
      {/* End Breadcrumb */}
    </div>
  );
}
