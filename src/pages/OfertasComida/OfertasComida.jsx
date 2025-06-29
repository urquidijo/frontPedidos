import React, { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X, CheckCircle } from "lucide-react";
import API_URL from "../../config/config";
import { Link } from "react-router-dom";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrito: igual que en Home
  const [cart, setCart] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProductos(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Igual a Home, pero para productos
  const addToCart = (producto) => {
    if (!cart.includes(producto.id)) {
      setCart([...cart, producto.id]);
      setToast(`${producto.nombre} agregado al carrito`);
      setTimeout(() => setToast(null), 1800);
    } else {
      setToast("Ya está en el carrito");
      setTimeout(() => setToast(null), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-lg z-50 text-lg animate-bounce-in">
          <CheckCircle className="w-6 h-6" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/90 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg shadow">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow">
                Supermercado
              </span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/Home"
                className="text-gray-700 hover:text-orange-500 font-semibold transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/restaurantes"
               className="text-gray-700 hover:text-orange-500 font-semibold transition-colors relative"
              >
                Comidas
              </Link>
              <Link
                to="/ofertas-comida"
                className="text-orange-500 font-medium relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-red-500 after:rounded-full"
              >
                Productos
              </Link>

              <Link
                to="/carrito"
                className="text-gray-700 hover:text-orange-500 font-semibold transition-colors relative"
              >
                <ShoppingBag className="h-6 w-6 inline-block text-orange-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
                <span className="ml-2">Carrito</span>
              </Link>
            </nav>
            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <button
                className="group p-2 rounded-full hover:bg-orange-100 transition relative"
                title="Perfil"
              >
                <User className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
              </button>
              <button
                className="md:hidden p-2 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
              <Link
                to="/Home"
               className="block py-3 text-gray-700 hover:text-orange-500 rounded-lg hover:bg-orange-50 px-3 transition-all duration-200"
              >
                Inicio
              </Link>
              <Link
                to="/restaurantes"
               className="block py-3 text-gray-700 hover:text-orange-500 rounded-lg hover:bg-orange-50 px-3 transition-all duration-200"
              >
                Comidas
              </Link>
              <Link
                to="/ofertas-comida"
                className="block py-3 text-orange-500 font-medium bg-orange-50 rounded-lg px-3"
              >
                Productos
              </Link>
              <Link
                to="/carrito"
                className="block py-3 text-gray-700 hover:text-orange-500 rounded-lg hover:bg-orange-50 px-3 transition-all duration-200"
              >
                Carrito
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Grid de productos */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Ofertas y Productos Perecederos
        </h1>
        {loading ? (
          <div className="text-center py-16">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag className="mx-auto h-16 w-16 mb-4 opacity-40" />
            <p className="text-xl font-bold">
              ¡No hay productos en este momento!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col group border border-orange-100 hover:-translate-y-1 transition"
              >
                <div className="relative">
                  <img
                    src={
                      producto.imagen_url && producto.imagen_url.trim() !== ""
                        ? producto.imagen_url
                        : "https://via.placeholder.com/200x200?text=Sin+Imagen"
                    }
                    alt={producto.nombre}
                    className="w-full h-40 object-cover rounded-xl bg-gray-100 mb-4"
                  />
                  {/* Botón agregar al carrito (esquina inferior derecha) */}
                  <button
                    onClick={() => addToCart(producto)}
                    className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition"
                    title="Agregar al carrito"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {producto.nombre}
                </h3>
                <p className="text-gray-600 text-sm flex-1">
                  {producto.descripcion}
                </p>
                <button
                  onClick={() => addToCart(producto)}
                  className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer igual al RestaurantsPage */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">Supermercado</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                La mejor plataforma de supermercado online para productos
                frescos y perecederos.
              </p>
            </div>
            {/* ...más secciones del footer igual que tu código... */}
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">
              &copy; 2025 QuickEats Supermercado. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductosPage;
