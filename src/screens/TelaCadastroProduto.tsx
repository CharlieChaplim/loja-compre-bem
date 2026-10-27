import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoja } from '../hooks/useLoja';
import { consultarProduto } from '../services/produtosApi';
import { RootStackParamList } from '../types/navigation';

type CadastroProps = NativeStackScreenProps<RootStackParamList, 'CadastroProduto'>;

export function TelaCadastroProduto({ navigation, route }: CadastroProps) {
  const produtoId = route.params?.produtoId;
  const { adicionarProduto, atualizarProduto } = useLoja();
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [carregandoProduto, setCarregandoProduto] = useState(!!produtoId);

  useEffect(() => {
    if (!produtoId) return;
    let ativo = true;
    consultarProduto(produtoId)
      .then((produto) => {
        if (!ativo) return;
        setNome(produto.nome);
        setPreco(produto.preco.toFixed(2).replace('.', ','));
        setDescricao(produto.descricao);
        setCategoria(produto.categoria);
        setImagem(produto.imagem);
        setQuantidade(String(produto.quantidade));
      })
      .catch((erro) => { if (ativo) setErroFormulario(erro instanceof Error ? erro.message : 'Falha ao carregar produto.'); })
      .finally(() => { if (ativo) setCarregandoProduto(false); });
    return () => { ativo = false; };
  }, [produtoId]);

  async function cadastrarProduto() {
    if (salvando || carregandoProduto) return;
    setErroFormulario('');
    setErroQuantidade('');

    if (!nome.trim()) {
      setErroFormulario('Informe o nome do produto.');
      return;
    }
    if (nome.trim().length > 100) {
      setErroFormulario('Nome deve ter no máximo 100 caracteres.');
      return;
    }
    const precoNumero = Number(preco.replace(',', '.'));
    if (!preco.trim() || !Number.isFinite(precoNumero) || precoNumero <= 0 || precoNumero > 99999999.99) {
      setErroFormulario('Informe um preço válido maior que zero.');
      return;
    }
    if (descricao.length > 500) {
      setErroFormulario('A descrição deve ter no máximo 500 caracteres.');
      return;
    }
    if (!quantidade.trim()) {
      setErroQuantidade('Informe a quantidade em estoque.');
      return;
    }
    const quantidadeNumero = Number(quantidade);
    if (!Number.isSafeInteger(quantidadeNumero) || quantidadeNumero < 0 || quantidadeNumero > 2147483647) {
      setErroQuantidade('A quantidade deve ser um número inteiro igual ou maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      const formulario = {
        nome: nome.trim(),
        preco: Math.round(precoNumero * 100) / 100,
        descricao: descricao.trim(),
        categoria: categoria.trim(),
        quantidade: quantidadeNumero,
        imagem,
      };
      if (produtoId) {
        await atualizarProduto(produtoId, formulario);
      } else {
        await adicionarProduto(formulario);
      }
      navigation.goBack();
    } catch (erro) {
      setErroFormulario(erro instanceof Error ? erro.message : 'Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoProduto) {
    return <SafeAreaView style={styles.container}><ActivityIndicator size="large" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>{produtoId ? 'Editar produto' : 'Cadastro de produto'}</Text>

          <Text style={styles.rotulo}>Nome</Text>
          <TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} />

          <Text style={styles.rotulo}>Preço</Text>
          <TextInput
            style={styles.input} placeholder="Ex.: 49,90" value={preco}
            onChangeText={setPreco} keyboardType="decimal-pad"
          />

          <Text style={styles.rotulo}>Quantidade em estoque</Text>
          <TextInput
            style={styles.input} placeholder="Ex.: 10" value={quantidade}
            onChangeText={(texto) => { setQuantidade(texto); setErroQuantidade(''); }}
            keyboardType="numeric"
          />
          {!!erroQuantidade && <Text style={styles.erro}>{erroQuantidade}</Text>}

          <Text style={styles.rotulo}>Categoria (opcional)</Text>
          <TextInput style={styles.input} placeholder="Ex.: Eletrônicos" value={categoria} onChangeText={setCategoria} />

          <Text style={styles.rotulo}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputDescricao]} placeholder="Descrição do produto"
            value={descricao} onChangeText={setDescricao} multiline
          />

          {!!erroFormulario && <Text style={styles.erro}>{erroFormulario}</Text>}

          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
            disabled={salvando}
            onPress={() => void cadastrarProduto()}
          >
            <Text style={styles.textoBotao}>
              {salvando ? 'Salvando...' : produtoId ? 'Salvar alterações' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  conteudo: { padding: 20, paddingBottom: 40 },
  titulo: { marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' },
  rotulo: { marginTop: 10, marginBottom: 6, fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
  input: {
    minHeight: 44, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8,
    fontSize: 16, backgroundColor: '#FFFFFF',
  },
  inputDescricao: { minHeight: 88, textAlignVertical: 'top' },
  erro: { marginTop: 10, fontSize: 14, color: '#B00020' },
  botaoSalvar: {
    minHeight: 44, marginTop: 20, paddingHorizontal: 14, borderRadius: 8,
    backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.6 },
  textoBotao: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
