import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { produtosIniciais } from './src/data/produtos';
import { TelaCadastroProduto } from './src/screens/TelaCadastroProduto';
import { TelaDetalheProduto } from './src/screens/TelaDetalheProduto';
import { TelaListaProdutos } from './src/screens/TelaListaProdutos';
import { RootStackParamList } from './src/types/navigation';
import { Produto } from './src/types/Produto';

const Stack = createNativeStackNavigator<RootStackParamList>();
const CHAVE_FAVORITOS = '@compre_bem:favoritos';
const CHAVE_MODO_COMPACTO = '@compre_bem:modo_compacto';

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [modoCompacto, setModoCompacto] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  useEffect(() => {
    async function carregarDadosLocais() {
      try {
        const [favoritosSalvos, modoCompactoSalvo] = await Promise.all([
          AsyncStorage.getItem(CHAVE_FAVORITOS),
          AsyncStorage.getItem(CHAVE_MODO_COMPACTO),
        ]);

        if (favoritosSalvos !== null) {
          setFavoritos(JSON.parse(favoritosSalvos));
        }

        if (modoCompactoSalvo !== null) {
          setModoCompacto(JSON.parse(modoCompactoSalvo));
        }
      } catch (erro) {
        console.log('Não foi possível carregar os dados locais.', erro);
      } finally {
        setDadosCarregados(true);
      }
    }

    carregarDadosLocais();
  }, []);

  useEffect(() => {
    if (!dadosCarregados) return;

    AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos)).catch(
      (erro) => console.log('Não foi possível salvar os favoritos.', erro)
    );
  }, [favoritos, dadosCarregados]);

  useEffect(() => {
    if (!dadosCarregados) return;

    AsyncStorage.setItem(
      CHAVE_MODO_COMPACTO,
      JSON.stringify(modoCompacto)
    ).catch((erro) =>
      console.log('Não foi possível salvar o modo de exibição.', erro)
    );
  }, [modoCompacto, dadosCarregados]);

  function adicionarProduto(produto: Omit<Produto, 'id'>) {
    const novoProduto: Produto = {
      id: Date.now().toString(),
      ...produto,
    };

    setProdutos((listaAtual) => [...listaAtual, novoProduto]);
  }

  function alternarFavorito(produtoId: string) {
    setFavoritos((listaAtual) =>
      listaAtual.includes(produtoId)
        ? listaAtual.filter((id) => id !== produtoId)
        : [...listaAtual, produtoId]
    );
  }

  function alternarModoCompacto() {
    setModoCompacto((valorAtual) => !valorAtual);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListaProdutos">
          <Stack.Screen
            name="ListaProdutos"
            options={{ title: 'Produtos' }}
          >
            {(props) => (
              <TelaListaProdutos
                {...props}
                produtos={produtos}
                favoritos={favoritos}
                modoCompacto={modoCompacto}
                alternarFavorito={alternarFavorito}
                alternarModoCompacto={alternarModoCompacto}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="DetalheProduto"
            options={{ title: 'Detalhe do produto' }}
          >
            {(props) => (
              <TelaDetalheProduto
                {...props}
                produtos={produtos}
                favoritos={favoritos}
                alternarFavorito={alternarFavorito}
              />
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
    </SafeAreaProvider>
  );
}
