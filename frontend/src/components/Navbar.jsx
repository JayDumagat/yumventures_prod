
import { Link, NavLink } from "react-router-dom";
import useNavbarStore from "../stores/useNavbarStore";
import { Home, Menu, X, CircleUserRound, ShoppingBasket, ClipboardList, BookOpenText } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

import UserDropdown from "./UserDropdown";
export default function Navbar() {
  
  const { isNavbarOpen, toggleNavbar } = useNavbarStore();
  const {user} = useAuthStore()

  const handleToggle = () => {
    toggleNavbar();
  };
  return (
    <div>
      {/* ========== HEADER ========== */}
      <header className="fixed top-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full backdrop-blur-md bg-white/90 shadow-sm">
        <nav className="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-x-1 ">
            <Link
              className="flex items-center space-x-2 focus:outline-hidden focus:opacity-80"
              to={"/"}
              aria-label="Yumventures"
            >
              
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                <span className="text-blue-500">Yum</span>venture
              </h1>
            </Link>

            {/* Collapse Button */}
            <button
              onClick={handleToggle}
              type="button"
              className="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-sm rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <Menu className={`size-4 ${isNavbarOpen ? "block" : "hidden"}`} />
              <X
                className={`shrink-0 size-4 ${
                  isNavbarOpen ? "hidden" : "block"
                }`}
              />
              <span className="sr-only">Toggle navigation</span>
            </button>
            {/* End Collapse Button */}
          </div>

          {/* Collapse */}
          <div
            className={`overflow-hidden transition-all duration-300 basis-full grow md:block  ${
              isNavbarOpen ? "hidden" : "block"
            }`}
          >
            <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <div className="py-2 md:py-0  flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
                <div className="grow">
                  <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-3">
                    <NavLink
                      className={({ isActive }) =>
                        `p-2 flex items-center text-sm text-gray-800 hover:text-sky-800 transition-colors rounded-lg focus:outline-hidden focus:bg-gray-100 ${
                            isActive ? " text-sky-800" : ""
                        }`
                      }
                      to={"/"}
                    >
                      <Home className="shrink-0 size-4 me-3 md:me-2 block md:hidden" />
                      Home
                    </NavLink>
                     <NavLink
                    to={"/menu"}
                      className={({ isActive }) =>
                        `p-2 flex items-center text-sm text-gray-800 hover:text-sky-800 transition-colors rounded-lg focus:outline-hidden focus:bg-gray-100 ${
                            isActive ? "text-sky-800" : ""
                        }`
                      }
                    >
                      <BookOpenText className="shrink-0 size-4 me-3 md:me-2 block md:hidden" />
                      Menu
                    </NavLink>
                    <NavLink
                   to={"/cart"}
                      className={({ isActive }) =>
                        `p-2 flex items-center text-sm text-gray-800 hover:text-sky-800 transition-colors rounded-lg focus:outline-hidden focus:bg-gray-100 ${
                            isActive ? "text-sky-800" : ""
                        }`
                      }
                    >
                      <ShoppingBasket className="shrink-0 size-4 me-3 md:me-2 block md:hidden" />
                      Cart
                    </NavLink>
                     <NavLink
                   to={"/orders"}
                      className={({ isActive }) =>
                        `p-2 flex items-center text-sm text-gray-800 hover:text-sky-800 transition-colors rounded-lg focus:outline-hidden focus:bg-gray-100 ${
                            isActive ? "text-sky-800" : ""
                        }`
                      }
                    >
                      <ClipboardList className="shrink-0 size-4 me-3 md:me-2 block md:hidden" />
                      Orders
                    </NavLink>
                   
                  </div>
                </div>

                <div className="my-2 md:my-0 md:mx-2">
                  <div className="w-full h-px md:w-px md:h-4 bg-gray-100 md:bg-gray-300 "></div>
                </div>

                {/* Button Group */}
                <div className=" flex flex-wrap items-center gap-x-1.5">
                  {user ? (
                    <UserDropdown/>
                  ) : (
                    <Link
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      to={"/login"}
                    >
                      Sign In
                    </Link>
                  )}
                </div>

                {/* End Button Group */}
              </div>
            </div>
            
          </div>
              

          {/* End Collapse */}
        </nav>
        
      </header>
      {/* ========== END HEADER ========== */}
    </div>
  );

}
