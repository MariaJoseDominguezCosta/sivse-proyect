// src/components/SectionBanner.jsx
import React from "react";
import "../../assets/SectionBanner.css";

const SectionBanner = ({ title = "Sección" }) => {
  return (
    <div className="section-banner">
      <h2 className="section-title">{title}</h2>
      <img
        src="https://www.tecnm.mx/wp-content/uploads/2021/01/Logo-TecNM-horizontal-blanco.png"
        alt="TecNM Logo"
        className="tecnm-logo-banner"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/150x50/003366/FFFFFF?text=TecNM";
        }}
      />
    </div>
  );
};

export default SectionBanner;
