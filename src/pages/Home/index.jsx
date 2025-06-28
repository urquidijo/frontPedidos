import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import IA_API from "../../config/IAconfing.js";
import API_URL from "../../config/config.js";
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState(new Set());
  const [respuestas, setRespuestas] = useState([]);
  const usuarioId = sessionStorage.getItem("usuario_id"); // o como tengas guardado el ID

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const res = await fetch(`${API_URL}/respuestas/${usuarioId}`);
        if (!res.ok) throw new Error("Error al obtener respuestas");
        const data = await res.json();
        const response = await fetch(`${API_URL}/clasificar-grupo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // objeto con los puntajes
        });
        if (!response.ok) throw new Error("Error al obtener respuestas");
        const dataGroup = await response.json();
        console.log("Grupo de respuestas:", dataGroup);
      } catch (error) {
        console.error("Error al obtener respuestas:", error);
      }
    };

    if (usuarioId) fetchRespuestas();
  }, [usuarioId]);

  const restaurants = [
    {
      id: 1,
      name: "La Italiana",
      category: "Italiana",
      rating: 4.8,
      deliveryTime: "25-35 min",
      deliveryFee: "Gratis",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      description: "Auténtica comida italiana con ingredientes frescos",
    },
    {
      id: 2,
      name: "Sushi Tokyo",
      category: "Japonesa",
      rating: 4.9,
      deliveryTime: "30-40 min",
      deliveryFee: "$2.99",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      description: "El mejor sushi de la ciudad, preparado por chefs expertos",
    },
    {
      id: 3,
      name: "Burger Palace",
      category: "Americana",
      rating: 4.6,
      deliveryTime: "20-30 min",
      deliveryFee: "Gratis",
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      description: "Hamburguesas gourmet con ingredientes premium",
    },
    {
      id: 4,
      name: "Tacos El Primo",
      category: "Mexicana",
      rating: 4.7,
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      description: "Auténticos tacos mexicanos con sabores tradicionales",
    },
    {
      id: 5,
      name: "Healthy Bowl",
      category: "Saludable",
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "Gratis",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      description: "Bowls nutritivos y deliciosos para una vida saludable",
    },
    {
      id: 6,
      name: "Pizza Corner",
      category: "Italiana",
      rating: 4.4,
      deliveryTime: "25-35 min",
      deliveryFee: "$2.50",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      description:
        "Pizzas artesanales con masa crujiente y ingredientes frescos",
    },
  ];

  const categories = [
    { name: "Pizza", icon: "🍕", color: "bg-orange-100 text-orange-600" },
    { name: "Sushi", icon: "🍣", color: "bg-pink-100 text-pink-600" },
    { name: "Burger", icon: "🍔", color: "bg-yellow-100 text-yellow-600" },
    { name: "Tacos", icon: "🌮", color: "bg-green-100 text-green-600" },
    { name: "Saludable", icon: "🥗", color: "bg-emerald-100 text-emerald-600" },
    { name: "Postres", icon: "🍰", color: "bg-purple-100 text-purple-600" },
  ];

  const toggleLike = (restaurantId) => {
    const newLiked = new Set(likedRestaurants);
    if (newLiked.has(restaurantId)) {
      newLiked.delete(restaurantId);
    } else {
      newLiked.add(restaurantId);
    }
    setLikedRestaurants(newLiked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                QuickEats
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/Home" className="text-gray-700 hover:text-orange-500 transition-colors">Inicio</Link>
              <Link to="/restaurantes" className="text-gray-700 hover:text-orange-500 transition-colors">Restaurantes</Link>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Ofertas</a>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Mis Pedidos</a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <User className="h-6 w-6" />
              </button>
              <button
                className="md:hidden p-2 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link to="/Home" className="block py-2 text-gray-700 hover:text-orange-500">Inicio</Link>
              <Link to="/restaurantes" className="block py-2 text-gray-700 hover:text-orange-500">Restaurantes</Link>
              <a href="#" className="block py-2 text-gray-700 hover:text-orange-500">Ofertas</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-orange-500">Mis Pedidos</a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-orange-500"
              >
                Inicio
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-orange-500"
              >
                Restaurantes
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-orange-500"
              >
                Ofertas
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-orange-500"
              >
                Mis Pedidos
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Tu comida favorita,
              <span className="block text-yellow-300">a domicilio</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Descubre los mejores restaurantes de tu ciudad
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-2xl">
              <div className="flex items-center">
                <div className="flex items-center px-4 py-3 text-gray-600 border-r">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">La Paz, Bolivia</span>
                </div>
                <div className="flex-1 px-4">
                  <input
                    type="text"
                    placeholder="Busca restaurantes, comida o platos..."
                    className="w-full py-3 text-gray-700 outline-none"
                  />
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:shadow-lg transition-all">
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`${category.color} p-4 rounded-xl text-center hover:scale-105 transition-transform`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Restaurants */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Restaurantes recomendados para ti
            </h2>
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleLike(restaurant.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        likedRestaurants.has(restaurant.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  {restaurant.deliveryFee === "Gratis" && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Envío gratis
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {restaurant.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="font-medium">
                      {restaurant.deliveryFee === "Gratis"
                        ? "Envío gratis"
                        : `Envío ${restaurant.deliveryFee}`}
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {restaurant.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Descarga nuestra app!
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Obtén descuentos exclusivos y delivery más rápido
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              App Store
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">QuickEats</span>
              </div>
              <p className="text-gray-400">
                La mejor plataforma de delivery para disfrutar tu comida
                favorita en casa.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Prensa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Para Restaurantes</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Únete como socio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Portal de restaurantes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Marketing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Recursos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 QuickEats. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
