import { useContext } from 'react';
import { LojaContext } from '../context/LojaContext';

export function useLoja() {
  const contexto = useContext(LojaContext);

  if (!contexto) {
    throw new Error('useLoja deve ser usado dentro de LojaProvider.');
  }

  return contexto;
}
