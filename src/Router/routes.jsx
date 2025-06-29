import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/index.jsx";
import Home from "../pages/Home/index.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import Usuarios from "../pages/Usuarios/Usuarios.jsx";
import ChangePassword from "../pages/Login/ChangePassword.jsx";
import SignUp from "../pages/signUp/SingUp.jsx";
import ModalRespuestas from "../pages/ModalRespuestas/ModalRespuestas";
import Restaurante from "../pages/Restaurantes/Restaurante.jsx";
import OfertasComida from "../pages/OfertasComida/OfertasComida.jsx";
import Carrito from "../pages/Carrito/Carrito.jsx";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/change-password/:token" element={<ChangePassword />} />
      {/* Rutas protegidas */}
      <Route element={<PrivateRoutes />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/restaurantes" element={<Restaurante />} />
          <Route path="/ofertas-comida" element={<OfertasComida />} />
          <Route path="/carrito" element={<Carrito />} />
      </Route>
      <Route path="/modalRespuestas" element={<ModalRespuestas />} />
    </Routes>
  );
};

export default Router;
