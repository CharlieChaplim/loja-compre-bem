# Exercício Prático — Aula 05

**Nome:** José Roberto Santos Nascimento  
**Data:** 17/08/2026

## 1. Descreva as 2 telas e o que cada uma faz:

A primeira tela é a lista de pontos de coleta e distribuição do Instituto Mão Amiga. Ela mostra os pontos cadastrados nos dados mockados e permite tocar em qualquer um deles para abrir seus detalhes.

A segunda tela é a tela de detalhe do ponto. Ela recebe o identificador do ponto selecionado, encontra o ponto correspondente na lista de dados mockados e mostra seu nome, endereço, dias e horários e o que ele recebe ou distribui.

## 2. Qual parâmetro é passado da Tela 1 para a Tela 2:

O parâmetro passado é `pontoId`, que contém o `id` do ponto selecionado na lista.

## 3. O que muda na Tela 2 por causa do parâmetro recebido:

A Tela 2 procura em `pontosMock` o ponto cujo `id` é igual ao `pontoId` recebido. Por isso, o conteúdo exibido muda de acordo com o ponto tocado na Tela 1, em vez de mostrar sempre o mesmo ponto.

## 4. Cole aqui o código de navegação (o `navigate` e a leitura do `route.params`):

```tsx
onPress={() =>
  navigation.navigate('Detalhe', { pontoId: ponto.id })
}
```

```tsx
function TelaDetalhePonto({ route }: DetalheProps) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((item) => item.id === pontoId);

  if (!ponto) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Ponto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ItemDetalhe ponto={ponto} />
    </View>
  );
}
```
