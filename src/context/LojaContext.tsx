import { createContext, ReactNode, useEffect, useState } from 'react';
import { produtosIniciais } from '../data/produtos';
import {
  carregarPreferencias,
  salvarFavoritos,
  salvarModoCompacto,
} from '../storage/preferenciasStorage';
import { Produto } from '../types/Produto';

type LojaContextValue = {
  produtos: Produto[];
  favoritos: string[];
  modoCompacto: boolean;
  adicionarProduto: (produto: Omit<Produto, 'id'>) => void;
  alternarFavorito: (produtoId: string) => void;
  alternarModoCompacto: () => void;
};

export const LojaContext = createContext<LojaContextValue | undefined>(
  undefined
);

type LojaProviderProps = {
  children: ReactNode;
};

export function LojaProvider({ children }: LojaProviderProps) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [modoCompacto, setModoCompacto] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const preferencias = await carregarPreferencias();
        setFavoritos(preferencias.favoritos);
        setModoCompacto(preferencias.modoCompacto);
      } catch (erro) {
        console.log('Não foi possível carregar os dados locais.', erro);
      } finally {
        setDadosCarregados(true);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (!dadosCarregados) return;

    salvarFavoritos(favoritos).catch((erro) =>
      console.log('Não foi possível salvar os favoritos.', erro)
    );
  }, [favoritos, dadosCarregados]);

  useEffect(() => {
    if (!dadosCarregados) return;

    salvarModoCompacto(modoCompacto).catch((erro) =>
      console.log('Não foi possível salvar o modo de exibição.', erro)
    );
  }, [modoCompacto, dadosCarregados]);

  function adicionarProduto(produto: Omit<Produto, 'id'>) {
    const novoProduto: Produto = {
      id: Date.now().toString(),
      ...produto,
    };

    setProdutos((listaAtual) => [...listaAtual, novoProduto]);
  }

  function alternarFavorito(produtoId: string) {
    setFavoritos((listaAtual) =>
      listaAtual.includes(produtoId)
        ? listaAtual.filter((id) => id !== produtoId)
        : [...listaAtual, produtoId]
    );
  }

  function alternarModoCompacto() {
    setModoCompacto((valorAtual) => !valorAtual);
  }

  return (
    <LojaContext.Provider
      value={{
        produtos,
        favoritos,
        modoCompacto,
        adicionarProduto,
        alternarFavorito,
        alternarModoCompacto,
      }}
    >
      {children}
    </LojaContext.Provider>
  );
}
