import { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoja } from '../hooks/useLoja';
import { consultarProduto } from '../services/produtosApi';
import { formatarPreco, Produto } from '../types/Produto';
import { RootStackParamList } from '../types/navigation';

type DetalheProps = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'>;

export function TelaDetalheProduto({ route, navigation }: DetalheProps) {
  const { produtos, favoritos, alternarFavorito, removerProduto } = useLoja();
  const { produtoId } = route.params;
  const [produtoRemoto, setProdutoRemoto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const produto = produtoRemoto ?? produtos.find((item) => item.id === produtoId);

  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    setConfirmarExclusao(false);
    setErro('');
    consultarProduto(produtoId)
      .then((item) => { if (ativo) setProdutoRemoto(item); })
      .catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Erro ao consultar produto.'); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [produtoId]));

  async function confirmarRemocao() {
    setExcluindo(true);
    setErro('');
    try {
      await removerProduto(produtoId);
      navigation.goBack();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Falha ao remover produto.');
      setExcluindo(false);
      setConfirmarExclusao(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {carregando && <ActivityIndicator />}
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
      {!produto && !carregando && <Text style={styles.titulo}>Produto não encontrado.</Text>}
      {!!produto && (
        <View style={styles.detalhe}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
          <Text style={styles.descricao}>{produto.descricao || 'Sem descrição.'}</Text>
          {!!produto.categoria && <Text style={styles.quantidade}>Categoria: {produto.categoria}</Text>}
          <Text style={styles.quantidade}>Quantidade em estoque: {produto.quantidade}</Text>
          <TouchableOpacity style={styles.botao} onPress={() => alternarFavorito(produto.id)}>
            <Text style={styles.textoBotao}>
              {favoritos.includes(produto.id) ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('CadastroProduto', { produtoId })}>
            <Text style={styles.textoBotao}>Editar produto</Text>
          </TouchableOpacity>
          {!confirmarExclusao ? (
            <TouchableOpacity style={styles.botao} onPress={() => setConfirmarExclusao(true)}>
              <Text style={styles.textoExcluir}>Excluir produto</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.aviso}>Excluir definitivamente este produto?</Text>
              <TouchableOpacity style={styles.botao} disabled={excluindo} onPress={() => void confirmarRemocao()}>
                <Text style={styles.textoExcluir}>{excluindo ? 'Excluindo...' : 'Sim, excluir'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botao} disabled={excluindo} onPress={() => setConfirmarExclusao(false)}>
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' },
  detalhe: { padding: 18, borderRadius: 8, backgroundColor: '#F3F5F7' },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C' },
  preco: { marginTop: 10, fontSize: 18, color: '#2E7D32' },
  descricao: { marginTop: 14, fontSize: 15, lineHeight: 22, color: '#333333' },
  quantidade: { marginTop: 14, fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  botao: {
    minHeight: 44, marginTop: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#1B3A5C', borderRadius: 8,
  },
  textoBotao: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  textoExcluir: { fontSize: 15, fontWeight: 'bold', color: '#B00020' },
  aviso: { marginTop: 18, fontWeight: 'bold', color: '#B00020' },
  erro: { color: '#B00020', marginBottom: 12 },
});
