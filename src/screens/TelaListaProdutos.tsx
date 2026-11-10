import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProdutoItem } from '../components/ProdutoItem';
import { useLoja } from '../hooks/useLoja';
import { RootStackParamList } from '../types/navigation';

type ListaProps = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'>;

export function TelaListaProdutos({ navigation }: ListaProps) {
  const {
    produtos,
    favoritos,
    modoCompacto,
    alternarFavorito,
    alternarModoCompacto,
    buscando,
    carregandoMais,
    erroProdutos,
    temMaisProdutos,
    buscaAtual,
    buscarProdutos,
    recarregarProdutos,
    carregarMaisProdutos,
  } = useLoja();

  const [termo, setTermo] = useState(buscaAtual);

  useEffect(() => {
    setTermo(buscaAtual);
  }, [buscaAtual]);

  function lidarComFimDaLista() {
    if (temMaisProdutos && !carregandoMais && !buscando && produtos.length > 0) {
      void carregarMaisProdutos();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Text style={styles.titulo}>Loja Compre Bem</Text>

      <View style={styles.preferencia}>
        <View style={styles.textoPreferencia}>
          <Text style={styles.rotuloPreferencia}>Modo compacto</Text>
          <Text style={styles.descricaoPreferencia}>
            {modoCompacto
              ? 'Cards menores para mostrar mais produtos.'
              : 'Cards com mais espaço entre as informações.'}
          </Text>
        </View>
        <Switch value={modoCompacto} onValueChange={alternarModoCompacto} />
      </View>

      <View style={styles.pesquisa}>
        <TextInput
          style={styles.inputPesquisa}
          placeholder="Buscar por nome"
          accessibilityLabel="Buscar produtos por nome"
          value={termo}
          onChangeText={setTermo}
          returnKeyType="search"
          onSubmitEditing={() => void buscarProdutos(termo)}
        />
        <TouchableOpacity style={styles.botaoPesquisa} onPress={() => void buscarProdutos(termo)}>
          <Text style={styles.textoBotao}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.botaoCadastro}
        onPress={() => navigation.navigate('CadastroProduto')}
      >
        <Text style={styles.textoBotao}>+ Cadastrar novo produto</Text>
      </TouchableOpacity>

      {/* Carregamento inicial */}
      {buscando && produtos.length === 0 && (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1B3A5C" />
          <Text style={styles.textoCarregando}>Carregando catálogo...</Text>
        </View>
      )}

      {/* Erro quando a lista está vazia (ex: API fora do ar) */}
      {!buscando && !!erroProdutos && produtos.length === 0 && (
        <View style={styles.cardErro}>
          <Text style={styles.tituloErro}>Não foi possível carregar os produtos</Text>
          <Text style={styles.textoErro}>{erroProdutos}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={() => void recarregarProdutos()}>
            <Text style={styles.textoBotaoTentar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Aviso de erro no topo caso ocorra durante navegação com lista preenchida */}
      {!!erroProdutos && produtos.length > 0 && (
        <View style={styles.bannerAlerta}>
          <Text style={styles.textoBanner}>{erroProdutos}</Text>
          <TouchableOpacity onPress={() => void recarregarProdutos()}>
            <Text style={styles.linkBanner}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista com scroll infinito */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.produtoId}
        renderItem={({ item }) => (
          <ProdutoItem
            produto={item}
            favorito={favoritos.includes(item.produtoId)}
            compacto={modoCompacto}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.produtoId })}
            onFavoritar={() => alternarFavorito(item.produtoId)}
          />
        )}
        refreshing={buscando && produtos.length > 0}
        onRefresh={() => void recarregarProdutos()}
        onEndReached={lidarComFimDaLista}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          !buscando && !erroProdutos ? (
            <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          ) : null
        }
        ListFooterComponent={
          carregandoMais ? (
            <View style={styles.carregandoMais}>
              <ActivityIndicator size="small" color="#1B3A5C" />
              <Text style={styles.textoCarregandoMais}>Carregando mais produtos...</Text>
            </View>
          ) : !temMaisProdutos && produtos.length > 0 ? (
            <Text style={styles.fimLista}>Todos os produtos foram carregados ({produtos.length}).</Text>
          ) : null
        }
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
  titulo: { marginTop: 12, marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' },
  preferencia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
  },
  textoPreferencia: { flex: 1, paddingRight: 12 },
  rotuloPreferencia: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  descricaoPreferencia: { marginTop: 3, fontSize: 13, color: '#555555' },
  pesquisa: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  inputPesquisa: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  botaoPesquisa: {
    minHeight: 44,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  botaoCadastro: {
    minHeight: 44,
    marginBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#1B3A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  lista: { paddingBottom: 24, flexGrow: 1 },
  vazio: { marginTop: 40, textAlign: 'center', color: '#666666', fontSize: 16 },
  centro: { paddingVertical: 40, alignItems: 'center' },
  textoCarregando: { marginTop: 10, color: '#555555', fontSize: 15 },
  cardErro: {
    marginVertical: 20,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
  },
  tituloErro: { fontSize: 16, fontWeight: 'bold', color: '#B00020', marginBottom: 6, textAlign: 'center' },
  textoErro: { fontSize: 14, color: '#444444', textAlign: 'center', marginBottom: 14 },
  botaoTentar: {
    minHeight: 44,
    paddingHorizontal: 18,
    backgroundColor: '#B00020',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoTentar: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  bannerAlerta: {
    padding: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoBanner: { flex: 1, color: '#E65100', fontSize: 13, marginRight: 8 },
  linkBanner: { color: '#B00020', fontWeight: 'bold', fontSize: 13 },
  carregandoMais: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  textoCarregandoMais: { marginTop: 6, fontSize: 13, color: '#555555' },
  fimLista: { textAlign: 'center', paddingVertical: 16, fontSize: 13, color: '#888888' },
});