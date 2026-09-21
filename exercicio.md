# Exercício da Aula 11: Formulários e Validação Básica

Instrumento de Avaliação oficial: Exercício prático individual.

## O que registrar aqui

- Campo acrescentado: Quantidade em estoque
- O que esse campo representa: A quantidade de unidades disponíveis do produto no estoque da Loja Compre Bem.
- Regra de validação aplicada: O campo é obrigatório e deve conter um número inteiro igual ou maior que zero.
- Por que essa regra faz sentido para esse campo: A quantidade em estoque representa uma contagem de unidades. Por isso, não faz sentido aceitar o campo vazio, texto, valores negativos ou números decimais.

## Testes realizados

- Caso de erro: ao deixar a quantidade vazia, digitar um valor negativo ou informar um número decimal, o cadastro é interrompido e uma mensagem de erro é exibida.
- Caso de sucesso: ao informar uma quantidade inteira igual ou maior que zero, junto com nome e preço válidos, o produto é cadastrado e passa a aparecer normalmente na lista de produtos.

---

# Exercício da Aula 13: Responsividade com Flexbox

## Elemento escolhido e problema encontrado

Escolhi os campos de texto (`TextInput`) do formulário de cadastro de produto.

Antes da correção, os campos utilizavam `paddingVertical: 10`, mas não possuíam uma altura mínima. Assim, a altura do campo podia depender do conteúdo e da plataforma, sem garantir uma área mínima confortável para toque.

## Propriedade aplicada

Foi adicionada a propriedade:

```jsx
minHeight: 44,
```

no estilo `input`.

A propriedade resolve o problema porque garante que os campos tenham pelo menos 44 pixels de altura. Dessa forma, mesmo em uma tela menor, a área disponível para tocar no campo não fica pequena demais.

Como os campos Nome, Preço e Quantidade utilizam o mesmo estilo `input`, a correção é aplicada aos três.

## O que mudou entre as resoluções

Em uma resolução menor, os campos continuam ocupando a largura disponível e passam a manter uma altura mínima de 44 pixels, deixando a área de toque mais confortável.

Em uma resolução maior, os campos continuam legíveis e não ficam esticados de forma inadequada. A principal diferença é que a altura mínima permanece garantida nas duas resoluções.

Antes da correção, essa altura mínima não era garantida. Depois da correção, os campos permanecem legíveis, utilizáveis e com uma área de toque adequada nas duas telas.

## Código da correção

```jsx
input: {
  paddingHorizontal: 12,
  paddingVertical: 10,
  minHeight: 44,
  borderWidth: 1,
  borderColor: '#CCCCCC',
  borderRadius: 8,
  fontSize: 16,
  backgroundColor: '#FFFFFF',
},
```

## Teste antes de entregar

Rodar o aplicativo em pelo menos duas resoluções diferentes e confirmar que os três campos continuam legíveis, sem cortes e fáceis de tocar.

---

# Exercício da Aula 16: Persistência de um Segundo Dado na Loja

Preenchido no início da Aula 16, na Loja Compre Bem, antes da oficina no projeto individual.

## Dado escolhido

Escolhi persistir a preferência de **modo compacto** da lista de produtos. Nesse modo, os cards usam menos espaço e mostram mais produtos ao mesmo tempo na tela.

Faz sentido essa escolha sobreviver ao fechamento do aplicativo porque é uma preferência de visualização do usuário. Depois de escolher como prefere ver o catálogo, não é necessário configurar a mesma opção toda vez que abrir a loja novamente.

## Chave usada no AsyncStorage

```text
@compre_bem:modo_compacto
```

Ela é diferente da chave usada para os favoritos:

```text
@compre_bem:favoritos
```

## Teste da persistência

O teste consiste em ativar o modo compacto na lista, fechar o aplicativo por completo e depois abri-lo novamente. Ao reabrir, o botão deve continuar ativado e os cards devem continuar no formato compacto. O mesmo teste pode ser repetido desativando a opção para confirmar que os dois valores são persistidos corretamente.

## Código da implementação

No `App.tsx`, foi criada uma chave própria e um estado para a preferência:

```tsx
const CHAVE_MODO_COMPACTO = '@compre_bem:modo_compacto';
const [modoCompacto, setModoCompacto] = useState(false);
```

Ao montar o aplicativo, o valor salvo é carregado junto com os favoritos:

```tsx
const [favoritosSalvos, modoCompactoSalvo] = await Promise.all([
  AsyncStorage.getItem(CHAVE_FAVORITOS),
  AsyncStorage.getItem(CHAVE_MODO_COMPACTO),
]);

if (modoCompactoSalvo !== null) {
  setModoCompacto(JSON.parse(modoCompactoSalvo));
}
```

Sempre que a preferência muda, o novo valor é salvo:

```tsx
useEffect(() => {
  if (!dadosCarregados) return;

  AsyncStorage.setItem(
    CHAVE_MODO_COMPACTO,
    JSON.stringify(modoCompacto)
  );
}, [modoCompacto, dadosCarregados]);
```

Na tela da lista, a preferência é alterada por um `Switch`:

```tsx
<Switch
  value={modoCompacto}
  onValueChange={alternarModoCompacto}
/>
```

O valor é passado para cada card, que aplica um estilo menor quando o modo compacto está ativo:

```tsx
<View style={[styles.card, compacto && styles.cardCompacto]}>
```
