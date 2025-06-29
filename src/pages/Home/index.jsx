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
  LogOut,
  ExternalLink,
} from "lucide-react";
import API_URL from "../../config/config.js";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState(new Set());
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [preferencias, setPreferencias] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingRest, setLoadingRest] = useState(true);
  const usuarioId = sessionStorage.getItem("usuario_id");
  const navigate = useNavigate();

  // --- Carrito: ids de restaurantes/platos
  const [cart, setCart] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (restaurant) => {
    if (!cart.includes(restaurant.id)) {
      setCart([...cart, restaurant.id]);
    }
  };

  // --- User
  useEffect(() => {
    if (!usuarioId) return;
    setUserLoading(true);
    fetch(`${API_URL}/users/${usuarioId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data || null);
        setUserLoading(false);
      })
      .catch(() => setUserLoading(false));
  }, [usuarioId]);

  // --- Preferencias
  useEffect(() => {
    if (!usuarioId) return;
    fetch(`${API_URL}/respuestas/${usuarioId}`)
      .then(res => res.ok ? res.json() : {})
      .then(data => setPreferencias(data || {}));
  }, [usuarioId]);

  // --- Restaurantes
  useEffect(() => {
    setLoadingRest(true);
    fetch(`${API_URL}/restaurantes`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setRestaurants(data || []))
      .finally(() => setLoadingRest(false));
  }, []);

  // --- Lógica de recomendación
  useEffect(() => {
    if (!restaurants.length) return;

    const getScore = (rest) => {
      let score = 0;
      if (preferencias.saludable > 6 && rest.categorias?.includes("Saludable")) score += 2;
      if (preferencias.frescos > 6 && rest.descripcion?.toLowerCase().includes("fresco")) score += 1.5;
      if (preferencias.tradicional > 6 && rest.categorias?.includes("Tradicional")) score += 1.5;
      if (preferencias.vegano > 6 && rest.categorias?.includes("Vegano")) score += 1.5;
      if (preferencias.precio > 6 && rest.precio && rest.precio < 60) score += 1.2;
      score += rest.rating || 0;
      return score;
    };

    const ordered = [...restaurants]
      .map(r => ({ ...r, _score: getScore(r) }))
      .sort((a, b) => b._score - a._score);

    setRecommended(ordered.slice(0, 12));
  }, [restaurants, preferencias]);

  // Like/Unlike
  const toggleLike = (restaurantId) => {
    const newLiked = new Set(likedRestaurants);
    if (newLiked.has(restaurantId)) newLiked.delete(restaurantId);
    else newLiked.add(restaurantId);
    setLikedRestaurants(newLiked);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100">
      {/* Header */}
      <header className="bg-white/90 shadow-sm sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg shadow">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow">
                QuickEats
              </span>
            </div>
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/Home" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Inicio</Link>
              <Link to="/restaurantes" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Comidas</Link>
              <Link to="/ofertas-comida" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Productos</Link>
              <Link to="/carrito" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Mis Pedidos</Link>
            </nav>
            {/* User & Carrito */}
            <div className="flex items-center space-x-2">
              {/* Carrito */}
              <Link
                to="/carrito"
                className="relative text-gray-700 hover:text-orange-500 font-semibold transition-colors"
                title="Ver carrito"
              >
                <ShoppingBag className="h-6 w-6 text-orange-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
              <button className="group p-2 rounded-full hover:bg-orange-100 transition relative" title="Perfil">
                <User className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
              </button>
              <button className="group p-2 rounded-full hover:bg-red-100 transition relative"
                onClick={handleLogout} title="Cerrar sesión">
                <LogOut className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
              </button>
              <button className="md:hidden p-2 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link to="/Home" className="block py-2 text-gray-700 hover:text-orange-500 font-semibold">Inicio</Link>
              <Link to="/restaurantes" className="block py-2 text-gray-700 hover:text-orange-500 font-semibold">Comidas</Link>
              <Link to="/ofertas-comida" className="block py-2 text-gray-700 hover:text-orange-500 font-semibold">Productos</Link>
              <Link
                to="/carrito"
                className="block py-2 text-gray-700 hover:text-orange-500 font-semibold"
              >
                Mis Pedidos
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition font-semibold"
              >
                <LogOut className="h-5 w-5" /> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Bienvenida */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-3">
        <div className="flex flex-col items-center">
          <div className="w-full text-left md:text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent drop-shadow mb-2">
              {userLoading ? "Cargando..." :
                user?.usuario
                  ? <>Bienvenido, <span className="capitalize">{user.usuario}</span> 👋</>
                  : <>Bienvenido 👋</>
              }
            </h2>
            <p className="text-lg text-gray-600">
              Aquí tienes restaurantes recomendados solo para ti:
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Restaurants */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingRest ? (
            <div className="text-center py-16">Cargando restaurantes...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommended.map((restaurant) => (
                <div key={restaurant.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-orange-100"
                >
                  <div className="relative group">
                    <img
                      src={
                        restaurant.url && restaurant.url.trim() !== ""
                          ? restaurant.url
                          : "https://via.placeholder.com/400x225?text=Sin+Imagen"
                      }
                      alt={restaurant.nombre || restaurant.name}
                      className="w-full h-56 object-cover transition-transform duration-200 group-hover:scale-105 bg-gray-100"
                    />
                    <button
                      onClick={() => toggleLike(restaurant.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                      title="Me gusta"
                    >
                      <Heart
                        className={`h-6 w-6 ${likedRestaurants.has(restaurant.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-300"
                          }`}
                      />
                    </button>
                    <button
                      onClick={() => addToCart(restaurant)}
                      className="absolute bottom-4 right-4 p-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition"
                      title="Agregar al carrito"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                    {restaurant.deliveryFee === "Gratis" && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Envío gratis
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-extrabold text-gray-900">{restaurant.nombre || restaurant.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-gray-700">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-base mb-4">{restaurant.descripcion || restaurant.description}</p>
                    
                    {/* BLOQUE DE PRECIOS */}
                    {restaurant.precio_descuento ? (
                      <div className="mb-2 flex items-end gap-3">
                        <span className="text-base md:text-lg font-semibold text-gray-400 line-through decoration-red-500 decoration-2">
                          Bs. {restaurant.precio}
                        </span>
                        <span className="text-2xl md:text-3xl font-extrabold text-orange-600">
                          Bs. {restaurant.precio_descuento}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <span className="text-2xl md:text-3xl font-extrabold text-gray-700">
                          Bs. {restaurant.precio}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime || restaurant.tiempoEntrega}</span>
                      </div>
                      <div className="font-semibold">
                        {restaurant.deliveryFee === "Gratis"
                          ? "Envío gratis"
                          : `Envío ${restaurant.deliveryFee}`}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-auto">
                      <span className="inline-block bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {Array.isArray(restaurant.categorias) ? restaurant.categorias.join(", ") : (restaurant.category || "Comida")}
                      </span>
                      {restaurant.url &&
                        <a
                          href={restaurant.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline ml-2 text-xs font-bold"
                        >
                          Ver web <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {recommended.length === 0 && !loadingRest && (
            <div className="text-center text-lg text-gray-400 mt-12">No hay recomendaciones por ahora.</div>
          )}
        </div>
      </section>
      {/* Footer igual que antes */}
      <footer className="bg-gray-900 text-white py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">QuickEats</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                La mejor plataforma de delivery para disfrutar tu comida favorita en casa.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Para Restaurantes</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Únete como socio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portal de restaurantes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
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
  