import React, { useState, useEffect } from 'react';
import { MapPin, Search, Clock, Percent, ShoppingCart, Star, Timer, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfertasPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ofertas, setOfertas] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('all');
  const [tiempoRestante, setTiempoRestante] = useState({});

  // Datos simulados basados en tu CSV
  const productosConOfertas = [
    {
      id: "55a24889-4039-440c-a681-3e75db258c71",
      nombre: "Costilla BBQ",
      descripcion: "Costilla ahumada del día",
      categoria: "BBQ",
      cantidad: 6,
      precioRegular: 35.00,
      precioDescuento: 25.00,
      precioOferta: 20.00,
      descuento: 43,
      tiempoLimite: "2025-06-28 18:50:52",
      imagen: "🍖",
      popularidad: 4.8
    },
    {
      id: "807a2c53-3ff9-40be-9df1-18e1ed95d75c",
      nombre: "Sashimi Trío",
      descripcion: "Tres tipos de pescado fresco",
      categoria: "Sushi",
      cantidad: 5,
      precioRegular: 40.00,
      precioDescuento: 25.00,
      precioOferta: 20.00,
      descuento: 50,
      tiempoLimite: "2025-06-28 17:20:52",
      imagen: "🍣",
      popularidad: 4.9
    },
    {
      id: "61e9482f-c02f-4610-be06-c4a491fc2a6e",
      nombre: "Lasaña de Verduras",
      descripcion: "Pasta y vegetales",
      categoria: "Italiana",
      cantidad: 5,
      precioRegular: 30.00,
      precioDescuento: 17.00,
      precioOferta: 14.00,
      descuento: 53,
      tiempoLimite: "2025-06-28 17:20:52",
      imagen: "🍝",
      popularidad: 4.6
    },
    {
      id: "41fb714e-409e-4939-8537-db6e22718dce",
      nombre: "Pizza Pepperoni",
      descripcion: "Queso y pepperoni",
      categoria: "Pizza",
      cantidad: 7,
      precioRegular: 35.00,
      precioDescuento: 20.00,
      precioOferta: 16.00,
      descuento: 54,
      tiempoLimite: "2025-06-28 17:20:52",
      imagen: "🍕",
      popularidad: 4.7
    },
    {
      id: "7a8abfb1-23fa-4271-814e-d2cfc5df789a",
      nombre: "Cheesecake Maracuyá",
      descripcion: "Cheesecake de maracuyá",
      categoria: "Postres",
      cantidad: 6,
      precioRegular: 14.00,
      precioDescuento: 9.00,
      precioOferta: 7.00,
      descuento: 50,
      tiempoLimite: "2025-06-28 17:50:52",
      imagen: "🍰",
      popularidad: 4.5
    },
    {
      id: "c17660f7-b5c9-45ec-9a6b-8c2d77d3143a",
      nombre: "Alitas BBQ",
      descripcion: "Alitas en salsa",
      categoria: "BBQ",
      cantidad: 10,
      precioRegular: 20.00,
      precioDescuento: 12.00,
      precioOferta: 10.00,
      descuento: 50,
      tiempoLimite: "2025-06-28 17:20:52",
      imagen: "🍗",
      popularidad: 4.4
    }
  ];

  const categorias = [
    { id: 'all', nombre: 'Todas', emoji: '🍽️' },
    { id: 'BBQ', nombre: 'BBQ', emoji: '🔥' },
    { id: 'Sushi', nombre: 'Sushi', emoji: '🍣' },
    { id: 'Italiana', nombre: 'Italiana', emoji: '🍝' },
    { id: 'Pizza', nombre: 'Pizza', emoji: '🍕' },
    { id: 'Postres', nombre: 'Postres', emoji: '🍰' }
  ];

  useEffect(() => {
    setOfertas(productosConOfertas);

    // Simular tiempo restante
    const interval = setInterval(() => {
      const now = new Date();
      const tiempos = {};

      productosConOfertas.forEach(producto => {
        const limite = new Date(producto.tiempoLimite);
        const diff = limite - now;

        if (diff > 0) {
          const horas = Math.floor(diff / (1000 * 60 * 60));
          const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          tiempos[producto.id] = `${horas}h ${minutos}m`;
        } else {
          tiempos[producto.id] = "Expirado";
        }
      });

      setTiempoRestante(tiempos);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const ofertasFiltradas = filtroCategoria === 'all' 
    ? ofertas 
    : ofertas.filter(oferta => oferta.categoria === filtroCategoria);

  const obtenerColorUrgencia = (cantidad) => {
    if (cantidad <= 3) return 'bg-red-100 text-red-800 border-red-200';
    if (cantidad <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header de navegación igual al de Restaurantes */}
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
              <Link to="/ofertas-comida" className="text-orange-500 font-medium border-b-2 border-orange-500">Ofertas</Link>
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
              <Link to="/restaurantes" className="block py-2 text-gray-700 hover:text-orange-500">Restaurantes</Link>
              <Link to="/ofertas-comida" className="block py-2 text-orange-500 font-medium">Ofertas</Link>
              <a href="#" className="block py-2 text-gray-700 hover:text-orange-500">Mis Pedidos</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero + barra búsqueda visual */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🔥 Ofertas Especiales
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              ¡Aprovecha estos descuentos increíbles antes de que se agoten!
            </p>
            <div className="flex items-center justify-center space-x-4 text-lg mb-10">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <Timer className="w-5 h-5" />
                <span>Ofertas por tiempo limitado</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <Percent className="w-5 h-5" />
                <span>Hasta 54% OFF</span>
              </div>
            </div>
            {/* Barra búsqueda igual que en Home */}
            <div className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-2xl">
              <div className="flex items-center">
                <div className="flex items-center px-4 py-3 text-gray-600 border-r">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">La Paz, Bolivia</span>
                </div>
                <div className="flex-1 px-4">
                  <input
                    type="text"
                    disabled
                    placeholder="Busca restaurantes, comida o platos..."
                    className="w-full py-3 text-gray-700 outline-none bg-transparent"
                  />
                </div>
                <button
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:shadow-lg transition-all"
                  disabled
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* El resto de la página igual que antes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros de categoría */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtrar por categoría</h2>
          <div className="flex flex-wrap gap-3">
            {categorias.map(categoria => (
              <button
                key={categoria.id}
                onClick={() => setFiltroCategoria(categoria.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  filtroCategoria === categoria.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                }`}
              >
                <span className="text-xl">{categoria.emoji}</span>
                <span>{categoria.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid de ofertas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ofertasFiltradas.map(oferta => (
            <div key={oferta.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              {/* Badge de descuento */}
              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full font-bold text-xs flex items-center space-x-1">
                    <Percent className="w-3 h-3" />
                    <span>{oferta.descuento}%</span>
                  </div>
                </div>
                
                {/* Cantidad restante */}
                <div className="absolute top-2 right-2 z-10">
                  <div className={`px-2 py-1 rounded-full font-medium text-xs border ${obtenerColorUrgencia(oferta.cantidad)}`}>
                    {oferta.cantidad} left
                  </div>
                </div>

                {/* Imagen del producto */}
                <div className="h-32 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <span className="text-5xl">{oferta.imagen}</span>
                </div>
              </div>

              <div className="p-4">
                {/* Categoría y rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {oferta.categoria}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{oferta.popularidad}</span>
                  </div>
                </div>

                {/* Nombre y descripción */}
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{oferta.nombre}</h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{oferta.descripcion}</p>

                {/* Precios */}
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-bold text-green-600">
                      Bs. {oferta.precioOferta.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      Bs. {oferta.precioRegular.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Tiempo restante */}
                <div className="flex items-center space-x-1 mb-3 text-red-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {tiempoRestante[oferta.id] || 'Calculando...'}
                  </span>
                </div>

                {/* Botón de agregar */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 shadow-md text-sm">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay ofertas */}
        {ofertasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No hay ofertas disponibles
            </h3>
            <p className="text-gray-500">
              Intenta seleccionar una categoría diferente
            </p>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">🚀 ¡No te pierdas estas ofertas!</h2>
          <p className="text-lg mb-6">
            Las ofertas son limitadas y se actualizan constantemente. 
            ¡Ordena ahora antes de que se agoten!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <span className="font-bold">✅ Entrega rápida</span>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <span className="font-bold">💳 Pago seguro</span>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-full">
              <span className="font-bold">📱 Seguimiento en tiempo real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfertasPage;
