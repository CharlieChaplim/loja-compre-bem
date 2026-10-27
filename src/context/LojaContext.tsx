import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  atualizarProduto as atualizarNaApi,
  criarProduto as criarNaApi,
  excluirProduto as excluirNaApi,
  listarProdutos,
} from '../services/produtosApi';
import {
  carregarPreferencias,
  salvarFavoritos,
  salvarModoCompacto,
} from '../storage/preferenciasStorage';
import { Produto, ProdutoFormulario } from '../types/Produto';

type LojaContextValue = {
  produtos: Produto[];
  favoritos: string[];
  modoCompacto: boolean;
  buscando: boolean;
  carregandoMais: boolean;
  erroProdutos: string | null;
  temMaisProdutos: boolean;
  buscaAtual: string;
  buscarProdutos: (busca: string) => Promise<void>;
  recarregarProdutos: () => Promise<void>;
  carregarMaisProdutos: () => Promise<void>;
  adicionarProduto: (produto: ProdutoFormulario) => Promise<Produto>;
  atualizarProduto: (id: string, produto: ProdutoFormulario) => Promise<Produto>;
  removerProduto: (id: string) => Promise<void>;
  alternarFavorito: (produtoId: string) => void;
  alternarModoCompacto: () => void;
};

export const LojaContext = createContext<LojaContextValue | undefined>(undefined);

export function LojaProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [modoCompacto, setModoCompacto] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [buscando, setBuscando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroProdutos, setErroProdutos] = useState<string | null>(null);
  const [temMaisProdutos, setTemMaisProdutos] = useState(false);
  const [buscaAtual, setBuscaAtual] = useState('');

  const buscaRef = useRef('');
  const proximaPaginaRef = useRef(1);
  const podeCarregarMaisRef = useRef(false);
  const carregandoMaisRef = useRef(false);
  const versaoRequisicaoRef = useRef(0);

  const buscarProdutos = useCallback(async (busca: string) => {
    const termo = busca.trim();
    const versao = ++versaoRequisicaoRef.current;
    buscaRef.current = termo;
    setBuscaAtual(termo);
    setBuscando(true);
    setErroProdutos(null);
    setTemMaisProdutos(false);
    podeCarregarMaisRef.current = false;
    carregandoMaisRef.current = false;
    setCarregandoMais(false);
    try {
      const pagina = await listarProdutos(0, termo);
      if (versao !== versaoRequisicaoRef.current) return;
      setProdutos(pagina.produtos);
      proximaPaginaRef.current = 1;
      podeCarregarMaisRef.current = pagina.temMais;
      setTemMaisProdutos(pagina.temMais);
    } catch (erro) {
      if (versao !== versaoRequisicaoRef.current) return;
      setProdutos([]);
      setErroProdutos(erro instanceof Error ? erro.message : 'Falha ao carregar produtos.');
    } finally {
      if (versao === versaoRequisicaoRef.current) setBuscando(false);
    }
  }, []);

  const recarregarProdutos = useCallback(() => buscarProdutos(buscaRef.current), [buscarProdutos]);

  const carregarMaisProdutos = useCallback(async () => {
    if (carregandoMaisRef.current || !podeCarregarMaisRef.current) return;
    const versao = versaoRequisicaoRef.current;
    const paginaAtual = proximaPaginaRef.current;
    carregandoMaisRef.current = true;
    setCarregandoMais(true);
    setErroProdutos(null);
    try {
      const resultado = await listarProdutos(paginaAtual, buscaRef.current);
      if (versao !== versaoRequisicaoRef.current) return;
      setProdutos((atual) => {
        const ids = new Set(atual.map((produto) => produto.id));
        return [...atual, ...resultado.produtos.filter((produto) => !ids.has(produto.id))];
      });
      proximaPaginaRef.current = paginaAtual + 1;
      podeCarregarMaisRef.current = resultado.temMais;
      setTemMaisProdutos(resultado.temMais);
    } catch (erro) {
      if (versao === versaoRequisicaoRef.current) {
        setErroProdutos(erro instanceof Error ? erro.message : 'Falha ao carregar proxima pagina.');
      }
    } finally {
      if (versao === versaoRequisicaoRef.current) {
        carregandoMaisRef.current = false;
        setCarregandoMais(false);
      }
    }
  }, []);

  useEffect(() => { void buscarProdutos(''); }, [buscarProdutos]);

  useEffect(() => {
    let ativo = true;
    carregarPreferencias()
      .then((preferencias) => {
        if (!ativo) return;
        setFavoritos(preferencias.favoritos);
        setModoCompacto(preferencias.modoCompacto);
      })
      .catch((erro) => console.log('Erro ao carregar preferencias locais.', erro))
      .finally(() => { if (ativo) setDadosCarregados(true); });
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (dadosCarregados) {
      void salvarFavoritos(favoritos).catch(console.warn);
    }
  }, [favoritos, dadosCarregados]);

  useEffect(() => {
    if (dadosCarregados) {
      void salvarModoCompacto(modoCompacto).catch(console.warn);
    }
  }, [modoCompacto, dadosCarregados]);

  const adicionarProduto = useCallback(async (produto: ProdutoFormulario) => {
    const criado = await criarNaApi(produto);
    await buscarProdutos('');
    return criado;
  }, [buscarProdutos]);

  const atualizarProduto = useCallback(async (id: string, produto: ProdutoFormulario) => {
    const atualizado = await atualizarNaApi(id, produto);
    await recarregarProdutos();
    return atualizado;
  }, [recarregarProdutos]);

  const removerProduto = useCallback(async (id: string) => {
    await excluirNaApi(id);
    setFavoritos((atuais) => atuais.filter((atual) => atual !== id));
    await recarregarProdutos();
  }, [recarregarProdutos]);

  function alternarFavorito(produtoId: string) {
    setFavoritos((atuais) => atuais.includes(produtoId)
      ? atuais.filter((id) => id !== produtoId)
      : [...atuais, produtoId]);
  }

  function alternarModoCompacto() { setModoCompacto((atual) => !atual); }

  return (
    <LojaContext.Provider value={{
      produtos, favoritos, modoCompacto, buscando, carregandoMais, erroProdutos,
      temMaisProdutos, buscaAtual, buscarProdutos, recarregarProdutos,
      carregarMaisProdutos, adicionarProduto, atualizarProduto, removerProduto,
      alternarFavorito, alternarModoCompacto,
    }}>
      {children}
    </LojaContext.Provider>
  );
}
