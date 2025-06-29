import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Trash2,
  ExternalLink,
} from "lucide-react";
import API_URL from "../../config/config.js";
import { Link, useNavigate } from "react-router-dom";

const Carrito = () => {
  const [cart, setCart] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Obtener los detalles de todos los restaurantes
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/restaurantes`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setRestaurants(data || []))
      .finally(() => setLoading(false));
  }, []);

  // Restaurantes agregados al carrito
  const carritoRestaurantes = restaurants.filter(r => cart.includes(r.id));

  // Quitar restaurante del carrito
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(rid => rid !== id);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
    sessionStorage.setItem("cart", "[]");
  };

  // Finalizar pedido (solo ejemplo, puedes agregar lógica real)
  const handleCheckout = () => {
    alert("¡Gracias por tu pedido! (Aquí iría tu lógica de checkout)");
    clearCart();
    navigate("/Home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-100 pb-12">
      <header className="bg-white/90 shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-orange-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Tu carrito
          </h1>
          <span className="ml-auto text-orange-500 font-bold text-lg">{cart.length} items</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">Cargando carrito...</div>
        ) : carritoRestaurantes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag className="mx-auto h-16 w-16 mb-4 opacity-40" />
            <p className="text-xl font-bold">¡Tu carrito está vacío!</p>
            <Link
              to="/Home"
              className="mt-6 inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition"
            >
              Ver restaurantes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {carritoRestaurantes.map((rest) => (
              <div key={rest.id} className="bg-white rounded-2xl shadow-md p-4 flex gap-4 items-center relative group border border-orange-100">
                <img
                  src={
                    rest.url && rest.url.trim() !== ""
                      ? rest.url
                      : "https://via.placeholder.com/90x90?text=Sin+Imagen"
                  }
                  alt={rest.nombre || rest.name}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{rest.nombre || rest.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{rest.descripcion || rest.description}</p>
                  {rest.url && (
                    <a
                      href={rest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-xs font-bold"
                    >
                      Ver web <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(rest.id)}
                  className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition absolute top-3 right-3"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Vaciar carrito */}
            <button
              onClick={clearCart}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
            >
              Vaciar carrito
            </button>

            {/* Finalizar pedido */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:scale-105 transition"
              disabled={carritoRestaurantes.length === 0}
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Carrito;
