import {Link} from "react-router-dom";
import HeroImage from "../assets/HeroImage.jpg"; // Adjust the path as necessary

export default function Hero() {
  return (
    <div>{/* Hero */}
<div className="max-w-[85rem] mt-20 mx-auto px-4 sm:px-6 lg:px-8">
  {/* Grid */}
  <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
  <div className="lg:col-span-3">
    <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-5xl dark:text-white">
      Authentic Filipino Soul Food in Manila
    </h1>
    
    <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
      Discover a modern online food ordering experience for your favorite silog, snacks, and local comfort meals. Freshly made, quickly delivered—straight from our kitchen to your door.
    </p>

    <p className="mt-2 text-sm text-gray-700 dark:text-neutral-500">
      Whether you're craving tapsilog for breakfast or lutong bahay for dinner, we make it easy to satisfy your cravings with just a few clicks.
    </p>

    <div className="mt-7 grid gap-3 w-full sm:inline-flex">
      <Link
        to={"/menu"}
        className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        Browse Our Menu
      </Link>
      <Link
        to={"/register"}
        className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
      >
        Create an Account
      </Link>
    </div>


      
    </div>
    {/* End Col */}

    <div className="lg:col-span-4 mt-10 lg:mt-0">
      <img className="w-full rounded-xl" src={HeroImage} alt="Hero Image" />
    </div>
    {/* End Col */}
  </div>
  {/* End Grid */}
</div>
{/* End Hero */}</div>
  )
}
