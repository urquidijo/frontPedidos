import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

 const ModalRespuestas = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const usuario_id = sessionStorage.getItem("usuario_id");

  const [respuestas, setRespuestas] = useState(
    preguntas.reduce((acc, p) => ({ ...acc, [p.key]: 5 }), {})
  );

  const handleChange = (key, value) =>
    setRespuestas((prev) => ({ ...prev, [key]: Number(value) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      /* ───── Verificar existencia ───── */
      const check = await fetch(`${API_URL}/respuestas/${usuario_id}`);
      const existe = check.ok;               // 200 → existe, 404 → no existe

      const method = existe ? "PUT" : "POST";
      const url    = existe
        ? `${API_URL}/respuestas/${usuario_id}`
        : `${API_URL}/respuestas`;

      const body = { usuario_id, ...respuestas };

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("API error");

      alert("¡Preferencias guardadas!");
      navigate("/Home");
    } catch (err) {
      console.error(err);
      alert("Error al guardar respuestas");
    }
  };

  /* ────────────────────────── JSX ────────────────────────── */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Preferencias Alimenticias
        </h2>

        {preguntas.map(({ key, label }) => (
          <div key={key} className="mb-4">
            <label className="block font-medium mb-1">{label}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={respuestas[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full"
            />
            <div className="text-right text-sm text-gray-600">
              {respuestas[key]}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg mt-2 transition-all"
        >
          Guardar preferencias
        </button>
      </form>
    </div>
  );
}
export default ModalRespuestas;
