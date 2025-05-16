import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

export const ReusableDialog = ({
  isOpen,
  onClose,
  title = "Dialog",
  children,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="size-full fixed top-0 start-0 z-80 overflow-x-hidden "
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100 "
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20" />
        </Transition.Child>

        <div className="mt-7 opacity-100 duration-500 ease-in-out transition-all sm:max-w-4xl sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-xl shrink-0 grow max-h-full overflow-hidden flex flex-col z-[80] bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-700/70">
                <div className=" flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-800">
                  <Dialog.Title className="font-bold text-gray-800 dark:text-neutral-200">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    type="button"
                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                  >
                    <span className="sr-only">Close</span>
                    <X className="shrink-0 size-4" />
                  </button>
                </div>
                <div className="p-4 ">
                  
                  {children}
                </div>

               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
