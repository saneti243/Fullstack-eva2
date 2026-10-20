export const leerStorage = (clave, valorPorDefecto) => {
  try {
    const crudo = window.localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
};

export const guardarStorage = (clave, valor) => {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
  }
};
