import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
    return (
        <div>
            {/* Approach */}
            <div className="">
                <div className="max-w-5xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
                    {/* Title */}
                    <div className="max-w-3xl mb-10 lg:mb-14">
                        <h2 className="text-neutral-900 font-semibold text-2xl md:text-4xl md:leading-tight">How it works</h2>
                        <p className="mt-1 text-neutral-600">
                           At Yumventure, we offer convenient online ordering, pickup and cozy dine-in services to satisfy your cravings. 
                        </p>
                    </div>
                    {/* End Title */}

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
                        <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
                            <img
                                className="w-full object-cover rounded-xl"
                                src="https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=480&h=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Features Image"
                            />
                        </div>
                        {/* End Col */}

                        {/* Timeline */}
                        <div>
                            {/* Heading */}
                            <div className="mb-4">
                                <h3 className="text-blue-600 text-xs font-medium uppercase">
                                    Steps
                                </h3>
                            </div>
                            {/* End Heading */}

                            {/* Item 1 */}
                            <div className="flex gap-x-5 ms-1">
                                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-300">
                                    <div className="relative z-10 size-8 flex justify-center items-center">
                                        <span className="flex shrink-0 justify-center items-center size-8 border border-blue-600 text-blue-600 font-semibold text-xs uppercase rounded-full">
                                            1
                                        </span>
                                    </div>
                                </div>
                                <div className="grow pt-0.5 pb-8 sm:pb-12">
                                    <p className="text-sm lg:text-base text-neutral-700">
                                        <span className="text-neutral-900 font-semibold">Account creation:</span> Create an account to access our online ordering system.
                                    </p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-x-5 ms-1">
                                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-300">
                                    <div className="relative z-10 size-8 flex justify-center items-center">
                                        <span className="flex shrink-0 justify-center items-center size-8 border border-blue-600 text-blue-600 font-semibold text-xs uppercase rounded-full">
                                            2
                                        </span>
                                    </div>
                                </div>
                                <div className="grow pt-0.5 pb-8 sm:pb-12">
                                    <p className="text-sm lg:text-base text-neutral-700">
                                        <span className="text-neutral-900 font-semibold">Browse menu:</span> Explore our menu to find your favorite dishes and place your order.
                                    </p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex gap-x-5 ms-1">
                                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-300">
                                    <div className="relative z-10 size-8 flex justify-center items-center">
                                        <span className="flex shrink-0 justify-center items-center size-8 border border-blue-600 text-blue-600 font-semibold text-xs uppercase rounded-full">
                                            3
                                        </span>
                                    </div>
                                </div>
                                <div className="grow pt-0.5 pb-8 sm:pb-12">
                                    <p className="text-sm md:text-base text-neutral-700">
                                        <span className="text-neutral-900 font-semibold">Wait your order</span>: After placing your order, you can track its status.
                                    </p>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex gap-x-5 ms-1">
                                <div className="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-300">
                                    <div className="relative z-10 size-8 flex justify-center items-center">
                                        <span className="flex shrink-0 justify-center items-center size-8 border border-blue-600 text-blue-600 font-semibold text-xs uppercase rounded-full">
                                            4
                                        </span>
                                    </div>
                                </div>
                                <div className="grow pt-0.5 pb-8 sm:pb-12">
                                    <p className="text-sm md:text-base text-neutral-700">
                                        <span className="text-neutral-900 font-semibold">Pick up your order:</span> Once your order is ready, you can pick it up at our location.
                                    </p>
                                </div>
                            </div>

                            <Link to={"/login"}
                                className="group inline-flex items-center gap-x-2 py-2 px-3 bg-blue-500 hover:bg-blue-400 font-medium text-sm text-white rounded-full transition focus:outline-none"
                                href="#"
                            >
                                <ShoppingCart className="size-4" />
                                Start ordering
                            </Link>
                        </div>
                        {/* End Timeline */}
                    </div>
                    {/* End Grid */}
                </div>
            </div>
            {/* End Approach */}
        </div>
    );
}
