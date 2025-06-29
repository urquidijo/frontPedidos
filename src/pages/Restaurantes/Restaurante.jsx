import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Filter,
  ChevronDown,
  SlidersHorizontal,
  Phone,
  CheckCircle,
} from "lucide-react";
import API_URL from "../../config/config";
import { Link } from "react-router-dom";

const RestaurantsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedZone, setSelectedZone] = useState("Todas");
  const [sortBy, setSortBy] = useState("Recomendados");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------ Carrito ------
  const [cart, setCart] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (restaurant) => {
    if (!cart.includes(restaurant.id)) {
      setCart([...cart, restaurant.id]);
      setToast(`${restaurant.nombre || restaurant.name || "Restaurante"} agregado al carrito`);
      setTimeout(() => setToast(null), 1800);
    } else {
      setToast(`Ya está en el carrito`);
      setTimeout(() => setToast(null), 1200);
    }
  };

  // ------------ Categorías y zonas -------------
  const categories = [
    "Todos",
    "Carnes",
    "Ensaladas",
    "Pastas",
    "Sopas",
    "Vegetariano",
    "Vegano",
    "Pizzas",
    "Postres",
    "Snacks",
    "Pollo",
    "Sushi",
  ];

  const zones = [
    "Todas",
    "Centro",
    "Equipetrol",
    "Sirari",
    "Urubó",
    "Hamacas",
    "Los Chacos",
  ];

  const sortOptions = [
    "Recomendados",
    "Mejor calificados",
    "Tiempo de entrega",
    "Precio: menor a mayor",
    "Precio: mayor a menor",
  ];

  // ------------- FETCH de restaurantes ----------------
  useEffect(() => {
    const fetchRestaurantes = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}/restaurantes`;
        const params = [];
        if (selectedCategory && selectedCategory !== "Todos") {
          params.push(`categoria=${encodeURIComponent(selectedCategory)}`);
        }
        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener restaurantes");
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantes();
  }, [selectedCategory]);

  // --- Solo filtra zona en frontend
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (selectedZone !== "Todas" && restaurant.zona_nombre !== selectedZone) {
      return false;
    }
    return true;
  });

  // --- Like
  const toggleLike = (restaurantId) => {
    const newLiked = new Set(likedRestaurants);
    if (newLiked.has(restaurantId)) {
      newLiked.delete(restaurantId);
    } else {
      newLiked.add(restaurantId);
    }
    setLikedRestaurants(newLiked);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Carnes: "🥩",
      Ensaladas: "🥗",
      Pastas: "🍝",
      Sopas: "🍲",
      Vegetariano: "🥬",
      Vegano: "🌱",
      Pizzas: "🍕",
      Postres: "🧁",
      Snacks: "🍟",
      Pollo: "🍗",
      Sushi: "🍣",
    };
    return icons[category] || "🍽️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast de carrito */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-lg z-50 text-lg animate-bounce-in">
          <CheckCircle className="w-6 h-6" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                QuickEats
              </span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/Home"
                className="text-gray-700 hover:text-orange-500 transition-all duration-200 hover:scale-105"
              >
                Inicio
              </Link>
              <Link
                to="/restaurantes"
                className="text-orange-500 font-medium relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-red-500 after:rounded-full"
              >
                Comidas
              </Link>
              <Link
                to="/ofertas-comida"
                className="text-gray-700 hover:text-orange-500 transition-all duration-200 hover:scale-105"
              >
                Productos
              </Link>
              <Link
                to="/carrito"
                className="text-gray-700 hover:text-orange-500 transition-all duration-200 hover:scale-105 relative"
              >
                <ShoppingBag className="h-6 w-6 inline-block text-orange-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
                <span className="ml-2">Mis Pedidos</span>
              </Link>
            </nav>
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-orange-500 transition-all duration-200 hover:scale-110 rounded-full hover:bg-orange-50">
                <User className="h-6 w-6" />
              </button>
              <button
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
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
          <div className="md:hidden bg-white/95 backdrop-blur-md">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/Home"
                className="block py-3 text-gray-700 hover:text-orange-500 rounded-lg hover:bg-orange-50 px-3 transition-all duration-200"
              >
                Inicio
              </Link>
              <Link
                to="/restaurantes"
                className="block py-3 text-orange-500 font-medium bg-orange-50 rounded-lg px-3"
              >
                Restaurantes
              </Link>
              <Link
                to="/ofertas-comida"
                className="block py-3 text-gray-700 hover:text-orange-500 rounded-lg hover:bg-orange-50 px-3 transition-all duration-200"
              >
                Ofertas
              </Link>
              <Link
                to="/carrito"
                className="block py-3 text-gray-700 hover:text-orange-500 rounded-lg hover:bg-orange-50 px-3 transition-all duration-200"
              >
                Mis Pedidos
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search and Location Bar */}
      <section className="bg-white/80 backdrop-blur-md py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Location */}
            <div className="flex items-center space-x-3 text-gray-600 md:w-64 bg-gray-50 rounded-xl px-4 py-3">
              <MapPin className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Santa Cruz, Bolivia</span>
              <button className="text-orange-500 text-sm hover:underline font-medium">
                Cambiar
              </button>
            </div>
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Busca restaurantes, comida o platos..."
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-100"
                }`}
              >
                {category !== "Todos" && (
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                )}
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Zones and Sort */}
      <section className="bg-white/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {/* Zone Filter */}
              <div className="relative">
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 outline-none hover:shadow-md transition-all duration-200 font-medium"
                >
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone === "Todas" ? "Todas las zonas" : zone}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white font-medium"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Más filtros</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 font-medium">
                {filteredRestaurants.length} restaurantes en{" "}
                {selectedZone === "Todas" ? "Santa Cruz" : selectedZone}
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 outline-none hover:shadow-md transition-all duration-200 font-medium"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Advanced Filter Panel */}
          {isFilterOpen && (
            <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Aquí tus filtros adicionales */}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">
                Cargando restaurantes...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        restaurant.image ||
                        restaurant.url ||
                        "https://via.placeholder.com/300x150?text=Sin+Imagen"
                      }
                      alt={restaurant.nombre}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(restaurant.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedRestaurants.has(restaurant.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    {/* BOTÓN AGREGAR AL CARRITO */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(restaurant);
                      }}
                      className="absolute bottom-4 right-4 p-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition"
                      title="Agregar al carrito"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {restaurant.deliveryFee === "Gratis" && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          Envío gratis
                        </div>
                      )}
                      {restaurant.isPromoted && restaurant.discount && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {restaurant.discount}
                        </div>
                      )}
                    </div>
                    {/* Zone Badge */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {restaurant.zona_nombre}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">
                          {restaurant.nombre}
                        </h3>
                        {restaurant.url && (
                          <a
                            href={restaurant.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline break-all"
                          ></a>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 ml-3 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-800">
                          {restaurant.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {restaurant.descripcion}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Array.isArray(restaurant.categorias)
                        ? restaurant.categorias.slice(0, 2)
                        : []
                      ).map((categoria, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium border border-orange-100"
                        >
                          <span>{getCategoryIcon(categoria)}</span>
                          <span>{categoria}</span>
                        </span>
                      ))}
                      {Array.isArray(restaurant.categorias) &&
                        restaurant.categorias.length > 2 && (
                          <span className="inline-block bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                            +{restaurant.categorias.length - 2}
                          </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-700">
                          {restaurant.priceRange}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{restaurant.telefono}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        ({restaurant.reviewCount} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-300 text-8xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No se encontraron restaurantes
              </h3>
              <p className="text-gray-500 text-lg">
                Intenta cambiar los filtros o buscar en otra zona
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">QuickEats</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                La mejor plataforma de delivery en Santa Cruz para disfrutar tu
                comida favorita en casa.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-orange-400">
                Zonas de entrega
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-orange-400 transition-colors cursor-pointer">
                  Centro
                </li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">
                  Equipetrol
                </li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">
                  Sirari
                </li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">
                  Urubó
                </li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">
                  Hamacas
                </li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">
                  Los Chacos
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-orange-400">
                Soporte
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-orange-400">
                Para Restaurantes
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Únete como socio
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Portal de restaurantes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Marketing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Recursos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">
              &copy; 2025 QuickEats Santa Cruz. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantsPage;
