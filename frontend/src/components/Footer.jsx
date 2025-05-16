import { Link} from "react-router-dom";
import { ChefHat, Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";

export default function Footer() {
    return(
        <div>
            {/* ========== FOOTER ========== */}
<footer className="mt-auto bg-blue-700 w-full dark:bg-neutral-950">
  <div className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">      <div className="col-span-full lg:col-span-1">
        <Link className="flex-none text-xl font-semibold text-white focus:outline-hidden focus:opacity-80" to={"/"} aria-label="Yumventure">Yumventure</Link>
        <p className="mt-3 text-sm text-gray-300">
          Delicious food - Your favorite dishes, one click away.
        </p>
      </div>
      {/* End Col */}

      <div className="col-span-1">
        <h4 className="font-semibold text-gray-100">Quick Links</h4>

        <div className="mt-3 grid space-y-3">
          <p><Link className="inline-flex gap-x-2 text-gray-300 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" to={"/menu"}>Menu</Link></p>
          <p><Link className="inline-flex gap-x-2 text-gray-300 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" to={"/orders"}>Orders</Link></p>
          <p><Link className="inline-flex gap-x-2 text-gray-300 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" to={"/cart"}>Cart</Link></p>
        </div>
      </div>
      {/* End Col */}

      <div className="col-span-1">
        <h4 className="font-semibold text-gray-100">About Us</h4>

        <div className="mt-3 grid space-y-3">
          <p><Link className="inline-flex gap-x-2 text-gray-300 hover:text-gray-200 focus:outline-hidden focus:text-gray-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" to={"/about"}>About us</Link></p>
        </div>
      </div>
      {/* End Col */}      <div className="col-span-2">
        <h4 className="font-semibold text-gray-100">Our Location</h4>

        {/*embed google map*/}
        <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.332022673181!2d120.98850340000001!3d14.5801471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c98d86d9b4bf%3A0xd15a8e2c8f3e84b4!2sYumventures%20Food%20Hub%20(formerly%20CNJ%20Restaurant)!5e0!3m2!1sen!2sph!4v1744967860756!5m2!1sen!2sph"
            width="100%" 
            height="200" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Yumventure Location"
            className="rounded-lg"
          ></iframe>
        </div>
        <p className="mt-2 text-sm text-gray-300">
          1375 San Marcelino St, Paco, Manila,
1006 Metro Manila
        </p>

      </div>
      {/* End Col */}
    </div>
    {/* End Grid */}

    <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <p className="text-sm text-gray-300 dark:text-neutral-400">
          © {new Date().getFullYear()} Yumventure. All rights reserved.
        </p>
      </div>
      {/* End Col */}

      {/* Social Brands */}
      <div>
        <Link className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" to={"https://www.facebook.com/yumfoodhubph"}>
          <Facebook className="shrink-0 size-4"/>
        </Link>
       

        <Link className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" to={"mailto:yumventuresfoodcorporation@gmail.com"} >
          <Mail className="shrink-0 size-4"/>
        </Link>
        <Link className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none" to={"Tel:+639498904543"}>
          <Phone className="shrink-0 size-4"/>
        </Link>
      </div>
      {/* End Social Brands */}
    </div>
  </div>
</footer>
{/* ========== END FOOTER ========== */}
        </div>
    );
}