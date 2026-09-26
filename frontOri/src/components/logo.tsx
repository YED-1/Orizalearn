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
      {/* Isotipo del montaña */}
      <svg
        viewBox="0 0 24 24"
        className={`${sizes[size]} fill-white drop-shadow-md`}
        aria-hidden="true"
      >
        <path d="M12 2L1 21h22L12 2zm0 4.19L20.1 20H3.9L12 6.19z" />
        <path d="M11 11h2v2h-2z" />
      </svg>
      {/* Texto de la marca */}
      <span
        className={`text-white font-bold tracking-wide drop-shadow-sm ${
          esHorizontal ? "text-xl" : "text-2xl"
        }`}
      >
        OrizaLearn
      </span>
    </div>
  );
};

export default Logo;
