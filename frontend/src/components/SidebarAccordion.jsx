import PropTypes from "prop-types";
import {ChevronDown, ChevronUp} from "lucide-react"
import useNavAccordionStore from "../stores/useNavAccordionStore";
export default function SidebarAccordion({ icon, label, id, children }) {
  const { accordions, toggleAccordion } = useNavAccordionStore();
  const isOpen = accordions[id] || false;
  return (
    <div>
      <button
      onClick={() => toggleAccordion(id)}
        type="button"
        className=" w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200"
      >
       {icon}
        {label}
       <ChevronDown className={` ${isOpen ? "block" : "hidden"} ms-auto size-4`}/>
       <ChevronUp className={` ${isOpen ? "hidden" : "block"} ms-auto size-4`}/>
      </button>

      <div
       
        className={` w-full overflow-hidden transition-[height] duration-300 ease-in-out ${
          isOpen ? "hidden" : "block"
        }`}
       
      >
       {children}
      </div>
    </div>
  );
}

SidebarAccordion.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
