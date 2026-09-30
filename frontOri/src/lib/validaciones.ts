// Un símbolo es cualquier carácter que no sea letra, número ni espacio (igual que en schemas/user.py)
export const tieneSimbolo = (texto: string) => /[^\p{L}\p{N}\s]/u.test(texto);

// Misma regla que validar_password del backend; devuelve "" si la contraseña es válida
export function validarPassword(password: string, confirmacion: string): string {
  if (password.length < 12) {
    return "La contraseña debe tener al menos 12 caracteres.";
  }
  if (!tieneSimbolo(password)) {
    return "La contraseña debe incluir al menos un símbolo (por ejemplo: ! @ # $ % - _).";
  }
  if (password !== confirmacion) {
    return "Las contraseñas no coinciden.";
  }
  return "";
}
