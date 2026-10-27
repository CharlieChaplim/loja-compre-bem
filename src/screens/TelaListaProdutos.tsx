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
    produtos, favoritos, modoCompacto, alternarFavorito, alternarModoCompacto,
    buscando, carregandoMais, erroProdutos, temMaisProdutos, buscaAtual,
    buscarProdutos, recarregarProdutos, carregarMaisProdutos,
  } = useLoja();
  const [termo, setTermo] = useState(buscaAtual);

  // Ao cadastrar, a pesquisa volta ao catalogo inteiro.
  useEffect(() => setTermo(buscaAtual), [buscaAtual]);

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
        <Text style={styles.textoBotao}>Cadastrar produto</Text>
      </TouchableOpacity>

      {buscando && produtos.length === 0 && <ActivityIndicator size="large" />}
      {!!erroProdutos && (
        <View style={styles.mensagem}>
          <Text style={styles.erro}>{erroProdutos}</Text>
          <TouchableOpacity onPress={() => void recarregarProdutos()}>
            <Text style={styles.link}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={produtos}
        keyExtractor={(produto) => produto.id}
        renderItem={({ item }) => (
          <ProdutoItem
            produto={item}
            favorito={favoritos.includes(item.id)}
            compacto={modoCompacto}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.id })}
            onFavoritar={() => alternarFavorito(item.id)}
          />
        )}
        refreshing={buscando && produtos.length > 0}
        onRefresh={() => void recarregarProdutos()}
        ListEmptyComponent={!buscando && !erroProdutos
          ? <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          : null}
        ListFooterComponent={temMaisProdutos ? (
          <TouchableOpacity
            style={styles.botaoMais}
            disabled={carregandoMais || buscando}
            onPress={() => void carregarMaisProdutos()}
          >
            {carregandoMais ? <ActivityIndicator /> : <Text style={styles.link}>Carregar mais produtos</Text>}
          </TouchableOpacity>
        ) : null}
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
  titulo: { marginTop: 12, marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' },
  preferencia: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16, padding: 12, borderRadius: 8, backgroundColor: '#F3F5F7',
  },
  textoPreferencia: { flex: 1, paddingRight: 12 },
  rotuloPreferencia: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  descricaoPreferencia: { marginTop: 3, fontSize: 13, color: '#555555' },
  pesquisa: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  inputPesquisa: {
    flex: 1, minHeight: 44, borderWidth: 1, borderColor: '#CCCCCC',
    borderRadius: 8, paddingHorizontal: 12, fontSize: 15,
  },
  botaoPesquisa: {
    minHeight: 44, backgroundColor: '#2E7D32', borderRadius: 8,
    paddingHorizontal: 14, justifyContent: 'center',
  },
  botaoCadastro: {
    minHeight: 44, marginBottom: 16, paddingHorizontal: 14, borderRadius: 8,
    backgroundColor: '#1B3A5C', justifyContent: 'center', alignItems: 'center',
  },
  textoBotao: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  lista: { paddingBottom: 20, flexGrow: 1 },
  vazio: { marginTop: 30, textAlign: 'center', color: '#555555' },
  mensagem: { paddingVertical: 10 },
  erro: { color: '#B00020', marginBottom: 8 },
  link: { fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  botaoMais: { minHeight: 50, justifyContent: 'center', alignItems: 'center' },
});
