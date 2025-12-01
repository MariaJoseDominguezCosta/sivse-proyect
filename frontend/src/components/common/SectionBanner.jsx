// src/components/common/SectionBanner.jsx
import React from "react";
// Importar CSS si SectionBanner.css no está importado globalmente
import "../../assets/SectionBanner.css";

const SectionBanner = ({ title = "Sección" }) => {
  const isDashboard = title === "";

  return (
    // Si no es un dashboard, o si quieres mostrar el título, usa el estilo normal
    <div
      className="section-banner"
      style={
        isDashboard ? { justifyContent: "flex-end", padding: "1rem 30px" } : {}
      }
    >
      {/* El título solo se muestra si NO estamos en el Dashboard de inicio del egresado */}
      {!isDashboard && <h2 className="section-title">{title}</h2>}
      <img
        // Usamos una ruta local que represente el logo del TecNM en el diseño
        src="/tecnm-logo-blue.png"
        alt="TecNM Logo"
        className="tecnm-logo-banner"
        onError={(e) => {
          // Fallback en caso de que la imagen local no cargue
          e.target.src =
            "https://via.placeholder.com/150x50/FFFFFF/003366?text=TecNM";
        }}
        style={isDashboard ? { height: "30px" } : {}}
      />
    </div>
  );
};

export default SectionBanner;
