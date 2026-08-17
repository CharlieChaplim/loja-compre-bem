import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Produto = { id: string; nome: string; preco: string; descricao: string };
type RootStackParamList = { ListaProdutos: undefined; DetalheProduto: { produtoId: string } };
type ListaProps = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'>;
type DetalheProps = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'>;
const Stack = createNativeStackNavigator<RootStackParamList>();

const produtosMock: Produto[] = [
  { id: '1', nome: 'Cadeira Confort Plus', preco: 'R$ 349,90', descricao: 'Cadeira ergonômica com encosto acolchoado e ajuste de altura.' },
  { id: '2', nome: 'Mesa Office 120', preco: 'R$ 499,90', descricao: 'Mesa para escritório com 120 cm de largura e estrutura reforçada.' },
  { id: '3', nome: 'Luminária Flex', preco: 'R$ 89,90', descricao: 'Luminária de mesa articulada com iluminação direcionável.' },
  { id: '4', nome: 'Estante Compacta', preco: 'R$ 279,90', descricao: 'Estante com cinco nichos para livros, caixas e objetos decorativos.' },
  { id: '5', nome: 'Gaveteiro Mobile', preco: 'R$ 229,90', descricao: 'Gaveteiro com três compartimentos e rodízios para fácil movimentação.' },
  { id: '6', nome: 'Suporte para Notebook', preco: 'R$ 119,90', descricao: 'Suporte elevado para notebook com estrutura leve e ventilada.' },
];

function ProdutoItem({ produto, onPress }: { produto: Produto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.preco}>{produto.preco}</Text>
      <Text style={styles.acao}>Toque para ver detalhes</Text>
    </TouchableOpacity>
  );
}

function TelaListaProdutos({ navigation }: ListaProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Loja Compre Bem</Text>
      <FlatList
        data={produtosMock}
        keyExtractor={(produto) => produto.id}
        renderItem={({ item }) => (
          <ProdutoItem
            produto={item}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.id })}
          />
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

function TelaDetalheProduto({ route }: DetalheProps) {
  const { produtoId } = route.params;
  const produto = produtosMock.find((item) => item.id === produtoId);
  if (!produto) return <View style={styles.container}><Text style={styles.titulo}>Produto não encontrado.</Text></View>;
  return (
    <View style={styles.container}>
      <View style={styles.detalhe}>
        <Text style={styles.nomeDetalhe}>{produto.nome}</Text>
        <Text style={styles.precoDetalhe}>{produto.preco}</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaProdutos">
        <Stack.Screen name="ListaProdutos" component={TelaListaProdutos} options={{ title: 'Produtos' }} />
        <Stack.Screen name="DetalheProduto" component={TelaDetalheProduto} options={{ title: 'Detalhe do produto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  titulo: { marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' },
  lista: { paddingBottom: 20 },
  card: { marginBottom: 12, padding: 16, borderRadius: 8, backgroundColor: '#F3F5F7' },
  nome: { fontSize: 17, fontWeight: 'bold', color: '#1B3A5C' },
  preco: { marginTop: 6, fontSize: 16, color: '#2E7D32' },
  acao: { marginTop: 8, fontSize: 13, color: '#555555' },
  detalhe: { padding: 18, borderRadius: 8, backgroundColor: '#F3F5F7' },
  nomeDetalhe: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C' },
  precoDetalhe: { marginTop: 10, fontSize: 18, color: '#2E7D32' },
  descricao: { marginTop: 14, fontSize: 15, lineHeight: 22, color: '#333333' },
});
