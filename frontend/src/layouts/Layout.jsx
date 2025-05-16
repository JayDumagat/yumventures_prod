import PropTypes from "prop-types";
import Breadcrumb from "../components/Breadcrumb";
import Sidebar from "../components/Sidebar";
import useSidebarStore from "../stores/useSidebarStore";




export default function Layout({ children }) {
  const { isSidebarOpen, closeSidebar } = useSidebarStore();
  
  
  return (
    <div className="w-full h-screen flex flex-col overflow-auto lg:flex-row lg:gap-x-4 bg-gray-50 dark:bg-neutral-900">
      {/* ========== MAIN CONTENT ========== */}
      {/* Breadcrumb */}
     
     <Breadcrumb/>
     <div onClick={closeSidebar} className={` ${isSidebarOpen ? "flex" : "hidden"} lg:hidden w-full h-screen absolute top-0 left-0 z-50  bg-black/20`}/>
      {/* Sidebar */}
      <Sidebar/>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:ps-64 mt-10">
        {children}
      </div>
      {/* End Content */}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
