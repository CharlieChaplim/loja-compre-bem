# Exercício da Aula 11: Formulários e Validação Básica

**Instrumento de Avaliação oficial:** Exercício prático individual.

## O que registrar aqui

- **Campo acrescentado:** Quantidade em estoque
- **O que esse campo representa:** A quantidade de unidades disponíveis do produto no estoque da Loja Compre Bem.
- **Regra de validação aplicada:** O campo é obrigatório e deve conter um número inteiro igual ou maior que zero.
- **Por que essa regra faz sentido para esse campo:** A quantidade em estoque representa uma contagem de unidades. Por isso, não faz sentido aceitar o campo vazio, texto, valores negativos ou números decimais.
- **Código da sua extensão** (trecho do `TextInput` novo + o pedaço da função de validação que você acrescentou):

```tsx
const [quantidade, setQuantidade] = useState('');
const [erroQuantidade, setErroQuantidade] = useState('');

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

{erroQuantidade !== '' && (
  <Text style={styles.erro}>{erroQuantidade}</Text>
)}
```

```tsx
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
```

## Testes realizados

- **Caso de erro:** ao deixar a quantidade vazia, digitar um valor negativo ou informar um número decimal, o cadastro é interrompido e uma mensagem de erro é exibida. Os valores já digitados nos campos de nome e preço permanecem preenchidos.
- **Caso de sucesso:** ao informar uma quantidade inteira igual ou maior que zero, junto com nome e preço válidos, o produto é cadastrado e passa a aparecer normalmente na lista de produtos.
