import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/config";

// Lista de preguntas
const preguntas = [
  { key: "frescos",     label: "¿Cuánto te gustan los alimentos frescos?" },
  { key: "rapida",      label: "¿Qué tan importante es la rapidez al consumir comida?" },
  { key: "saludable",   label: "¿Cuánto valoras los alimentos saludables?" },
  { key: "vegano",      label: "¿Prefieres alimentos veganos o vegetarianos?" },
  { key: "dulce",       label: "¿Qué tan dulce te gusta la comida?" },
  { key: "promo",       label: "¿Con qué frecuencia aprovechas promociones o descuentos?" },
  { key: "innovador",   label: "¿Qué tanto te gustan las opciones innovadoras?" },
  { key: "tradicional", label: "¿Qué tanto prefieres lo tradicional?" },
  { key: "precio",      label: "¿Qué tanto te importa el precio?" },
  { key: "ambiental",   label: "¿Qué tanto valoras el impacto ambiental?" },
];

const BLOCK_SIZE = 4; // Cambia aquí para agrupar más o menos preguntas por bloque
const min = 1;
const max = 10;

const ModalRespuestas = () => {
  const usuario_id = sessionStorage.getItem("usuario_id");
  const navigate = useNavigate();

  const [block, setBlock] = useState(0);
  const [respuestas, setRespuestas] = useState(
    preguntas.reduce((acc, p) => ({ ...acc, [p.key]: 5 }), {})
  );
  const [loading, setLoading] = useState(false);

  // Total de bloques
  const totalBlocks = Math.ceil(preguntas.length / BLOCK_SIZE);

  // Preguntas del bloque actual
  const preguntasBlock = preguntas.slice(
    block * BLOCK_SIZE,
    (block + 1) * BLOCK_SIZE
  );

  // Cambia la respuesta de una pregunta
  const handleChange = (key, value) => {
    setRespuestas((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // Navega al siguiente o anterior bloque
  const nextBlock = () => setBlock((b) => Math.min(b + 1, totalBlocks));
  const prevBlock = () => setBlock((b) => Math.max(b - 1, 0));

  // Envía las respuestas a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const check = await fetch(`${API_URL}/respuestas/${usuario_id}`);
      const existe = check.ok;

      const method = existe ? "PUT" : "POST";
      const url = existe
        ? `${API_URL}/respuestas/${usuario_id}`
        : `${API_URL}/respuestas`;
      const body = { usuario_id, ...respuestas };

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error("Error en la API");

      alert("¡Preferencias guardadas!");
      navigate("/Home");
    } catch (err) {
      console.error(err);
      alert("Error al guardar las respuestas");
    } finally {
      setLoading(false);
    }
  };

  // Si ya completó todos los bloques, muestra el resumen antes de guardar
  if (block >= totalBlocks) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 px-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-red-500">
            Resumen de tus preferencias
          </h2>
          <ul className="mb-6 divide-y">
            {preguntas.map((p) => (
              <li key={p.key} className="flex justify-between items-center py-2 text-lg">
                <span className="text-gray-800">{p.label}</span>
                <span className="font-bold text-red-500 bg-red-100 px-4 py-1 rounded-full">
                  {respuestas[p.key]}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevBlock}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 font-semibold transition"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg transition-all shadow-md"
            >
              {loading ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Bloque de preguntas
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 px-2">
      <form
        onSubmit={(e) => { e.preventDefault(); nextBlock(); }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-red-500">
          Preferencias Alimenticias
        </h2>
        <div className="mb-6 space-y-6">
          {preguntasBlock.map(({ key, label }) => (
            <div key={key}>
              <label className="block font-semibold mb-2 text-gray-800">{label}</label>
              <div className="flex items-center gap-3">
                <span className="w-6 text-xs text-gray-500">{min}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={respuestas[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="flex-1 accent-red-500"
                  disabled={loading}
                />
                <span className="w-6 text-xs text-gray-500 text-right">{max}</span>
              </div>
              <div className="flex justify-end mt-1">
                <span className="bg-red-100 text-red-500 font-bold rounded-full px-3 py-1 text-sm shadow">
                  {respuestas[key]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={prevBlock}
            disabled={block === 0}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              block === 0
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Atrás
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg transition-all shadow-md"
          >
            {block === totalBlocks - 1 ? "Resumen" : "Siguiente"}
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Bloque <span className="font-bold">{block + 1}</span> de <span className="font-bold">{totalBlocks}</span>
        </div>
      </form>
    </div>
  );
};

export default ModalRespuestas;

/* Opcional: agrega esta animación en tu CSS global si usas Tailwind:
@keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.animate-fade-in { animation: fade-in 0.6s cubic-bezier(.4,0,.2,1); }
*/
