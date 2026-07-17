import React from "react";

const Logo: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizes = {
    sm: "h-8 text-2xl",
    md: "h-12 text-4xl",
    lg: "h-16 text-5xl",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
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
      <span className="text-white font-bold tracking-wide text-2xl drop-shadow-sm">
        OrizaLearn
      </span>
    </div>
  );
};

export default Logo;
