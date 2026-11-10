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
  View,
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
  const [erroNome, setErroNome] = useState('');
  const [erroPreco, setErroPreco] = useState('');
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
      .catch((erro) => {
        if (ativo) {
          setErroFormulario(erro instanceof Error ? erro.message : 'Falha ao carregar produto para edição.');
        }
      })
      .finally(() => {
        if (ativo) setCarregandoProduto(false);
      });

    return () => {
      ativo = false;
    };
  }, [produtoId]);

  function validarCampos(): boolean {
    let valido = true;
    setErroFormulario('');
    setErroNome('');
    setErroPreco('');
    setErroQuantidade('');

    // Validação de Nome
    if (!nome.trim()) {
      setErroNome('Informe o nome do produto.');
      valido = false;
    } else if (nome.trim().length > 100) {
      setErroNome('O nome deve ter no máximo 100 caracteres.');
      valido = false;
    }

    // Validação de Preço
    const precoLimpo = preco.trim().replace(',', '.');
    const precoNumero = Number(precoLimpo);
    if (!preco.trim()) {
      setErroPreco('Informe o preço do produto.');
      valido = false;
    } else if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      setErroPreco('Informe um preço válido maior que zero (ex.: 29,90).');
      valido = false;
    } else if (precoNumero > 99999999.99) {
      setErroPreco('Preço ultrapassa o limite máximo permitido.');
      valido = false;
    }

    // Validação de Quantidade
    const quantidadeLimpa = quantidade.trim();
    const quantidadeNumero = Number(quantidadeLimpa);
    if (!quantidadeLimpa) {
      setErroQuantidade('Informe a quantidade em estoque.');
      valido = false;
    } else if (
      !Number.isSafeInteger(quantidadeNumero) ||
      quantidadeNumero < 0 ||
      quantidadeLimpa.includes('.') ||
      quantidadeLimpa.includes(',')
    ) {
      setErroQuantidade('A quantidade deve ser um número inteiro igual ou maior que zero (ex.: 0, 10).');
      valido = false;
    }

    // Validação de Descrição
    if (descricao.length > 500) {
      setErroFormulario('A descrição deve ter no máximo 500 caracteres.');
      valido = false;
    }

    return valido;
  }

  async function cadastrarProduto() {
    if (salvando || carregandoProduto) return;
    if (!validarCampos()) return;

    const precoNumero = Number(preco.trim().replace(',', '.'));
    const quantidadeNumero = Number(quantidade.trim());

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
      setErroFormulario(erro instanceof Error ? erro.message : 'Não foi possível salvar o produto na API.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoProduto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1B3A5C" />
          <Text style={styles.textoCarregando}>Carregando dados do produto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>{produtoId ? 'Editar produto' : 'Cadastro de produto'}</Text>

          <Text style={styles.rotulo}>Nome do produto *</Text>
          <TextInput
            style={[styles.input, !!erroNome && styles.inputComErro]}
            placeholder="Ex.: Teclado Mecânico"
            value={nome}
            onChangeText={(texto) => {
              setNome(texto);
              if (erroNome) setErroNome('');
            }}
          />
          {!!erroNome && <Text style={styles.erroCampo}>{erroNome}</Text>}

          <Text style={styles.rotulo}>Preço (R$) *</Text>
          <TextInput
            style={[styles.input, !!erroPreco && styles.inputComErro]}
            placeholder="Ex.: 49,90"
            value={preco}
            onChangeText={(texto) => {
              setPreco(texto);
              if (erroPreco) setErroPreco('');
            }}
            keyboardType="decimal-pad"
          />
          {!!erroPreco && <Text style={styles.erroCampo}>{erroPreco}</Text>}

          <Text style={styles.rotulo}>Quantidade em estoque *</Text>
          <TextInput
            style={[styles.input, !!erroQuantidade && styles.inputComErro]}
            placeholder="Ex.: 10"
            value={quantidade}
            onChangeText={(texto) => {
              setQuantidade(texto);
              if (erroQuantidade) setErroQuantidade('');
            }}
            keyboardType="numeric"
          />
          {!!erroQuantidade && <Text style={styles.erroCampo}>{erroQuantidade}</Text>}

          <Text style={styles.rotulo}>Categoria (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Eletrônicos, Móveis"
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text style={styles.rotulo}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputDescricao]}
            placeholder="Detalhes sobre o produto"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          {/* Banner de erro geral da API ou conexão */}
          {!!erroFormulario && (
            <View style={styles.blocoErroGeral}>
              <Text style={styles.textoErroGeral}>{erroFormulario}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
            disabled={salvando}
            onPress={() => void cadastrarProduto()}
          >
            <Text style={styles.textoBotao}>
              {salvando ? 'Salvando na API...' : produtoId ? 'Salvar alterações' : 'Cadastrar produto'}
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
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoCarregando: { marginTop: 12, color: '#555555', fontSize: 15 },
  titulo: { marginBottom: 16, fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' },
  rotulo: { marginTop: 12, marginBottom: 6, fontSize: 15, fontWeight: 'bold', color: '#1B3A5C' },
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
  inputComErro: { borderColor: '#B00020', backgroundColor: '#FFF8F8' },
  inputDescricao: { minHeight: 88, textAlignVertical: 'top' },
  erroCampo: { marginTop: 4, fontSize: 13, color: '#B00020' },
  blocoErroGeral: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  textoErroGeral: { color: '#B00020', fontSize: 14, fontWeight: '500', lineHeight: 18 },
  botaoSalvar: {
    minHeight: 44,
    marginTop: 22,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.6 },
  textoBotao: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});