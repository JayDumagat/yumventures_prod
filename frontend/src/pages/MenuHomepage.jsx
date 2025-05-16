
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";


const MenuItem = ({ name, description, price, image, category }) => {
    return (
     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900">{name}</h3>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">{price}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white infline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors h-9 px-3">
                Add to Order
            </button>
        </div>
     </div>   
    );
};

export default function Menu () {
    const categories = [
      { id: "breakfast", label: "Breakfast Silog" },
      { id: "sizzling", label: "Sizzling" },
      { id: "favorite", label: "Pinoy Favorite" },
      { id: "pancit", label: "Special Pancit" },
      { id: "kambing", label: "Specialty Kambing" },
      { id: "addons", label: "Add Ons" },
    ];

    const menuItems = [
        {
            id: 1,
            name: "Tapsilog",
            description: "Juicy beef patty with lettuce, tomato, cheese, and our special sauce",
            price: "₱139",
            image: new URL("../assets/Menus/Breakfast_Silog/Tapsilog.jpeg", import.meta.url).href,
            category: "breakfast"
        },
        {
            id: 2,
            name: "Tosilog",
            description: "Juicy beef patty with lettuce, tomato, cheese, and our special sauce",
            price: "₱139",
            image: new URL("../assets/Menus/Breakfast_Silog/Tosilog.jpeg", import.meta.url).href,
            category: "breakfast"
        },
        {
            id: 3,
            name: "Sizzling Beef Tapa",
            description: "Juicy beef patty with lettuce, tomato, cheese, and our special sauce",
            price: "₱299",
            image: new URL("../assets/Menus/Sizzling/Sizzling_Beef_Tapa.jpeg", import.meta.url).href,
            category: "sizzling"
        },
        {
            id: 4,
            name: "Sizzling Pork Sisig",
            description: "Juicy beef patty with lettuce, tomato, cheese, and our special sauce",
            price: "₱299",
            image: new URL("../assets/Menus/Sizzling/Sizzling_Pork_Sisig.jpeg", import.meta.url).href,
            category: "sizzling"
        },
    ];
        return (
            <div className="min-h-screen flex flex-col">
        <Navbar/>
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-500">Menu</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our selection of delicious dishes made with fresh ingredients.
              Perfect for pickup or dine-in at our cozy location.
            </p>
          </div>
        </div>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="mains" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-blue-50">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems
                      .filter((item) => item.category === category.id)
                      .map((item) => (
                        <MenuItem
                          key={item.id}
                          name={item.name}
                          description={item.description}
                          price={item.price}
                          image={item.image}
                          category={item.category}
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Order?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Order ahead for pickup and avoid the wait. Or come visit us and enjoy the atmosphere!
            </p>
            <div>
              <Link to={"/login"}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-6 text-lg infline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background transition-colors">
                    Order Now
                </button>
              </Link>
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
        );
    }



