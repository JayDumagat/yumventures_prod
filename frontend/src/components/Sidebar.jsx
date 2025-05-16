import useSidebarStore from "../stores/useSidebarStore";
import { NavLink } from "react-router-dom";
import SidebarAccordion from "./SidebarAccordion";
import {
  Banknote,
  FileChartPie,
  HandCoins,
  LayoutDashboard,
  ListTree,
  NotepadText,
  Sandwich,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const { isSidebarOpen } = useSidebarStore();
  return (
    <div className="relative">
      <div
        className={` ${
          isSidebarOpen ? " translate-x-0" : "-translate-x-full"
        } [--auto-close:lg] transition-all ease-in-out duration-700 transform w-65 h-full fixed inset-y-0 start-0 z-60 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700`}
      >
        <div className="relative flex flex-col h-full max-h-full">
          <div className="px-6 pt-4 flex items-center">
            {/* Logo */}
            <a
              className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
              href="/"
            >
              Yum
            </a>
            {/* End Logo */}

            <div className="hidden lg:block ms-2"></div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <nav className="hs-accordion-group p-3 w-full flex flex-col flex-wrap">
              <ul className="flex flex-col space-y-1">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                        isActive ? "bg-gray-100" : ""
                      }`
                    }
                    to={"/client/dashboard"}
                  >
                    <LayoutDashboard className="shrink-0 size-4" />
                    Dashboard
                  </NavLink>
                </li>

                <li className="hs-accordion">
                  <SidebarAccordion
                    label={"Menu Management"}
                    id={"menu-accordion"}
                    icon={
                      <UtensilsCrossed className="shrink-0 mt-0.5 size-4" />
                    }
                  >
                    <ul className="ps-8 pt-1 space-y-1">
                      <li>
                        <NavLink
                          className={({ isActive }) =>
                            `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                              isActive ? "bg-gray-100" : ""
                            }`
                          }
                          to={"/client/menu-items"}
                        >
                          <Sandwich className="shrink-0 size-4" />
                          Menu Items
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className={({ isActive }) =>
                            `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                              isActive ? "bg-gray-100" : ""
                            }`
                          }
                          to={"/client/menu-categories"}
                        >
                          <ListTree className="shrink-0 size-4" />
                          Categories
                        </NavLink>
                      </li>
                    </ul>
                  </SidebarAccordion>
                </li>

                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                        isActive ? "bg-gray-100" : ""
                      }`
                    }
                    to={"/client/point-of-sales"}
                  >
                    <HandCoins className="shrink-0 size-4" />
                    Point of Sales
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                        isActive ? "bg-gray-100" : ""
                      }`
                    }
                    to={"/client/orders"}
                  >
                    <NotepadText className="shrink-0 size-4" />
                    Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                        isActive ? "bg-gray-100" : ""
                      }`
                    }
                    to={"/client/reports"}
                  >
                    <FileChartPie className="shrink-0 size-4" />
                    Reports
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                        isActive ? "bg-gray-100" : ""
                      }`
                    }
                    to={"/client/transactions"}
                  >
                    <Banknote className="shrink-0 size-4" />
                    Transactions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                        isActive ? "bg-gray-100" : ""
                      }`
                    }
                    to={"/client/staff-management"}
                  >
                    <UsersRound className="shrink-0 size-4" />
                    Staff Management
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          {/* End Content */}
          <SidebarFooter/>
        </div>
      </div>
      {/* End Sidebar */}
    </div>
  );
}
