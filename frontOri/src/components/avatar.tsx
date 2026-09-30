import { useSyncExternalStore } from "react";
import { User } from "lucide-react";
import { obtenerFoto, suscribirFoto } from "../lib/fotoperfil";

interface AvatarProps {
  // Clases de tamaño, p. ej. "w-10 h-10"
  tamano: string;
  // Sin foto se muestran las iniciales; sin iniciales, un icono
  iniciales?: string;
  claseTexto?: string;
}

export default function Avatar({
  tamano,
  iniciales,
  claseTexto = "text-lg",
}: AvatarProps) {
  const foto = useSyncExternalStore(suscribirFoto, obtenerFoto);

  return (
    <span
      className={`${tamano} shrink-0 rounded-full bg-oriza-sol-suave border-2 border-oriza-coral flex items-center justify-center overflow-hidden`}
    >
      {foto ? (
        <img src={foto} alt="Foto de perfil" className="w-full h-full object-cover" />
      ) : iniciales ? (
        <span className={`${claseTexto} font-extrabold text-oriza-tinta`}>
          {iniciales}
        </span>
      ) : (
        <User className="w-3/5 h-3/5 text-oriza-tinta/70" />
      )}
    </span>
  );
}
