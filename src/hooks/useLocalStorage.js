import { useState, useEffect } from "react";
import { leerStorage, guardarStorage } from "../utils/storage";


export default function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => leerStorage(clave, valorInicial));

  useEffect(() => {
    guardarStorage(clave, valor);
  }, [clave, valor]);

  return [valor, setValor];
}
