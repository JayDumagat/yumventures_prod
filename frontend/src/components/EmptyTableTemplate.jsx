import DynamicIcon from "./DynamicIcon";

export default function EmptyTableTemplate({
  icon,
  className,
  title,
  description,
}) {
  return (
    <div className="max-w-sm w-full min-h-100 flex flex-col justify-center mx-auto px-6 py-4">
      <div className="flex justify-center items-center size-11 bg-gray-100 rounded-lg dark:bg-neutral-800">
        <DynamicIcon name={icon}  className={`${className}`}/>
      </div>

      <h2 className="mt-5 font-semibold text-gray-800 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}
