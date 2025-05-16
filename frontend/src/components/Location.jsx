import React from "react";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

export default function Location() {
    return (
        <section className="py-10 sm:py-16 bg-white" id="location">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
                            Visit <span className="text-blue-500">Yumventure</span>
                        </h2>
                        <p className="text-gray-600 max-w-lg text-sm sm:text-base text-center md:text-left mx-auto md:mx-0">
                            Located in the heart of downtown, Yumventure Food Hub offers a cozy atmosphere perfect for both quick pickups and leisurely dine-in expeirences.
                        </p>

                        <div className="space-y-4 mt-6 sm:mt-8">
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 sm:h-6 text-blue-500 mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Our Location</h3>
                                    <p className="text-gray-600 texy-xs sm:text-sm">1375 San Marcelino St, Paco, Manila,<br/> 1006 Metro Manila</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="h-5 w-5 sm:h-6 text-blue-500 mt-1 mr-2 sm:mr-3 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Opening Hours</h3>
                                    <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 text-gray-600 text-xs sm:text-sm">
                                        <div>
                                            <p>Monday - Friday</p>
                                            <p>Saturday</p>
                                            <p>Sunday</p>
                                        </div>
                                        <div>
                                            <p>Open 24 hours</p>
                                            <p>Open 24 hours</p>
                                            <p>Open 24 hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Phone className="h-5 w-5 sm:h-6 text-blue-500 mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Contact</h3>
                                    <p className="text-gray-600 texy-xs sm:text-sm">(02) 8254 6989</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-4">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 h-9 sm:h-10 px-3 sm:px-4 infline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors">
                                Get Directions
                            </button>
                        </div>
                    </div>

                    <div className="relative rounded-xl overflow-hidden shadow-xl h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] mt-6 md:mt-0">
                        <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.332022673181!2d120.98850340000001!3d14.5801471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c98d86d9b4bf%3A0xd15a8e2c8f3e84b4!2sYumventures%20Food%20Hub%20(formerly%20CNJ%20Restaurant)!5e0!3m2!1sen!2sph!4v1744967860756!5m2!1sen!2sph"
                        width={"100%"}
                        height={"100%"}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                        title="Yumventure Location"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}