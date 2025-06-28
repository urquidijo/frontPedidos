import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/config";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
        name === "email"
          ? "El correo"
          : name === "username"
          ? "El usuario"
          : "La contraseña"
      } es requerido`;
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Correo inválido";
    } else if (
      name === "password" &&
      (value.length < 6 || !/[A-Z]/.test(value))
    ) {
      error = "Debe tener al menos 6 caracteres y una mayúscula";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Registrando usuario:", formData);

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: formData.email,
          usuario: formData.username,
          password: formData.password,
        }),
      });
      const data = await res.json();
      navigate("/");
    } catch (err) {
      alert("Error al crear la cuenta");
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl w-full max-w-md text-gray-900 shadow-2xl"
      >
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-3 tracking-tight">
          Regístrate
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Crea tu cuenta para comenzar a usar DeliveryFast
        </p>

        {/* Correo */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Correo Electrónico</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent outline-none text-gray-900 flex-1"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Usuario */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nombre de Usuario</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Tu nombre de usuario"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-transparent outline-none text-gray-900 flex-1"
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Contraseña</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              autoComplete="new-password"
              value={formData.password}
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
          Crear cuenta
        </button>

        <div className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
