import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoja } from '../hooks/useLoja';
import { RootStackParamList } from '../types/navigation';

type DetalheProps = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'>;

export function TelaDetalheProduto({ route }: DetalheProps) {
  const { produtos, favoritos, alternarFavorito } = useLoja();
  const { produtoId } = route.params;
  const produto = produtos.find((item) => item.id === produtoId);

  if (!produto) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <Text style={styles.titulo}>Produto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const favorito = favoritos.includes(produto.id);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.detalhe}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.preco}>{produto.preco}</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>
        <Text style={styles.quantidade}>
          Quantidade em estoque: {produto.quantidade}
        </Text>

        <TouchableOpacity
          style={styles.botaoFavorito}
          onPress={() => alternarFavorito(produto.id)}
        >
          <Text style={styles.textoFavorito}>
            {favorito ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  detalhe: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  preco: {
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
  quantidade: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  botaoFavorito: {
    minHeight: 44,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1B3A5C',
    borderRadius: 8,
  },
  textoFavorito: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
});
