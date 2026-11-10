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
  const { favoritos, alternarFavorito, removerProduto } = useLoja();
  const { produtoId } = route.params;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const carregarDetalhes = useCallback(() => {
    let ativo = true;
    setCarregando(true);
    setConfirmarExclusao(false);
    setErro('');

    consultarProduto(produtoId)
      .then((item) => {
        if (ativo) setProduto(item);
      })
      .catch((falha) => {
        if (ativo) setErro(falha instanceof Error ? falha.message : 'Erro ao consultar produto.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [produtoId]);

  useFocusEffect(carregarDetalhes);

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
      {carregando && (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1B3A5C" />
          <Text style={styles.textoCarregando}>Carregando detalhes do produto...</Text>
        </View>
      )}

      {/* Tratamento quando o produto não existe ou falha a conexão (sem tela em branco) */}
      {!carregando && (!!erro || !produto) && (
        <View style={styles.cardErro}>
          <Text style={styles.tituloErro}>
            {erro.includes('404') || !produto ? 'Produto não encontrado' : 'Falha de comunicação'}
          </Text>
          <Text style={styles.textoErro}>
            {erro || 'O produto selecionado não foi encontrado ou já foi excluído do catálogo.'}
          </Text>
          <TouchableOpacity style={styles.botaoPrincipal} onPress={() => carregarDetalhes()}>
            <Text style={styles.textoBotaoPrincipal}>Tentar novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSecundario} onPress={() => navigation.goBack()}>
            <Text style={styles.textoBotaoSecundario}>Voltar para a lista</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Exibição normal do produto */}
      {!carregando && !erro && !!produto && (
        <View style={styles.detalhe}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
          <Text style={styles.descricao}>{produto.descricao || 'Sem descrição cadastrada.'}</Text>
          {!!produto.categoria && <Text style={styles.metadado}>Categoria: {produto.categoria}</Text>}
          <Text style={styles.metadado}>Quantidade em estoque: {produto.quantidade} unidade(s)</Text>

          <TouchableOpacity style={styles.botao} onPress={() => alternarFavorito(produto.produtoId)}>
            <Text style={styles.textoBotao}>
              {favoritos.includes(produto.produtoId) ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('CadastroProduto', { produtoId })}
          >
            <Text style={styles.textoBotao}>Editar produto</Text>
          </TouchableOpacity>

          {!confirmarExclusao ? (
            <TouchableOpacity style={styles.botao} onPress={() => setConfirmarExclusao(true)}>
              <Text style={styles.textoExcluir}>Excluir produto</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.blocoExclusao}>
              <Text style={styles.aviso}>Excluir definitivamente este produto da loja?</Text>
              <TouchableOpacity
                style={[styles.botao, styles.botaoConfirmarExcluir]}
                disabled={excluindo}
                onPress={() => void confirmarRemocao()}
              >
                <Text style={styles.textoConfirmarExclusao}>
                  {excluindo ? 'Excluindo...' : 'Sim, excluir do catálogo'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                disabled={excluindo}
                onPress={() => setConfirmarExclusao(false)}
              >
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
  centro: { paddingVertical: 40, alignItems: 'center' },
  textoCarregando: { marginTop: 10, color: '#555555', fontSize: 15 },
  detalhe: { padding: 18, borderRadius: 8, backgroundColor: '#F3F5F7' },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C' },
  preco: { marginTop: 10, fontSize: 18, color: '#2E7D32', fontWeight: 'bold' },
  descricao: { marginTop: 14, fontSize: 15, lineHeight: 22, color: '#333333' },
  metadado: { marginTop: 12, fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  botao: {
    minHeight: 44,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1B3A5C',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  textoBotao: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  textoExcluir: { fontSize: 15, fontWeight: 'bold', color: '#B00020' },
  blocoExclusao: { marginTop: 14, padding: 12, borderRadius: 8, backgroundColor: '#FFEBEE' },
  aviso: { fontWeight: 'bold', color: '#B00020', textAlign: 'center', marginBottom: 6 },
  botaoConfirmarExcluir: { backgroundColor: '#B00020', borderColor: '#B00020' },
  textoConfirmarExclusao: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  cardErro: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
  },
  tituloErro: { fontSize: 18, fontWeight: 'bold', color: '#B00020', marginBottom: 8, textAlign: 'center' },
  textoErro: { fontSize: 15, color: '#444444', textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  botaoPrincipal: {
    minHeight: 44,
    width: '100%',
    backgroundColor: '#B00020',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotaoPrincipal: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  botaoSecundario: {
    minHeight: 44,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B00020',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoSecundario: { color: '#B00020', fontWeight: 'bold', fontSize: 15 },
});