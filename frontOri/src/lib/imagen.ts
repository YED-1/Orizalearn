export const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
export const TAMANO_MAXIMO_ORIGINAL = 10 * 1024 * 1024;

// Recorta la imagen al centro en un cuadrado y la reduce, para subir unos pocos KB
export async function prepararFotoPerfil(archivo: File, lado = 256): Promise<Blob> {
  let imagen: ImageBitmap;
  try {
    imagen = await createImageBitmap(archivo);
  } catch {
    throw new Error("No pudimos leer la imagen. Prueba con otro archivo.");
  }

  const recorte = Math.min(imagen.width, imagen.height);
  const lienzo = document.createElement("canvas");
  lienzo.width = lado;
  lienzo.height = lado;
  const contexto = lienzo.getContext("2d");
  if (!contexto) {
    imagen.close();
    throw new Error("Tu navegador no pudo procesar la imagen.");
  }

  // Fondo blanco para que las zonas transparentes de un PNG no queden negras en JPG
  contexto.fillStyle = "#ffffff";
  contexto.fillRect(0, 0, lado, lado);
  contexto.drawImage(
    imagen,
    (imagen.width - recorte) / 2,
    (imagen.height - recorte) / 2,
    recorte,
    recorte,
    0,
    0,
    lado,
    lado,
  );
  imagen.close();

  return new Promise((resolver, rechazar) => {
    lienzo.toBlob(
      (blob) =>
        blob
          ? resolver(blob)
          : rechazar(new Error("Tu navegador no pudo procesar la imagen.")),
      "image/jpeg",
      0.9,
    );
  });
}
