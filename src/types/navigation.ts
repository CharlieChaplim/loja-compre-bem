export type RootStackParamList = {
  ListaProdutos: undefined;
  DetalheProduto: { produtoId: string };
  CadastroProduto: { produtoId?: string } | undefined;
};
