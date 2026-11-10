import { Platform } from 'react-native';
import { Page, Produto, ProdutoFormulario } from '../types/Produto';

type ProdutoDTO = {
  produtoId: string;
  nome: string;
  preco: number;
  descricao: string | null;
  quantidade: number;
  categoria: string | null;
  imagem: string | null;
};

// Android Emulator -> host: 10.0.2.2; Web/iOS Simulator -> localhost.
// Em dispositivo fisico com Expo Go, configure EXPO_PUBLIC_API_URL no .env com o IP LAN da sua maquina.
const URL_PADRAO = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL?.trim() || URL_PADRAO)
  .replace(/\/+$/, '');

function mapearProduto(dto: ProdutoDTO): Produto {
  return {
    produtoId: dto.produtoId,
    nome: dto.nome,
    preco: Number(dto.preco),
    descricao: dto.descricao ?? '',
    quantidade: dto.quantidade ?? 0,
    categoria: dto.categoria ?? '',
    imagem: dto.imagem ?? null,
  };
}

async function requisitar<T>(caminho: string, init?: RequestInit): Promise<T> {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 12000);

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
        if (Array.isArray(corpo.errors) && corpo.errors.length > 0) {
          detalhe = corpo.errors.map((e: any) => e.defaultMessage || e.message || String(e)).join('\n');
        } else if (corpo.errors && typeof corpo.errors === 'object') {
          detalhe = Object.values(corpo.errors).join('\n');
        } else {
          detalhe = corpo.detail || corpo.message || corpo.error || '';
        }
      } catch {
        // Corpo vazio ou nao-JSON
      }

      if (resposta.status === 404) {
        throw new Error(detalhe || 'Produto não encontrado no servidor (HTTP 404).');
      }
      if (resposta.status === 400) {
        throw new Error(detalhe || 'Dados inválidos enviados para a API (HTTP 400). Confira os campos.');
      }
      if (resposta.status >= 500) {
        throw new Error(detalhe || 'O servidor da API encontrou um erro interno (HTTP 500). Tente mais tarde.');
      }
      throw new Error(detalhe || `A requisição falhou com status HTTP ${resposta.status}.`);
    }

    if (resposta.status === 204) return undefined as T;
    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new Error('A API demorou muito para responder (tempo limite esgotado). Tente novamente.');
    }
    if (erro instanceof TypeError) {
      throw new Error(`Não foi possível conectar ao servidor em ${API_URL}. Verifique sua conexão e se a API está ligada.`);
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
  if (busca.trim()) parametros.set('filtro', busca.trim());
  const resposta = await requisitar<Page<ProdutoDTO>>(`/filtro?${parametros.toString()}`);
  return {
    produtos: resposta.content.map(mapearProduto),
    pagina: resposta.page.number,
    temMais: resposta.page.number + 1 < resposta.page.totalPages,
    total: resposta.page.totalElements,
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