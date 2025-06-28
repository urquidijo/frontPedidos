import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/config";

const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const isValid = Object.values(errors).every((e) => !e);
    const filled = Object.values(formData).every((v) => v.trim() !== "");
    setIsDisabled(!(isValid && filled));
  }, [formData, errors]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;
    if (!value.trim()) {
      error = `${
        name === "email" ? "El correo" : "La contraseña"
      } es requerido`;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Correo inválido";
    } else if (
      name === "password" &&
      (value.length < 6 || !/[A-Z]/.test(value))
    ) {
      error = "Debe tener 6 caracteres y una mayúscula";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    sessionStorage.setItem("usuario_id", data.usuario?.id);

    if (!res.ok) {
      if (data.errors?.length) {
        const newErrors = {};
        data.errors.forEach((err) => {
          newErrors[err.path] = err.msg;
        });
        setErrors((prev) => ({ ...prev, ...newErrors }));
      } else {
        alert("Error desconocido");
      }
      return;
    }

    sessionStorage.setItem("token", data.token);
    const usuario_id = data.usuario?.id;
    if (!usuario_id) {
      navigate("/Home");
      return;
    }
    let respuestas = null;
    try {
      const resp = await fetch(`${API_URL}/respuestas/${usuario_id}`);
      if (resp.status === 200) {
        navigate("/Home");
        return;
      } else if (resp.status === 404) {
        navigate(`/modalRespuestas?usuario_id=${usuario_id}`);
        return;
      } else {
        throw new Error("Error inesperado al consultar preferencias");
      }
    } catch (err) {
      alert("Error al consultar preferencias");
      return;
    }
  } catch (err) {
    alert("Error de conexión con el servidor");
    console.error(err);
  }
};


  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError("El correo es requerido");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError("Correo inválido");
      return;
    }

    console.log("Enviando recuperación a:", resetEmail);
    alert("Correo enviado 📬. Revisa tu bandeja o spam");
    setShowModal(false);
    setResetEmail("");
    setResetError("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl w-full max-w-md text-gray-900 shadow-2xl"
      >
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-3 tracking-tight">
          DeliveryFast
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Inicia sesión para gestionar tus pedidos
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Correo Electrónico</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              onChange={handleChange}
              className="bg-transparent outline-none text-gray-900 flex-1"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Contraseña</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Contraseña"
              autoComplete="current-password"
              onChange={handleChange}
              className="bg-transparent outline-none text-gray-900 flex-1"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 cursor-pointer ml-2"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg mt-2 disabled:opacity-50 transition-all"
        >
          Iniciar sesión
        </button>

        <p
          className="mt-4 text-center text-sm text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          ¿Olvidaste tu contraseña?
        </p>

        <div className="mt-3 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/signUp"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Regístrate aquí
          </Link>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-red-200 text-gray-800 rounded-xl p-6 w-full max-w-sm shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold mb-2 text-red-600">
              Recuperar contraseña
            </h3>
            <p className="text-sm mb-4 text-gray-600">
              Te enviaremos un correo para restablecerla.
            </p>

            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full p-2 mb-2 rounded border border-gray-300"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value);
                setResetError("");
              }}
            />
            {resetError && <p className="text-red-500 text-sm">{resetError}</p>}

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleResetPassword}
                className="flex-1 bg-red-500 hover:bg-red-600 py-2 text-white rounded"
              >
                Enviar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setResetEmail("");
                  setResetError("");
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
