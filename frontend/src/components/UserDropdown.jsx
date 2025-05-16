import  { useState, useRef, useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    logout();
  
    setTimeout(() => {
      toast.success("Logged out successfully");
      navigate("/login");
    }, 2000);
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
      >
        Hi {user.firstName}!
        <ChevronDown
          className={`size-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed top-full md:right-6 lg:right-23 mt-2 w-64 z-50 bg-white shadow-lg rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700 sm:w-60"
        >
          <div className="py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Signed in as
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
              {user.email}
            </p>
          </div>
          <div className="p-1 space-y-0.5">
            <Link
              to={"/profile"}
              className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            >
              <UserRound className="shrink-0 size-4 text-gray-400 dark:text-neutral-600" />
              Profile
            </Link>
             <button
             
                onClick={handleLogout}
              className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            >
              <LogOut className="shrink-0 size-4 text-gray-400 dark:text-neutral-600" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
