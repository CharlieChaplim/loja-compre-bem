import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Produto } from '../types/Produto';

type Props = {
  produto: Produto;
  favorito: boolean;
  compacto: boolean;
  onPress: () => void;
  onFavoritar: () => void;
};

export function ProdutoItem({
  produto,
  favorito,
  compacto,
  onPress,
  onFavoritar,
}: Props) {
  return (
    <View style={[styles.card, compacto && styles.cardCompacto]}>
      <TouchableOpacity style={styles.areaProduto} onPress={onPress}>
        <Text style={[styles.nome, compacto && styles.nomeCompacto]}>
          {produto.nome}
        </Text>
        <Text style={styles.preco}>{produto.preco}</Text>
        <Text style={styles.estoque}>
          Estoque: {produto.quantidade} unidade(s)
        </Text>
        {!compacto && (
          <Text style={styles.acao}>Toque para ver detalhes</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoFavorito}
        onPress={onFavoritar}
        accessibilityRole="button"
        accessibilityLabel={
          favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
        }
      >
        <Text style={styles.textoFavorito}>
          {favorito ? '★ Favorito' : '☆ Favoritar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
  },
  cardCompacto: {
    marginBottom: 8,
    padding: 10,
  },
  areaProduto: {
    flex: 1,
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  nomeCompacto: {
    fontSize: 16,
  },
  preco: {
    marginTop: 6,
    fontSize: 16,
    color: '#2E7D32',
  },
  estoque: {
    marginTop: 5,
    fontSize: 14,
    color: '#555555',
  },
  acao: {
    marginTop: 8,
    fontSize: 13,
    color: '#555555',
  },
  botaoFavorito: {
    minHeight: 44,
    marginTop: 8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  textoFavorito: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
});
