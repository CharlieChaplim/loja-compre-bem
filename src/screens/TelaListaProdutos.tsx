import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProdutoItem } from '../components/ProdutoItem';
import { RootStackParamList } from '../types/navigation';
import { Produto } from '../types/Produto';

type ListaProps = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'>;

type Props = ListaProps & {
  produtos: Produto[];
  favoritos: string[];
  modoCompacto: boolean;
  alternarFavorito: (produtoId: string) => void;
  alternarModoCompacto: () => void;
};

export function TelaListaProdutos({
  navigation,
  produtos,
  favoritos,
  modoCompacto,
  alternarFavorito,
  alternarModoCompacto,
}: Props) {
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
            favorito={favoritos.includes(item.id)}
            compacto={modoCompacto}
            onPress={() =>
              navigation.navigate('DetalheProduto', { produtoId: item.id })
            }
            onFavoritar={() => alternarFavorito(item.id)}
          />
        )}
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  preferencia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
  },
  textoPreferencia: {
    flex: 1,
    paddingRight: 12,
  },
  rotuloPreferencia: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  descricaoPreferencia: {
    marginTop: 3,
    fontSize: 13,
    color: '#555555',
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
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lista: {
    paddingBottom: 20,
  },
});
