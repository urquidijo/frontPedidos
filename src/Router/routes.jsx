import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/index.jsx";
import Home from "../pages/Home/index.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import Usuarios from "../pages/Usuarios/Usuarios.jsx";
import Proveedores from "../pages/Proveedores/Proveedores.jsx";
import ChangePassword from "../pages/Login/ChangePassword.jsx";
import FormularioQuejas from "../pages/Sugerencias/FormularioQuejas.jsx";
import SignUp from "../pages/signUp/SingUp.jsx";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/change-password/:token" element={<ChangePassword />} />
      {/* Ruta pública para quejas */}
      <Route path="/quejas-publicas" element={<FormularioQuejas />} />
      {/* Rutas protegidas */}
      <Route element={<PrivateRoutes />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/proveedores" element={<Proveedores />} />
      </Route>
    </Routes>
  );
};

export default Router;
