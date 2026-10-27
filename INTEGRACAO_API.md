# Integração com loja-compre-bem-api

O catálogo deixou de usar a lista estática `src/data/produtos.ts` e agora consulta o Spring Boot pela rede. A lista antiga não é mais importada, mas o arquivo pode continuar no repositório para referência didática.

## Funcionalidades

- `GET /api/v1/produtos?page=0&size=20`: página inicial da lista; botão **Carregar mais produtos** busca outras páginas.
- `GET /api/v1/produtos?busca=...`: busca pelo nome na API.
- `GET /api/v1/produtos/{uuid}`: abre detalhes atuais do produto.
- `POST /api/v1/produtos`: cadastra produto e sua quantidade em estoque.
- `PUT /api/v1/produtos/{uuid}`: salva alterações de produto e estoque.
- `DELETE /api/v1/produtos/{uuid}`: exclui produto após confirmação.
- Favoritos e modo compacto continuam salvos localmente via AsyncStorage, com favoritos baseados nos UUIDs da API.
- Exibição de erros de rede/API e opção de tentar novamente.

## Pré-requisitos

Aplique a alteração complementar no repositório `loja-compre-bem-api` antes de usar este frontend. O contrato atual da API publicada na branch `main` ainda não recebe/devolve `quantidade`; por isso **sem o patch da API o estoque não será integrado corretamente**. A API deve estar na porta `8080`.

No repositório da API:

```powershell
.\mvnw.cmd spring-boot:run
```

Verifique `http://localhost:8080/api/v1/produtos` no navegador.

## Configuração do Expo

1. Copie `.env.example` para `.env` na raiz do frontend.
2. Ajuste `EXPO_PUBLIC_API_URL` conforme onde o aplicativo roda (use `http://` para desenvolvimento local):

| Plataforma | Exemplo de URL |
| --- | --- |
| Expo Web / simulador iOS no mesmo computador | `http://localhost:8080` |
| Emulador Android do Android Studio | `http://10.0.2.2:8080` |
| Celular real com Expo Go | `http://192.168.1.50:8080` (substitua pelo IPv4 real do computador) |

**Atenção:** `localhost` no celular aponta para o *próprio celular*, não para o computador. Conecte computador e celular à mesma rede Wi-Fi, permita a porta `8080` no firewall e mantenha a API ligada. O arquivo `.env` está no `.gitignore`; não comite IPs locais. Se não configurar `.env`, o aplicativo usa `10.0.2.2` no Android ou `localhost` nas outras plataformas.

No frontend:

```powershell
npm ci
npx expo start -c
```

Os valores de `.env` são incorporados pelo Expo durante o desenvolvimento: depois de alterar a URL, reinicie o Expo.

## Teste manual de aceitação

1. Abra a lista: os produtos devem vir da API (não da lista local de 6 itens).
2. Pesquise `cadeira`, clique **Buscar** e confira o filtro; apague a busca e clique **Buscar** novamente.
3. Clique **Carregar mais produtos** em uma busca com mais de 20 resultados, se disponível (sem busca, a API inicial possui 60 registros).
4. Cadastre um produto com nome, preço e quantidade (ex.: 7). Confira o novo produto na lista e na API/Swagger.
5. Abra o detalhe, edite estoque para 12 e recarregue a página; o valor deve continuar 12.
6. Marque um favorito, reinicie o Expo e confirme que o favorito e o modo compacto foram preservados localmente.
7. Exclua o produto de teste e confirme que foi removido da API.
8. Desligue a API; ao atualizar a lista, deve aparecer mensagem de erro de conexão (não catálogo fictício).

## Limitações conhecidas

- Não há autenticação. A API existente permite operações de escrita sem login; publique somente após implantar autenticação/autorização.
- O backend já fornece `imagem` como texto, mas o app não renderiza as imagens: o foco desta alteração é integração CRUD.
- A API usa H2 em arquivo, não servidor de produção. Os favoritos são locais por dispositivo e não sincronizados entre usuários.
