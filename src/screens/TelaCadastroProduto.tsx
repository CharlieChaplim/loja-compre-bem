import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { Produto } from '../types/Produto';

type CadastroProps = NativeStackScreenProps<RootStackParamList, 'CadastroProduto'>;

type Props = CadastroProps & {
  adicionarProduto: (produto: Omit<Produto, 'id'>) => void;
};

export function TelaCadastroProduto({ navigation, adicionarProduto }: Props) {
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
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
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

          <TouchableOpacity style={styles.botaoSalvar} onPress={cadastrarProduto}>
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  rotulo: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  input: {
    minHeight: 44,
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
  botaoSalvar: {
    minHeight: 44,
    marginTop: 20,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
