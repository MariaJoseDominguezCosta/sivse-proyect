import React, { useState, useEffect } from "react"; // Importar useEffect
import { Box, Link } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom"; // Importar useSearchParams
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import "../../assets/recoverPassword.css";

const RecoverPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook para leer parámetros de URL
  const urlToken = searchParams.get("token"); // Obtener el token de la URL: /recover?token=xyz

  const [email, setEmail] = useState("");
  const showResetForm = !!urlToken; // Mostrar formulario de reset si hay token en URL

  // Estado del formulario (ajustado para contener el token de la URL)
  const [formData, setFormData] = useState({
    token: urlToken || "", // Inicializar token con el valor de la URL
    newPassword: "",
    confirmPassword: "",
  });

  // Sincronizar formData si el token se carga después del render inicial
  useEffect(() => {
    if (urlToken) {
      setFormData((prev) => {
        if (prev.token === urlToken) return prev;
        return { ...prev, token: urlToken };
      });
    }
  }, [urlToken]);

  const handleSendEmail = async () => {
    // Renombrado de handleSendCode a handleSendEmail
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      toast.info(res.data.message || "Enlace de restablecimiento enviado.");
    } catch (err) {
      console.error("Error sending email", err);
      toast.error(
        err.response?.data?.error ||
          "Error al enviar el enlace. Revisa tu email."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Endpoint es /auth/reset-password
      await axios.post("/auth/reset-password", {
        token: formData.token, // Usamos el token que vino de la URL
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      navigate("/");
      toast.success("Contraseña restablecida con éxito. Inicia sesión.");
    } catch (err) {
      console.error("Reset error", err);
      toast.error(
        err.response?.data?.error || "Error al restablecer la contraseña."
      );
    }
  };

  return (
    <Box className="recuperarcontrasea-form-forgot-password-elm">
      <span  className="recuperarcontrasea-text-elm1">
        Recuperar Contraseña
      </span>

      {!showResetForm ? (
        // FORMULARIO DE ENVÍO DE EMAIL (Similar a la maqueta "Enviar enlace")
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="recuperarcontrasea-input-elm"
          />
          <Box className="recuperarcontrasea-button-group-elm">
            <button
              className="recuperarcontrasea-button-elm1"
              onClick={() => navigate("/")}
            >
              <span className="recuperarcontrasea-text-elm2">Cancelar</span>
            </button>
            <button
              onClick={handleSendEmail}
              className="recuperarcontrasea-button-elm2"
            >
                <span className="recuperarcontrasea-text-elm3">Enviar enlace</span>
            </button>
          </Box>
        </>
      ) : (
        // FORMULARIO DE RESTABLECIMIENTO (Similar a la maqueta "Nueva contraseña")
        <>
          <span
            className="recuperarcontraseavariante2-text-elm1"
          >
            Nueva contraseña
          </span>
          <input
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Value"
            className="recuperarcontraseavariante2-input-elm1"
          />
          <span
            className="recuperarcontraseavariante2-text-elm2"
          >
            Confirmar nueva contraseña
          </span>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Value"
            className="recuperarcontraseavariante2-input-elm2"
          />
          <button
            onClick={handleReset}
            className="recuperarcontraseavariante2-button-elm"
          >
            <span className="recuperarcontraseavariante2-text-elm3">Restablecer</span>
          </button>
          <Link href="/"  className="recuperarcontraseavariante2-link-elm">
            <span className="recuperarcontraseavariante2-text-elm4">
              Volver a Iniciar Sesión
            </span>
          </Link>
        </>
      )}
    </Box>
  );
};

export default RecoverPassword;
