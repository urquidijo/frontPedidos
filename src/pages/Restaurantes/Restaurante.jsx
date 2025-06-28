import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Star, Heart, ShoppingBag, User, Menu, X, Filter, ChevronDown, SlidersHorizontal, Phone } from 'lucide-react';
import API_URL from '../../config/config';
import { Link } from 'react-router-dom';

const RestaurantsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedZone, setSelectedZone] = useState('Todas');
  const [sortBy, setSortBy] = useState('Recomendados');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorías de tu base de datos
  const categories = [
    "Todos", "Carnes", "Ensaladas", "Pastas", "Sopas", "Vegetariano", 
    "Vegano", "Pizzas", "Postres", "Snacks", "Pollo", "Sushi"
  ];

  // Zonas extraídas de tus datos
  const zones = [
    "Todas", "Centro", "Equipetrol", "Sirari", "Urubó", "Hamacas", "Los Chacos"
  ];

  const sortOptions = [
    "Recomendados", "Mejor calificados", "Tiempo de entrega", "Precio: menor a mayor", "Precio: mayor a menor"
  ];

  // FETCH de restaurantes filtrando por categoría (y zona, si quieres hacerlo del lado backend)
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
        // Si más adelante quieres zona por backend, descomenta:
        // if (selectedZone && selectedZone !== "Todas") {
        //   params.push(`zona=${encodeURIComponent(selectedZone)}`);
        // }
        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error al obtener restaurantes');
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantes();
  }, [selectedCategory]); // Si filtras también por zona en backend, pon [selectedCategory, selectedZone]

  // Solo filtramos por zona en frontend, porque categoría ya la filtra el backend
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (selectedZone !== 'Todas' && restaurant.zona_nombre !== selectedZone) {
      return false;
    }
    return true;
  });

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
      "Carnes": "🥩",
      "Ensaladas": "🥗",
      "Pastas": "🍝",
      "Sopas": "🍲",
      "Vegetariano": "🥬",
      "Vegano": "🌱",
      "Pizzas": "🍕",
      "Postres": "🧁",
      "Snacks": "🍟",
      "Pollo": "🍗",
      "Sushi": "🍣"
    };
    return icons[category] || "🍽️";
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
              <Link to="/restaurantes" className="text-orange-500 font-medium border-b-2 border-orange-500">Restaurantes</Link>
              <Link to="/ofertas-comida" className="text-gray-700 hover:text-orange-500 transition-colors">Ofertas</Link>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Mis Pedidos</a>
            </nav>
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <User className="h-6 w-6" />
              </button>
              <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link to="/Home" className="block py-2 text-gray-700 hover:text-orange-500">Inicio</Link>
              <Link to="/restaurantes" className="block py-2 text-orange-500 font-medium">Restaurantes</Link>
              <Link to="/ofertas-comida" className="block py-2 text-gray-700 hover:text-orange-500">Ofertas</Link>
              <a href="#" className="block py-2 text-gray-700 hover:text-orange-500">Mis Pedidos</a>
            </div>
          </div>
        )}
      </header>

      {/* Search and Location Bar */}
      <section className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Location */}
            <div className="flex items-center space-x-2 text-gray-600 md:w-64">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Santa Cruz, Bolivia</span>
              <button className="text-orange-500 text-sm hover:underline">Cambiar</button>
            </div>
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Busca restaurantes, comida o platos..."
                  className="w-full bg-transparent outline-none text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-2 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <section className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {/* Zone Filter */}
              <div className="relative">
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 outline-none hover:bg-gray-50"
                >
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone === "Todas" ? "Todas las zonas" : zone}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Más filtros</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredRestaurants.length} restaurantes en {selectedZone === "Todas" ? "Santa Cruz" : selectedZone}
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 outline-none hover:bg-gray-50"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Advanced Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Cualquiera</option>
                    <option value="4.5">4.5+ estrellas</option>
                    <option value="4.0">4.0+ estrellas</option>
                    <option value="3.5">3.5+ estrellas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de entrega</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Cualquiera</option>
                    <option value="30">Menos de 30 min</option>
                    <option value="45">Menos de 45 min</option>
                    <option value="60">Menos de 1 hora</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo de envío</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Cualquiera</option>
                    <option value="free">Envío gratis</option>
                    <option value="low">Menos de $2</option>
                    <option value="medium">Menos de $5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rango de precio</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Cualquiera</option>
                    <option value="$">$ - Económico</option>
                    <option value="$$">$$ - Moderado</option>
                    <option value="$$$">$$$ - Premium</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando restaurantes...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.nombre}
                    className="w-full h-44 object-cover"
                  />
                  {/* Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(restaurant.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedRestaurants.has(restaurant.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {restaurant.deliveryFee === "Gratis" && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Envío gratis
                      </div>
                    )}
                    {restaurant.isPromoted && restaurant.discount && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {restaurant.discount}
                      </div>
                    )}
                  </div>
                  {/* Zone Badge */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                    {restaurant.zona_nombre}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{restaurant.nombre}</h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.descripcion}</p>
                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(Array.isArray(restaurant.categorias) ? restaurant.categorias.slice(0, 2) : []).map((categoria, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        <span>{getCategoryIcon(categoria)}</span>
                        <span>{categoria}</span>
                      </span>
                    ))}
                    {Array.isArray(restaurant.categorias) && restaurant.categorias.length > 2 && (
                      <span className="inline-block bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                        +{restaurant.categorias.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {restaurant.priceRange}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
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
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron restaurantes</h3>
              <p className="text-gray-500">
                Intenta cambiar los filtros o buscar en otra zona
              </p>
            </div>
          )}
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
                La mejor plataforma de delivery en Santa Cruz para disfrutar tu comida favorita en casa.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Zonas de entrega</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centro</li>
                <li>Equipetrol</li>
                <li>Sirari</li>
                <li>Urubó</li>
                <li>Hamacas</li>
                <li>Los Chacos</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Para Restaurantes</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Únete como socio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portal de restaurantes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 QuickEats Santa Cruz. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantsPage;
