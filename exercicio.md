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
