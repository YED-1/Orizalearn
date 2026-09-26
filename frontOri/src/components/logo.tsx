import React from "react";

const Logo: React.FC<{
  size?: "sm" | "md" | "lg";
  direccion?: "vertical" | "horizontal";
}> = ({ size = "md", direccion = "vertical" }) => {
  const sizes = {
    sm: "h-8 text-2xl",
    md: "h-12 text-4xl",
    lg: "h-16 text-5xl",
  };

  const esHorizontal = direccion === "horizontal";

  return (
    <div
      className={`flex items-center justify-center ${
        esHorizontal ? "flex-row gap-2.5" : "flex-col gap-2"
      }`}
    >
      {/* Isotipo: montaña con el sol saliendo detrás */}
      <svg viewBox="0 0 24 24" className={sizes[size]} aria-hidden="true">
        <circle cx="18" cy="6" r="4"className="fill-oriza-sol" />
        <path
          className="fill-oriza-tinta"
          d="M12 2L1 21h22L12 2zm0 4.19L20.1 20H3.9L12 6.19z"
        />
        <path className="fill-oriza-coral" d="M11 11h2v2h-2z" />
      </svg>
      {/* Texto de la marca */}
      <span
        className={`text-oriza-tinta font-extrabold tracking-wide ${
          esHorizontal ? "text-xl" : "text-2xl"
        }`}
      >
        OrizaLearn
      </span>
    </div>
  );
};

export default Logo;
