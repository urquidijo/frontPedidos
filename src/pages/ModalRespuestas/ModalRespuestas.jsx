import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/config";

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

const BLOCK_SIZE = 4; // Cambia esto para agrupar más o menos preguntas

const min = 1;
const max = 10;

const ModalRespuestas = () => {
  const usuario_id = sessionStorage.getItem("usuario_id");
  const navigate   = useNavigate();

  const [block, setBlock] = useState(0);
  const [respuestas, setRespuestas] = useState(
    preguntas.reduce((acc, p) => ({ ...acc, [p.key]: 5 }), {})
  );
  const [loading, setLoading] = useState(false);

  // Agrupa preguntas en bloques
  const totalBlocks = Math.ceil(preguntas.length / BLOCK_SIZE);

  const preguntasBlock = preguntas.slice(
    block * BLOCK_SIZE,
    (block + 1) * BLOCK_SIZE
  );

  const handleChange = (key, value) => {
    setRespuestas((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const nextBlock = () => setBlock((b) => Math.min(b + 1, totalBlocks));
  const prevBlock = () => setBlock((b) => Math.max(b - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verificar si ya existen respuestas para el usuario
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

  // Si ya completó todos los bloques, mostrar resumen y guardar
  if (block >= totalBlocks) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Resumen de tus preferencias</h2>
          <ul className="mb-6">
            {preguntas.map((p) => (
              <li key={p.key} className="flex justify-between border-b py-2">
                <span>{p.label}</span>
                <span className="font-bold">{respuestas[p.key]}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevBlock}
              className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-400 transition"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all"
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={(e) => { e.preventDefault(); nextBlock(); }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Preferencias Alimenticias</h2>
        <div className="mb-6 space-y-5">
          {preguntasBlock.map(({ key, label }) => (
            <div key={key}>
              <label className="block font-medium mb-2">{label}</label>
              <input
                type="range"
                min={min}
                max={max}
                value={respuestas[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{min}</span>
                <span>{max}</span>
              </div>
              <div className="text-right font-semibold text-red-500">
                {respuestas[key]}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={prevBlock}
            disabled={block === 0}
            className={`flex-1 rounded-lg py-2 transition ${
              block === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Atrás
          </button>
          <button
            type="submit"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {block === totalBlocks - 1 ? "Resumen" : "Siguiente"}
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Bloque {block + 1} de {totalBlocks}
        </div>
      </form>
    </div>
  );
};

export default ModalRespuestas;
