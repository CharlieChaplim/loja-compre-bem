// Modelo usado pela interface: UUID do backend e preco numerico em reais.
export type Produto = {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
  categoria: string;
  imagem: string | null;
};

export type ProdutoFormulario = {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
  categoria: string;
  imagem: string | null;
};

export function formatarPreco(preco: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco);
}
