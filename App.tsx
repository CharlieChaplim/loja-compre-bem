import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Produto = {
  id: string;
  nome: string;
  preco: string;
  descricao: string;
  quantidade: number;
};

type RootStackParamList = {
  ListaProdutos: undefined;
  DetalheProduto: { produtoId: string };
  CadastroProduto: undefined;
};

type ListaProps = NativeStackScreenProps<
  RootStackParamList,
  'ListaProdutos'
>;

type DetalheProps = NativeStackScreenProps<
  RootStackParamList,
  'DetalheProduto'
>;

type CadastroProps = NativeStackScreenProps<
  RootStackParamList,
  'CadastroProduto'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const produtosIniciais: Produto[] = [
  {
    id: '1',
    nome: 'Cadeira Confort Plus',
    preco: 'R$ 349,90',
    descricao:
      'Cadeira ergonômica com encosto acolchoado e ajuste de altura.',
    quantidade: 8,
  },
  {
    id: '2',
    nome: 'Mesa Office 120',
    preco: 'R$ 499,90',
    descricao:
      'Mesa para escritório com 120 cm de largura e estrutura reforçada.',
    quantidade: 5,
  },
  {
    id: '3',
    nome: 'Luminária Flex',
    preco: 'R$ 89,90',
    descricao:
      'Luminária de mesa articulada com iluminação direcionável.',
    quantidade: 15,
  },
  {
    id: '4',
    nome: 'Estante Compacta',
    preco: 'R$ 279,90',
    descricao:
      'Estante com cinco nichos para livros, caixas e objetos decorativos.',
    quantidade: 6,
  },
  {
    id: '5',
    nome: 'Gaveteiro Mobile',
    preco: 'R$ 229,90',
    descricao:
      'Gaveteiro com três compartimentos e rodízios para fácil movimentação.',
    quantidade: 9,
  },
  {
    id: '6',
    nome: 'Suporte para Notebook',
    preco: 'R$ 119,90',
    descricao:
      'Suporte elevado para notebook com estrutura leve e ventilada.',
    quantidade: 12,
  },
];

function ProdutoItem({
  produto,
  onPress,
}: {
  produto: Produto;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.preco}>{produto.preco}</Text>
      <Text style={styles.estoqueLista}>
        Estoque: {produto.quantidade} unidade(s)
      </Text>
      <Text style={styles.acao}>Toque para ver detalhes</Text>
    </TouchableOpacity>
  );
}

function TelaListaProdutos({
  navigation,
  produtos,
}: ListaProps & { produtos: Produto[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Loja Compre Bem</Text>

      <TouchableOpacity
        style={styles.botaoCadastro}
        onPress={() => navigation.navigate('CadastroProduto')}
      >
        <Text style={styles.textoBotao}>Cadastrar produto</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(produto) => produto.id}
        renderItem={({ item }) => (
          <ProdutoItem
            produto={item}
            onPress={() =>
              navigation.navigate('DetalheProduto', {
                produtoId: item.id,
              })
            }
          />
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

function TelaDetalheProduto({
  route,
  produtos,
}: DetalheProps & { produtos: Produto[] }) {
  const { produtoId } = route.params;
  const produto = produtos.find((item) => item.id === produtoId);

  if (!produto) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detalhe}>
        <Text style={styles.nomeDetalhe}>{produto.nome}</Text>
        <Text style={styles.precoDetalhe}>{produto.preco}</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>
        <Text style={styles.quantidadeDetalhe}>
          Quantidade em estoque: {produto.quantidade}
        </Text>
      </View>
    </View>
  );
}

function TelaCadastroProduto({
  navigation,
  adicionarProduto,
}: CadastroProps & {
  adicionarProduto: (produto: Omit<Produto, 'id'>) => void;
}) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const [erroFormulario, setErroFormulario] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');

  function cadastrarProduto() {
    setErroFormulario('');
    setErroQuantidade('');

    if (nome.trim() === '') {
      setErroFormulario('Informe o nome do produto.');
      return;
    }

    const precoNumero = Number(preco.replace(',', '.'));

    if (
      preco.trim() === '' ||
      Number.isNaN(precoNumero) ||
      precoNumero <= 0
    ) {
      setErroFormulario('Informe um preço válido maior que zero.');
      return;
    }

    if (quantidade.trim() === '') {
      setErroQuantidade('Informe a quantidade em estoque.');
      return;
    }

    const quantidadeNumero = Number(quantidade);

    if (
      Number.isNaN(quantidadeNumero) ||
      !Number.isInteger(quantidadeNumero) ||
      quantidadeNumero < 0
    ) {
      setErroQuantidade(
        'A quantidade deve ser um número inteiro igual ou maior que zero.'
      );
      return;
    }

    adicionarProduto({
      nome: nome.trim(),
      preco: `R$ ${precoNumero.toFixed(2).replace('.', ',')}`,
      descricao: 'Produto cadastrado pelo formulário.',
      quantidade: quantidadeNumero,
    });

    setNome('');
    setPreco('');
    setQuantidade('');

    Alert.alert('Sucesso', 'Produto cadastrado com sucesso.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de produto</Text>

      <Text style={styles.rotulo}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.rotulo}>Preço</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 49,90"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />

      <Text style={styles.rotulo}>Quantidade em estoque</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 10"
        value={quantidade}
        onChangeText={(texto) => {
          setQuantidade(texto);
          if (erroQuantidade !== '') {
            setErroQuantidade('');
          }
        }}
        keyboardType="numeric"
      />

      {erroFormulario !== '' && (
        <Text style={styles.erro}>{erroFormulario}</Text>
      )}

      {erroQuantidade !== '' && (
        <Text style={styles.erro}>{erroQuantidade}</Text>
      )}

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={cadastrarProduto}
      >
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);

  function adicionarProduto(produto: Omit<Produto, 'id'>) {
    const novoProduto: Produto = {
      id: Date.now().toString(),
      ...produto,
    };

    setProdutos((listaAtual) => [...listaAtual, novoProduto]);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaProdutos">
        <Stack.Screen
          name="ListaProdutos"
          options={{ title: 'Produtos' }}
        >
          {(props) => (
            <TelaListaProdutos {...props} produtos={produtos} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="DetalheProduto"
          options={{ title: 'Detalhe do produto' }}
        >
          {(props) => (
            <TelaDetalheProduto {...props} produtos={produtos} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="CadastroProduto"
          options={{ title: 'Cadastrar produto' }}
        >
          {(props) => (
            <TelaCadastroProduto
              {...props}
              adicionarProduto={adicionarProduto}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  preco: {
    marginTop: 6,
    fontSize: 16,
    color: '#2E7D32',
  },
  estoqueLista: {
    marginTop: 5,
    fontSize: 14,
    color: '#555555',
  },
  acao: {
    marginTop: 8,
    fontSize: 13,
    color: '#555555',
  },
  detalhe: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
  },
  nomeDetalhe: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  precoDetalhe: {
    marginTop: 10,
    fontSize: 18,
    color: '#2E7D32',
  },
  descricao: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
  },
  quantidadeDetalhe: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  botaoCadastro: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#1B3A5C',
    alignItems: 'center',
  },
  botaoSalvar: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rotulo: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  erro: {
    marginTop: 10,
    fontSize: 14,
    color: '#B00020',
  },
});
