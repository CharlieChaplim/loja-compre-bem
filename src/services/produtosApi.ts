import { Platform } from 'react-native';
import { Produto, ProdutoFormulario } from '../types/Produto';

type ProdutoDTO = {
  produtoId: string;
  nome: string;
  preco: number;
  descricao: string | null;
  quantidade: number;
  categoria: string | null;
  imagem: string | null;
};

type PaginaDTO = {
  content: ProdutoDTO[];
  number: number;
  size: number;
  last: boolean;
  totalElements: number;
};

// Android Emulator -> host: 10.0.2.2; Web/iOS Simulator -> localhost.
// No dispositivo fisico, configure EXPO_PUBLIC_API_URL com o IP LAN do computador.
const URL_PADRAO = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL?.trim() || URL_PADRAO)
  .replace(/\/+$/, '');

function mapearProduto(dto: ProdutoDTO): Produto {
  return {
    id: dto.produtoId,
    nome: dto.nome,
    preco: Number(dto.preco),
    descricao: dto.descricao ?? '',
    quantidade: dto.quantidade,
    categoria: dto.categoria ?? '',
    imagem: dto.imagem ?? null,
  };
}

async function requisitar<T>(caminho: string, init?: RequestInit): Promise<T> {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 15000);
  try {
    const resposta = await fetch(`${API_URL}/api/v1/produtos${caminho}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      signal: controlador.signal,
    });

    if (!resposta.ok) {
      let detalhe = '';
      try {
        const corpo = await resposta.json();
        detalhe = corpo.detail || corpo.message || '';
      } catch {
        // O corpo do erro pode estar vazio ou nao ser JSON.
      }
      throw new Error(detalhe || `API retornou HTTP ${resposta.status}.`);
    }

    if (resposta.status === 204) return undefined as T;
    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new Error('A API demorou para responder. Tente novamente.');
    }
    if (erro instanceof TypeError) {
      throw new Error(`Nao foi possivel conectar a ${API_URL}. Confira a rede e se a API esta ligada.`);
    }
    throw erro;
  } finally {
    clearTimeout(timeout);
  }
}

export type PaginaProdutos = {
  produtos: Produto[];
  pagina: number;
  temMais: boolean;
  total: number;
};

export async function listarProdutos(pagina = 0, busca = ''): Promise<PaginaProdutos> {
  const parametros = new URLSearchParams({ page: String(pagina), size: '20' });
  if (busca.trim()) parametros.set('busca', busca.trim());
  const resposta = await requisitar<PaginaDTO>(`?${parametros.toString()}`);
  return {
    produtos: resposta.content.map(mapearProduto),
    pagina: resposta.number,
    temMais: !resposta.last,
    total: resposta.totalElements,
  };
}

export async function consultarProduto(id: string): Promise<Produto> {
  return mapearProduto(await requisitar<ProdutoDTO>(`/${encodeURIComponent(id)}`));
}

export async function criarProduto(produto: ProdutoFormulario): Promise<Produto> {
  const dto = await requisitar<ProdutoDTO>('', {
    method: 'POST',
    body: JSON.stringify(produto),
  });
  return mapearProduto(dto);
}

export async function atualizarProduto(id: string, produto: ProdutoFormulario): Promise<Produto> {
  const dto = await requisitar<ProdutoDTO>(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(produto),
  });
  return mapearProduto(dto);
}

export async function excluirProduto(id: string): Promise<void> {
  await requisitar<void>(`/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
