# CLAUDE.md

Este arquivo fornece orientação ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão geral do projeto

`app-amip` é o aplicativo mobile dos atletas da AMIP: Expo SDK 57 / React Native 0.86 / React 19.2. É a contraparte cliente dos endpoints voltados pra atletas do `api-ibra` (rotas `ensurePlayerAuthenticated`: `/players`, `/authenticate_player`, `/notifications`, etc). O painel administrativo da equipe é um repositório separado (`admin-web-amip`) e não tem relação com este app.

Migração do Expo SDK 52→57 **concluída** (um salto por sessão: 52→53→54→55→56→57 — ver histórico de commits pras notas de cada salto, ex: New Architecture virou obrigatória no 55, `@expo/vector-icons` virou dependência direta antes do 56).

Bundle identifier (as duas plataformas): `br.com.argilatecnologia.amiptm`. Versão atual: `1.0.0` (versionCode `1`, gerenciado remotamente pelo EAS via `"appVersionSource": "remote"` no `eas.json` — **mudar `version` no `app.json` não tem efeito nenhum no número que sai no build**; usar `eas build:version:set` pra alterar de verdade).

**App publicado em produção no Google Play** (2026-09-22, primeiro envio). A ficha original do app no Play Console (criada em abr/2025, nunca tinha recebido nenhum upload) começou a dar erro genérico e irrecuperável ("Ocorreu um erro inesperado") ao tentar abrir, mesmo após limpar cache/testar navegadores diferentes — usuário excluiu essa ficha (rascunho, 0 instalações, nunca publicada) e criou uma nova com o mesmo pacote (`br.com.argilatecnologia.amiptm`); o upload do `.aab` funcionou normalmente na ficha nova. Vale lembrar caso o mesmo erro apareça de novo num rascunho não utilizado.

## Login via Google (players)

**Concluído, testado de ponta a ponta com conta real e publicado em produção** (2026-09-22).
Coexiste com login por senha (não substitui), vínculo automático por
e-mail quando o Google já verificou a posse daquele e-mail. Escopo:
só atletas (`players`), Android apenas (iOS não configurado, decisão
do usuário).

- Backend (`api-ibra`): `POST /authenticate_player/google` - resolve
  por `google_id` → por e-mail (auto-vincula) → cria conta nova (senha
  aleatória gerada no servidor, nunca usada/exposta; sem phone/birthday,
  ambos opcionais em `players`). Token verificado via `google-auth-library`.
- `@react-native-google-signin/google-signin`: `App.tsx` chama
  `GoogleSignin.configure({ webClientId })` no topo, fora do componente.
  Plugin registrado em `app.json` (Android só).
- `src/hooks/auth.tsx`: `signInWithGoogle(id_token)`, devolve
  `{ is_new_player }` - atleta novo (sem phone/birthday) é redirecionado
  pra `editProfileInformationScreen` em vez do app normal.
- `src/screens/SignIn/index.tsx`: botão oficial `GoogleSigninButton`
  (cor `Light`) abaixo do formulário de senha, com divisor "ou".
- `src/dtos/player-dto.ts`: `phone`/`birthday` opcionais, `google_id`
  novo - qualquer código que assuma esses campos sempre presentes
  precisa de guarda (ex: `format(new Date(...))` sem checar undefined
  primeiro quebra a tela de completar perfil pra atleta via Google).
- **Contas Google têm restrições de segurança que não se aplicam a
  contas tradicionais** - ver seção "Autoatualização de perfil" abaixo:
  e-mail não pode ser alterado, senha não pode ser definida/trocada por
  nenhum dos 3 caminhos possíveis (troca normal, esqueci senha - pedido
  e reset).

**Troubleshooting - erro `DEVELOPER_ERROR` (code 10)** do
`@react-native-google-signin/google-signin`: o SHA-1 cadastrado no
Google Cloud Console não bate com o certificado que assinou o APK
rodando. **Builds debug local (`expo run:android`) usam um keystore
diferente do de produção** (`android/app/debug.keystore`, senha
`android`, alias `androiddebugkey` - gerado pelo `expo prebuild`, SHA-1
pego via `keytool -list -v -keystore android/app/debug.keystore -alias
androiddebugkey -storepass android -keypass android`). Por isso o Google
Cloud Console precisa de **dois** Client IDs tipo "Android" com o mesmo
`br.com.argilatecnologia.amiptm` - um com o SHA-1 de debug, outro com o
de produção (esse vem de `eas credentials -p android` → profile
`production`) - prática padrão documentada pelo próprio Google, os dois
convivem no mesmo projeto.

Client ID "Web application" (usado como `webClientId` no app E como
`GOOGLE_WEB_CLIENT_ID` no backend - mesmo valor nos dois):
`508099773895-chmvh13a1q6amk37cbg6k2tfhf8nmtho.apps.googleusercontent.com`
(no `.env` dos dois repos, e também precisa estar nos blocos `env` de
`eas.json` pra builds remotos da EAS - já esquecido uma vez, quebrando
login Google silenciosamente num build de produção até ser notado).

## Comandos

- `npm start` — `expo start --dev-client` (nota: `expo-dev-client` não está listado atualmente no `package.json`/`node_modules` apesar do script referenciá-lo — conferir isso antes de depender do fluxo de dev client localmente).
- Build EAS: `eas build --profile preview --platform android` (distribuição interna) ou `--profile production`. Só esses dois profiles existem no `eas.json`; não há profile `development`.
- Os diretórios nativos `android/` e `ios/` são versionados no repositório (o projeto passou por `expo prebuild`, ou é gerenciado com os diretórios nativos commitados) — ter isso em mente antes de adicionar qualquer config plugin do Expo que exija um prebuild novo, já que pode ser preciso reconciliar com customizações nativas existentes.

Variáveis de ambiente (`react-native-dotenv`, injetadas via `.env` localmente e via blocos `env` do `eas.json` nos builds): `API_URL` (aponta pro backend de produção, `https://api.amiptdm.com`, tanto no profile `preview` quanto no `production` — não há URL de staging separada), `WHATSAPP_PHONE_NUMBER` e `GOOGLE_WEB_CLIENT_ID` (ver seção de login Google). Qualquer variável nova usada em runtime precisa ser adicionada tanto no `.env` local quanto nos blocos `env` de `eas.json` — só o `.env` local não é suficiente pra builds remotos da EAS, que não têm acesso a esse arquivo (é gitignored).

## Arquitetura

### Layout de diretórios (`src/`)

```
src/
  assets/       # imagens/fontes
  components/   # UI compartilhada - Form/ (Input, InputMask, SelectPicker, Button),
                # Header, HeaderApp, FallbackImage, ChooseTakePhotoModal, etc
  config/       # toast-config.tsx, config de upload
  dtos/
  hooks/        # auth.tsx (AuthProvider), theme.tsx (ThemeModeProvider)
  routes/       # index.tsx (navegação), app.routes.tsx, app.bottom.tabs.routes.tsx
  screens/      # Championships, Contact, ForgotPassword, Museum, News,
                # Players, Profile, SignIn, SignUp, Subscription
  services/     # api.ts (cliente axios)
  storage/      # auth-token-storage.ts, theme-storage.ts (ambos AsyncStorage)
  themes/       # light.ts, dark.ts, index.ts (reexporta os dois + tipo ITheme compartilhado)
  @types/
  utils/        # rf-value.ts (reimplementação local do RFValue, ver abaixo)
```

Duas dependências sem manutenção foram substituídas (não reintroduzir): `react-native-responsive-fontsize` → `src/utils/rf-value.ts` (mesma fórmula, copiada direto); `react-native-keyboard-aware-scroll-view` → `KeyboardAwareScrollView` do `react-native-keyboard-controller` (precisa do `KeyboardProvider` montado uma vez na raiz, já conectado em `App.tsx`).

### Cliente HTTP e autenticação

- `src/services/api.ts`: uma única instância `axios`, `baseURL: API_URL`. Tem um interceptor de resposta que, em `401`, tenta `POST /authenticate_player/refresh_token` e desloga o usuário se isso também falhar (ou se não houver `refresh_token` salvo). **Qualquer outro erro HTTP (400/404/500/etc.) é só devolvido pra tela tratar, não desloga mais o usuário** — antes fazia `signOut()` incondicionalmente pra qualquer erro não-401, o que transformava um 404 de rota inexistente (ou qualquer outro erro comum) numa sessão encerrada sem explicação. Corrigido em 2026-09-22.
- `src/hooks/auth.tsx`: `AuthProvider` — `signIn` (`POST /authenticate_player/session`), `signInWithGoogle`, `signOut`, `loadData` (`GET /players/me`), `updatePlayerProfile`. É o lugar natural pra futuramente conectar o registro de device token (enviar o push token pro backend logo após um `signIn`/`loadData` bem-sucedido).
- `src/storage/auth-token-storage.ts`: persiste `{ token, refresh_token }` no `AsyncStorage` sob a chave `AUTH_TOKEN_STORAGE`. Não existe nenhum conceito de device/push token em lugar nenhum do app ainda.
- **Controle de acesso por login**: `src/routes/app.routes.tsx` só registra `profileScreen`/`editProfileInformationScreen`/`editPasswordScreen`/`deleteProfileScreen` quando `player.id` é verdadeiro — o padrão oficial do React Navigation pra fluxos de autenticação (https://reactnavigation.org/docs/auth-flow/), então navegar pra elas deslogado não é só bloqueado, a rota nem existe. `News`/`Championships`/`Museum`/`Contact`/`Subscription` continuam registradas incondicionalmente (públicas de propósito, incluindo inscrição anônima em campeonato com `player_id: null`). `src/routes/index.tsx` guarda uma `navigationRef` e reseta pra `appBottomTabs` (sem toast) se a sessão cair enquanto a rota atual é uma das quatro telas protegidas — `app.routes.tsx` só decide quais rotas existem, não o que acontece se você já estiver dentro de uma quando ela desaparece.

### Autoatualização de perfil (self-service)

- `PUT /players/me` (backend, `ensurePlayerAuthenticated`) é a rota certa pro atleta editar o próprio nome/e-mail/phone/birthday — o `id` vem do token, nunca do corpo. **Diferente** de `PUT /players/update/basic` e `/update/complete`, que são staff-only (`ensureUserAuthenticated`, usadas pelo painel `admin-web-amip`) e nunca devem ser chamadas por este app. A tela `EditProfileInformation` já usa a rota certa desde 2026-09-22 — antes chamava `PUT /players` (rota que nunca existiu, sempre 404).
- Upload de avatar usa a classe `File` de `expo-file-system` (`new File(uri).exists`/`.size`, propriedades síncronas) - **não** `FileSystem.getInfoAsync`, removido do pacote principal desde o SDK 57 (só existe em `expo-file-system/legacy` agora, o import antigo lança em runtime).
- Contas Google (`player.google_id` preenchido): e-mail fica read-only na UI (`EditProfileInformation`) e o backend rejeita a troca de qualquer forma; botão "Atualizar senha" some do Profile (nenhum dos 3 fluxos de senha do backend aceita mudança pra essas contas - ver `CLAUDE.md` do `api-ibra`).

### Tema (claro/escuro)

- `src/themes/light.ts` e `dark.ts` compartilham as mesmas chaves de cor de marca (`blue-dark-color`, `primary-color`, `green-color`, etc. — fixas nos dois temas, usadas como acentos literais em botões/headers) mais cinco tokens que de fato mudam com o tema: `background`, `surface`, `text`, `text-secondary`, `border`. `surface` é pra qualquer coisa que precise se ler como uma camada distinta do fundo da tela (preenchimento de campos de formulário, círculos de placeholder de avatar/foto) — usar `background` nesses casos faria a coisa se misturar com a tela atrás. `src/themes/index.ts` reexporta os dois mais `ITheme` (o tipo compartilhado: `as const` em `light`/`dark` dá tipos literais incompatíveis entre si sem isso) e faz default-export só do `light`, pra imports diretos legados (ex: `src/config/toast-config.tsx`, que o lê estaticamente de propósito — a caixa do toast nunca adota um fundo de tema, então a cor do texto dela também é fixa de propósito, não é bug pra "corrigir").
- `src/hooks/theme.tsx`: `ThemeModeProvider`/`useThemeMode` — usa `dark` como padrão pra quem ainda não escolheu, persiste a escolha via `src/storage/theme-storage.ts` (`AsyncStorage`), e é dono tanto do `ThemeProvider` do styled-components quanto da `StatusBar` nativa. O `barStyle` da status bar é fixo em `light-content` (ícones claros) independente do tema — não inverte, porque a área debaixo da status bar é sempre o header navy fixo (`HeaderApp`/`Header`/`ProfileHeader`, mesma `blue-dark-color` nos dois temas) em toda tela do app, nunca o `background`/`surface` que varia. Alternado por um ícone de lua/sol no `HeaderApp` (`toggleTheme`, um toque, sem confirmação).
- Qualquer uso novo de cor deve passar por um token de tema (`theme.COLORS.text`, etc.) via `useTheme()`/styled-components — um literal `'#000'`/`'black-color'`/`'white-color'` em UI genérica (diferente de um acento de marca deliberadamente fixo) vai funcionar bem no tema claro e quebrar no escuro.

### Notificações — ainda não implementado

Não existe código/dependências de notificação ou push (`expo-notifications`, `expo-device`, `expo-constants`, Firebase/`@react-native-firebase/*`), nem configuração, em nenhum lugar deste app. O backend (`api-ibra`) já expõe uma API de inbox de notificações pronta pra consumir (tudo sob `ensurePlayerAuthenticated`):
- `GET /notifications/` (paginado, filtro `only_unread`)
- `GET /notifications/show/:id`
- `PATCH /notifications/read-all`
- `PATCH /notifications/read/:id`
- `DELETE /notifications/:id`

Não existe nenhuma tela neste app consumindo esses endpoints ainda, nem configuração de push notification (registro de push token do Expo, prompts de permissão, config de plugin no `app.json`, permissão `POST_NOTIFICATIONS` do Android) — isso é trabalho a construir do zero.

## Cadastro de atleta menor de idade (2026-09-25, commit `a5dca7f`/`3971bbd`)

`src/screens/SignUp/index.tsx` (autocadastro do próprio atleta) ganhou a
mesma regra já implementada no `admin-web-amip`/`api-ibra`: se o atleta
for menor de 18 anos, precisa de um par completo de nome+telefone de pelo
menos um entre pai, mãe ou responsável (não basta só o telefone ou só o
nome de alguém).

- **"Menor de idade?" não é um campo do banco** - é calculado a partir de
  `birthday` toda vez que o atleta escolhe/troca a data no
  `react-native-date-picker` (`handleSelectedBirthday`), via
  `differenceInYears(new Date(), date) < 18` (`date-fns`, já era
  dependência do projeto - trata corretamente quem ainda não fez
  aniversário este ano, sem precisar de lógica manual de mês/dia).
- Exibido como um `Switch` nativo do React Native com `disabled` - só
  reflete o valor calculado, nunca é tocável diretamente (mesmo padrão do
  toggle no admin-web-amip).
- Campos condicionais (`father_name`/`father_phone`/`mother_name`/
  `mother_phone`/`responsible_name`/`responsible_phone`/`school_name`)
  renderizados só quando `is_minor` está ligado, com a mesma máscara de
  telefone já usada no campo `phone` principal (`(99)99999-9999`).
- Zod `.superRefine()` idêntico ao das outras duas telas: erro
  customizado em `responsible_phone` se nenhum dos três pares estiver
  completo. `is_minor` nunca é enviado no `POST /players` (a API rejeita
  chave desconhecida) - descartado no payload como nos outros dois repos.
- Toast de erro 400 diferenciado: se a mensagem do backend contiver
  `"full contact"`, mostra o texto específico da regra de menor em vez do
  genérico "já identificamos um cadastro com esses dados" (que seria
  enganoso pra esse caso).
- **Bug de layout encontrado e corrigido durante o teste no emulador**: o
  texto do label do toggle ("Menor de idade? (automático pela data de
  nascimento)") é longo o bastante pra quebrar em duas linhas - sem
  `flex: 1` no texto, ele reivindicava sua largura "natural" (a linha
  inteira, sem quebra) dentro da row, empurrando o `Switch` pra fora da
  tela (visível como um círculo branco cortado na borda direita). Corrigido
  criando `MinorToggleLabel` (`flex: 1`) em vez de reaproveitar
  `SubscriptionCategoryActionButtonText` (que só rotula textos curtos de
  uma linha, como o checkbox "Você é sócio da AMIP?" ao lado).
- **Testado de ponta a ponta no emulador Android** (rodando localmente,
  Metro + dev client já instalado): toggle liga sozinho ao escolher uma
  data que torna o atleta menor, bloqueia o cadastro com a mensagem
  correta quando o par nome+telefone está incompleto, e cria a conta com
  sucesso (`POST /players → 201`, login automático) quando completo -
  confirmado depois via `GET /players` que os dados do responsável
  ficaram salvos certos no banco. Diferente do `admin-web-amip`, este app
  já renderizava `error.message` corretamente nos componentes `Input`/
  `InputMask`/`SelectPicker` (`{!!error && <ErrorText>{error}</ErrorText>}`)
  - não precisou do mesmo fix de mensagem de erro dos outros dois repos.

## 4 bugs de UI encontrados e corrigidos ao testar no dispositivo real (2026-09-25, commit `a5dca7f`)

Usuário testou o build no próprio celular (nav de 3 botões do Android) e mandou screenshots - achados não relacionados à feature de menor de idade, mas corrigidos na mesma sessão.

- **`ContactScreen` ("Nos envie uma mensagem"): texto passava do limite direito do botão verde.** `ContactText` não tinha `flex`/`flexShrink`, então reivindicava a largura "natural" da linha inteira em vez de dividir espaço com o ícone ao lado. Fixed com `flex: 1` em `src/screens/Contact/styles.ts` (mesmo padrão do fix do `MinorToggleLabel` acima). Não reproduzi visualmente no emulador (a fonte responsiva aqui não estourou com a densidade/tamanho de tela dele), mas o fix é seguro e resolve a causa de qualquer forma.
- **`ChooseTakePhotoModal` (câmera/galeria do avatar): botões ficavam colados/parcialmente cobertos pela barra de navegação de 3 botões.** O `@gorhom/bottom-sheet` não sabia nada sobre a área do sistema embaixo dele. Fixed com o prop `bottomInset={insets.bottom}` do próprio `BottomSheet` (`react-native-safe-area-context`) - é o mecanismo documentado da lib pra exatamente esse caso. Confirmado visualmente no emulador (screenshot antes/depois).
- **`SubscriptionScreen` ("Realizar inscrição"): botão final do formulário colado na barra de navegação.** Faltava `paddingBottom` no `ScrollView` - mesmo padrão já usado em `DetailsChampionshipScreen` (`contentContainerStyle={{ paddingBottom: insets.bottom }}`), só que nunca tinha sido aplicado aqui. Confirmado visualmente no emulador.
- **Upload de avatar (`ProfileScreen`): toast de sucesso aparece, mas a foto nunca é exibida depois.** Bug mais sério dos quatro, com efeito silencioso em produção. Causa raiz: o nome do arquivo enviado ao servidor é `img_${player.name}.${ext}` - para um nome como "Lubnnia Morais" (ou qualquer nome com espaço/acento, ex: "João Paulo"), a camada de multipart/form-data do React Native percent-encoda o espaço no `Content-Disposition` do arquivo antes de enviar (`%20`), e o `multer` no `api-ibra` salva esse nome *literal* em disco, `%20` incluso como texto. Depois, ao montar a URL da foto (`.../players_img/nome%20do%20arquivo.png`) e o `expo-image` pedir essa URL, o `express.static` decodifica `%20` de volta pra espaço real *ao procurar o arquivo* - como o arquivo real no disco tem os `%20` literais, a busca nunca bate → 404 silencioso (a chamada de upload em si retorna 200 normalmente, então o toast de sucesso é genuíno, só a exibição depois que falha). Confirmado com `curl` direto no arquivo salvo (404) e comparando o nome salvo em disco (`tmp/players_img/`) com o que a API devolve como `avatar_url`. Fixed com uma função local `sanitizeFilename()` em `src/screens/Profile/index.tsx` que troca qualquer caractere fora de `a-zA-Z0-9` por `_` antes de montar o nome do arquivo (nos dois handlers, câmera e galeria) - elimina a classe inteira do problema (espaço, acento, qualquer coisa), não só o caso específico do espaço.
  - **Verificação**: depois do fix, o nome salvo virou `..._img_lubnnia_morais.png`, sem `%20`, e a URL resultante retornou `200` via `curl`. Também abri a URL direto no navegador do emulador (usando `10.0.2.2`, o alias correto do emulador pro host, em vez de `localhost`) e a imagem carregou perfeitamente - confirma que o bug real (arquivo inacessível) está corrigido. **O avatar continuou não aparecendo *dentro do app* no emulador só porque o `.env` local do `api-ibra` tem `APP_API_URL=http://localhost:3333`** - `localhost` no emulador aponta pro próprio emulador, não pro host, então a foto é genuinamente inalcançável dali (isso é uma limitação de ambiente de teste local, não do código; em produção `APP_API_URL` é o domínio público real, alcançável normalmente por qualquer celular). Não mexi nesse `.env` - mudar isso quebraria outros fluxos que dependem de `localhost` rodando na mesma máquina (ex: teste via navegador do painel admin).
  - **Impacto em produção**: qualquer atleta que já tenha enviado uma foto de avatar com espaço/acento no nome (a maioria dos nomes reais) antes deste fix provavelmente está com o `avatar_url` atual quebrado (404) - o arquivo velho continua órfão em disco com o nome `%XX`-literal antigo. Não investiguei nem corrigi dados já existentes em produção, só o código daqui pra frente - vale avisar o usuário/verificar depois do deploy.

## Faturas + reformulação de navegação (2026-10-23)

Primeira peça visível de uma funcionalidade maior de Faturas com
pagamento via gateway (gateway ainda não escolhido, decisão pendente da
diretoria da AMIP - ver `CLAUDE.md` do `api-ibra` pro histórico completo
da decisão, comparativo de provedores e o endpoint `GET /charges/me`).
Mockup de referência (cores/navegação) foi validado com o usuário antes
de implementar - ver histórico de conversa, não há artefato versionado
aqui.

### Perfil virou uma aba fixa (antes era só um ícone no header)

- `src/routes/app.bottom.tabs.routes.tsx`: Perfil é a 4ª aba (ícone
  `user`), ao lado de Notícias/Campeonatos/Museu. **Nome de rota mantido
  como `profileScreen`** de propósito - é o mesmo que `routes/index.tsx`
  (`PRIVATE_SCREEN_NAMES`) já observava pra resetar a navegação se a
  sessão cair no meio do uso; não precisou mudar esse mecanismo.
- Guarda de login: a aba fica sempre visível (mesmo deslogado), mas um
  `listeners.tabPress` intercepta o toque (`event.preventDefault()`) e
  manda pro login quando `!player.id` - replica o comportamento que o
  antigo botão do header já tinha, só que numa aba em vez de um botão.
- `src/routes/app.routes.tsx`: `profileScreen` saiu do Stack (só existe
  como aba agora); `editProfileInformationScreen`/`editPasswordScreen`/
  `deleteProfileScreen`/`myChargesScreen` continuam como telas empilhadas,
  abertas a partir da aba Perfil, do jeito que já era.
- `src/components/HeaderApp/`: o botão de perfil que ficava no cabeçalho
  foi removido (ficava redundante com a aba nova) - sobrou só o botão de
  tema.
- `src/screens/Profile/index.tsx`: sem seta de "voltar" no header (nenhuma
  aba tem) - só título + botão de logout. `handleSignOut` não chama mais
  `navigation.navigate('appBottomTabs')` manualmente - virou redundante
  (e de comportamento incerto de dentro de uma aba) já que
  `routes/index.tsx` já reseta sozinho quando `player.id` fica vazio numa
  tela de `PRIVATE_SCREEN_NAMES`.

### Perfil reestilizado (cores reais do clube: navy + verde)

- Avatar: círculo `blue-dark-color` (navy) com iniciais brancas, em vez do
  neutro/tema de antes - acento de marca fixo, igual ao header.
- `src/components/FallbackImage/index.tsx` ganhou 2 props opcionais,
  `initialsBackgroundColor`/`initialsTextColor` (default = tokens de tema
  de sempre). Esse componente é compartilhado com News/Championships/
  Museum - as props evitam que a cor fixa do avatar do Perfil vaze pros
  outros usos (todos sem `name`, continuam exatamente como estavam).
- Lista de opções envolta num card branco com borda
  (`ProfileOptionsCard`, novo), cada ícone ganhou uma caixinha colorida
  atrás (navy clara pros itens antigos, verde pro item novo de Faturas).
  "Remover conta" já era um botão vermelho sólido antes dessa sessão -
  não precisou de mudança.
- Novo item "Faturas" na lista, ícone verde, abre `myChargesScreen`.

### Tela "Minhas faturas" (`src/screens/Profile/MyCharges/`)

- Consome `GET /charges/me` via `useQuery` (mesmo padrão de
  `NewsScreen`), DTO em `src/dtos/charge-dto.ts`.
- **"Fatura atual"** em destaque = a cobrança não paga (pendente ou
  atrasada) com vencimento mais próximo - entre as em aberto, a mais
  antiga é a mais urgente (se tiver atrasada, ela aparece antes de
  qualquer pendente futura); sem nenhuma em aberto, cai pra mais recente
  já paga. O resto vira "Faturas anteriores" (histórico), na mesma ordem
  (vencimento decrescente) que a API já devolve.
- Cada cobrança mostra o nome do `Program` (`program_name`, campo novo no
  backend) - necessário porque um atleta pode ter mais de um
  `PlayerProgram` (ex: time principal + projeto social) ao mesmo tempo, e
  as cobranças de todos vêm juntas na mesma lista.
- **Sem cobranças** = mensagem de lista vazia ("Nenhuma fatura
  encontrada."), sem card de fatura atual.
- **Botão "Pagar" desabilitado/"Em breve"** (`MyChargesPayButton`, uma
  `View` simples, não touchable) - sem gateway de pagamento ainda,
  decisão deliberada de não prometer uma ação que não existe, em vez de
  esconder a funcionalidade inteira.
- Status (PAGO/PENDENTE/ATRASADO) já vem calculado do backend - a tela só
  exibe, não recalcula nada a partir de `due_date`.

### Verificação

Testado de ponta a ponta no emulador Android (`npx expo run:android` +
`adb screencap`/`input tap`, sem Expo Go nem dev client configurado
localmente - ver aviso em "Comandos" acima): aba nova, guarda de login
(toque deslogado → SignIn), avatar/card/cores batendo com o mockup
aprovado, navegação Perfil → Faturas, e o estado vazio da tela de
Faturas. **Conta de teste criada em produção** pra conseguir logar
(`claude.teste.mockup@example.com`, não existe staging separado neste
app) - ainda não removida, avisado ao usuário. Não verificado
visualmente o estado COM cobranças (a conta de teste não tem nenhuma) -
a lógica de seleção de "fatura atual"/histórico/`program_name` está
coberta por 6 testes Jest no backend (`api-ibra`,
`ListMyChargesUseCase.spec.ts`).

### Pendências conhecidas, não esquecer

- Botão "Pagar" fica desabilitado até o gateway de pagamento ser
  escolhido e integrado (decisão da diretoria, ver `api-ibra`).
- Barra de "parcelas pagas/em aberto" do mockup original foi
  **deliberadamente removida** - o modelo de dados real (matrícula anual
  + mensalidade recorrente sem prazo fixo) não sustenta o conceito de "N
  parcelas de um plano" que a barra pressupunha. Pode voltar como reforço
  futuro se a diretoria confirmar uma estrutura mais específica.
- Estado "com cobranças" da tela de Faturas não foi confirmado
  visualmente no emulador (só a lógica, via testes de backend) - vale
  conferir visualmente assim que houver uma conta de teste com cobranças
  reais, ou quando o usuário testar no próprio dispositivo.

## Inscrição em campeonato: e-mail pra quem não tem login + abertura do pagamento (2026-11-05/06, commit `a0ddff7`)

Achado testando de ponta a ponta o webhook da AbacatePay (ver
`CLAUDE.md` do `api-ibra`, seção "AbacatePay — webhook endpoint") - a
`SubscriptionScreen` (tela pública de "Faça sua inscrição", usada tanto
por atleta logado quanto por gente de fora da AMIP sem conta) ficou
desatualizada em dois pontos quando a inscrição em campeonato passou a
gerar cobrança automática via AbacatePay.

- **`POST /subscriptions` mudou de formato** (já documentado antes
  aqui) - passou a devolver `{ subscription, payment_url }` em vez do
  objeto `Subscription` puro. A tela nunca lia o corpo da resposta (só
  checava `response.status === 201`), então isso não quebrava nada
  tecnicamente - só fazia o `payment_url` (o link de pagamento de
  verdade) ser descartado, ou seja, nenhuma cobrança de torneio pago
  chegava a ser efetivamente cobrada pelo app.
- **Campo de e-mail**: a API passou a exigir `email` no corpo sempre que
  não há `player_id` (inscrito sem conta) - ver `CreateSubscriptionUseCase`
  no `api-ibra`. A tela nunca tinha esse campo reativado (só comentado:
  `// email: zod.string().email()`), então **toda inscrição sem login
  estava quebrada em produção** (400 "email is required"), não só a
  parte de pagamento - nem campeonato gratuito funcionava mais pra quem
  não tem conta. Achado durante este mesmo teste.

**Confirmado com o usuário**: campo de e-mail aparece só quando
`!player.id` (deslogado) - quem já tem conta continua sem digitar nada a
mais, igual às outras telas do app. Quando `payment_url` vem preenchido
(inscrição paga), o app abre direto no navegador via
`Linking.canOpenURL`/`Linking.openURL` - mesmo padrão já usado pro link
de vídeo em `DetailsChampionshipScreen` - em vez de mostrar um botão
"Pagar agora" separado.

**Testado de ponta a ponta no emulador Android**, contra o `api-ibra`
local (`.env` trocado pra `http://10.0.2.2:3333` durante o teste,
revertido pra produção depois - ver "Comandos" acima pro alias do
emulador): preencheu o formulário de uma inscrição sem login pro
"Campeonato de Teste AMIP" (campeonato de teste já existente, value>0),
submeteu, e confirmou que o Chrome do emulador abriu de verdade na
página de checkout real da AbacatePay (`app.abacatepay.com/pay/...`,
modo simulação/Dev mode) com os dados da inscrição. Achado nesse mesmo
teste, já corrigido no `api-ibra`: o backend ainda não calculava o valor
certo nesse fluxo (`value` nunca era mandado por esta tela, e o backend
confiava nesse campo vindo do cliente) - ver `CLAUDE.md` do `api-ibra`
pro fix completo (valor passou a vir sempre de `Championship.value`, não
mais do corpo da requisição).

`tsc --noEmit` e `eslint` limpos no arquivo alterado
(`src/screens/Subscription/index.tsx`). Commitado em `a0ddff7`
(2026-11-06).

## Pendências conhecidas (consolidado em 2026-11-10)

Levantamento feito revisando `git log`, `npm audit` e o restante deste
arquivo - consolidado aqui num único lugar em vez de espalhado pelas
seções de histórico acima (as pendências específicas de Faturas
continuam detalhadas na seção própria acima, e são só referenciadas
aqui).

- **Dependabot**: restam 12 vulnerabilidades (1 baixa, 7 moderadas, 4
  altas) de um total de 23, após `5b97e8a` resolver 11 via
  `npm audit fix`. As restantes são majoritariamente `node-forge`
  (dependência transitiva de ferramental de build/CLI, não roda dentro
  do app em si) e `zod` (upgrade pra `zod@4.6.7` é breaking change,
  precisa de `npm audit fix --force` e testar depois).
- **`expo-dev-client` ausente**: `npm start` roda `expo start
  --dev-client`, mas o pacote não está listado em `package.json` nem
  instalado em `node_modules` - conferir antes de depender do fluxo de
  dev client localmente (ver seção "Comandos").
- **Conta de teste em produção**: `claude.teste.mockup@example.com`,
  criada pra testar a tela de Faturas (ver seção "Faturas" acima) -
  **confirmado com o usuário em 2026-11-10 que ainda não foi removida**.
  Vale remover do banco de produção quando possível.
- **Gateway de pagamento das Faturas**: **resolvido** - AbacatePay
  escolhida e integrada (ver `CLAUDE.md` do `api-ibra`). O botão "Pagar"
  já funciona de verdade pra matrícula e torneio (ver seção "Botão Pagar
  de verdade" abaixo); só mensalidade atrasada continua sem solução (ver
  a mesma seção, "Mensalidade atrasada").
- **Estado "com cobranças" da tela de Faturas**: **verificado** em
  2026-11-10, no emulador, com cobranças de teste reais (matrícula e
  torneio) - ver seção abaixo.
- **Avatares antigos quebrados em produção**: fotos enviadas antes do
  fix de `sanitizeFilename()` (nomes com espaço/acento, ver seção "4
  bugs de UI" acima) continuam com arquivo órfão em disco e
  `avatar_url` resultando em 404 - nenhuma migração/limpeza de dados já
  existentes foi feita, só o código daqui pra frente.
- **Notificações**: feature inteira ainda não iniciada neste app (API
  do backend já pronta, ver seção "Notificações" acima) - é trabalho a
  construir do zero (telas, registro de push token, permissões
  Android).
- **Cancelamento de matrícula/mensalidade**: **validado de ponta a
  ponta contra o sandbox real da AbacatePay em 2026-11-11** (ver seção
  própria abaixo) - um bug real foi achado e corrigido no `api-ibra`
  nesse processo (link de mensalidade continuava pagável depois de
  cancelar pelo app).
- **Cancelamento de inscrição em torneio**: **não existe** nenhuma forma
  de cancelar (nem pro atleta, nem staff-com-integração-AbacatePay) - ver
  seção "Cancelamento validado de ponta a ponta..." abaixo pro detalhe.
  Decisão do usuário: deixar pendente por enquanto.

## Botão "Pagar" de verdade + "Minhas matrículas" (2026-11-10)

Trabalho cross-repo - a lógica de negócio e os novos endpoints estão
detalhados no `CLAUDE.md` do `api-ibra` (seções "Faturas: link de
pagamento guardado e exposto pelo app-amip",
"Cancelamento de mensalidade pelo app-amip" e "Mensalidade atrasada
('Vencida')"). Aqui só o que mudou **neste** app.

### Botão "Pagar" (tela "Minhas faturas")

- `src/dtos/charge-dto.ts`: `IMyChargeDTO` ganhou `payment_url: string |
  null` (mesmo campo novo que `GET /charges/me` passou a devolver).
- `src/screens/Profile/MyCharges/`: `MyChargesPayButton` deixou de ser
  uma `View` sempre desabilitada - agora é um `TouchableOpacity` real
  (`$enabled` controla cor e toque), chama
  `Linking.canOpenURL`/`openURL(currentCharge.payment_url)` quando
  preenchido, mesmo padrão já usado em `Subscription/index.tsx` pro link
  de torneio. Continua caindo no visual antigo "Em breve" (desabilitado)
  quando `payment_url` vem `null` - hoje é o caso de mensalidade
  (atrasada ou não) e qualquer lançamento manual da equipe.
- Funciona pra **matrícula** e **inscrição em torneio** (torneio já
  funcionava via `Linking` direto na tela de inscrição desde `a0ddff7`;
  a novidade é ele TAMBÉM aparecer depois em "Minhas faturas", se a
  pessoa fechar o navegador antes de terminar de pagar).

### Tela nova "Minhas matrículas" (cancelar mensalidade)

- Item novo no Perfil, ícone `users`, abre `myPlayerProgramsScreen`
  (rota nova em `app.routes.tsx`/`routes/index.tsx`/`@types/navigation.d.ts`,
  mesmo padrão de tela privada gated por `player.id` que as outras 4).
- `src/dtos/player-program-dto.ts` (novo) + `src/screens/Profile/MyPlayerPrograms/`
  (novo): lista `GET /player_programs/me` - cada vínculo do atleta
  (nome do programa, mensalidade líquida, `ATIVA`/`CANCELADA`). Decisão
  confirmada com o usuário: tela separada de "Minhas faturas", não um
  botão dentro dela - um atleta pode ter mais de um vínculo ao mesmo
  tempo (ex: time principal + projeto social).
- Botão "Cancelar mensalidade" (vermelho, `theme.COLORS['red-color']`,
  mesmo peso visual de "Remover conta") só aparece pra vínculo `ATIVA`.
  Confirmação via `Alert.alert` antes de chamar
  `POST /player_programs/me/{id}/cancel` - ação irreversível e de
  dinheiro real, mesmo padrão já usado em `handleSignOut`
  (`Profile/index.tsx`), só com texto mais sério. Sucesso/erro via
  `Toast`, lista recarrega sozinha (`refetch` do `useQuery`) depois de
  cancelar.

### Verificação

**Testado de ponta a ponta repetidas vezes no emulador Android**, contra
o `api-ibra` local (mesmo esquema de `.env` trocado e revertido depois -
ver seção "Comandos"): matrícula com `payment_url` aparecendo como
"Pendente" (não mais "Atrasado" - bug de status corrigido no mesmo dia,
ver `CLAUDE.md` do `api-ibra`) com botão "Pagar" abrindo o checkout real
da AbacatePay; cancelamento pelo app derrubando tanto a mensalidade
quanto uma matrícula ainda pendente da lista de Faturas; link do
checkout de matrícula parando de abrir de verdade depois de cancelado
(`POST /checkouts/delete` da AbacatePay, chamado pelo backend). Um
problema de ambiente (servidor local do `api-ibra` rodando código
desatualizado por causa de um respawn perdido do `ts-node-dev`) gerou um
falso negativo no meio do caminho - não é bug deste app, ver nota no
`CLAUDE.md` do `api-ibra`.

### Mensalidade atrasada - não implementado, decisão pendente

Diferente de matrícula/torneio, uma mensalidade atrasada não tem link
novo pra mostrar (a AbacatePay só retenta o mesmo cartão sozinha) -
continua caindo no "Em breve" desabilitado. Existe um caminho possível
(Portal do Cliente da AbacatePay, que também deixa a família trocar de
cartão), mas ele vem junto com cancelamento e reembolso self-service que
ainda não foram tratados no backend - ver `CLAUDE.md` do `api-ibra` pro
detalhe completo. Nada a fazer neste app até essa decisão ser tomada.

## Cancelamento validado de ponta a ponta contra a AbacatePay real + 2 bugs de UI no tema escuro (2026-11-11)

Sessão pedida pelo usuário especificamente pra **testar no aplicativo**
(emulador Android real, não só ler o código) se cancelar uma matrícula
pelo app realmente mata o link na AbacatePay ou só marca como cancelado
no nosso banco - a pendência mais importante deixada em aberto pela
seção anterior. Achou e corrigiu, no meio do caminho, um bug real de
cancelamento (no `api-ibra`) e 2 bugs de UI no tema escuro (neste app).

### 2 bugs de tema escuro, achados pelo usuário olhando o emulador

- **Ícones das caixinhas do Perfil ilegíveis no tema escuro**: `
  'blue-dark-color'` (`#0c0c5b`, navy bem escuro) é fixo de propósito
  entre os temas (acento de marca) - ótimo contraste no card branco do
  tema claro, mas quase invisível sobre o `surface` do tema escuro (que
  já é um navy bem próximo do preto). `ProfileScreen` agora calcula
  `optionIconAccentColor`/`optionIconTintColor` a partir de
  `useThemeMode().themeName`: continua `blue-dark-color` no claro, mas
  troca pro `blue-light-color` (`#2ebfdc`, o mesmo tipo de acento fixo,
  só que claro) no escuro - afeta os ícones de "Atualizar perfil",
  "Minhas matrículas", "Atualizar senha" e "Contato" (o de "Faturas", em
  verde, já lia bem nos dois temas, não mexido).
- **Tela "Minhas matrículas" sem `paddingBottom`**: `MyPlayerPrograms/
  index.tsx` não passava `insets.bottom` pro `contentContainerStyle` do
  `ScrollView` (mesmo padrão já usado em `DetailsChampionshipScreen`/
  `SubscriptionScreen`, mas nunca aplicado aqui) - o último card da lista
  (e o botão "Cancelar mensalidade" dele, quando `ATIVA`) ficava cortado
  pela barra de navegação gestual do Android, inacessível. Corrigido
  adicionando `useSafeAreaInsets()` e `paddingBottom: insets.bottom` nos
  dois ramos do `contentContainerStyle` (lista vazia e lista com itens).

### Cancelamento de matrícula/mensalidade: validado contra o sandbox real

Metodologia: em vez de só ler o código, criado um `PlayerProgram` de
teste de verdade (matrícula + mensalidade, ambos gerando checkout real
na AbacatePay) direto contra o `api-ibra` local, cancelado pelo botão
"Cancelar mensalidade" no emulador, e então aberto os dois links de
pagamento reais no navegador pra ver se realmente morreram
("Não encontramos este link") ou se continuavam pagáveis.

- **Matrícula**: confirmado que o link morre de verdade depois de
  cancelar (mecanismo já existente e correto, ver seção anterior).
- **Mensalidade (achado um bug real)**: o link de pagamento da
  mensalidade continuava **100% funcional** depois de cancelar pelo
  app, mesmo com o banco já mostrando tudo cancelado e o toast de
  sucesso aparecendo normalmente. Causa raiz (no `api-ibra`, ver
  `CLAUDE.md` de lá pro detalhe completo): a AbacatePay usa um endpoint
  **diferente** pra excluir um checkout de assinatura
  (`/v2/subscriptions/checkouts/delete`) do que pra um checkout avulso
  (`/v2/checkouts/delete`, usado pela matrícula) - o serviço de
  cancelamento estava chamando o endpoint errado (o de matrícula) pro
  checkout de mensalidade, a chamada falhava contra a API real, e um
  `try/catch` deliberado (pra não derrubar o cancelamento local por causa
  de uma falha de rede) engolia o erro silenciosamente. **Corrigido** -
  novo método `deleteSubscriptionCheckout` no provider, chamando o
  endpoint certo. Recomprovado depois do fix: um vínculo novo cancelado
  pelo app teve o link de mensalidade morrendo de verdade também.
  Nenhuma mudança neste app - o bug e o fix são inteiramente no
  `api-ibra`.
- Achado secundário durante a investigação: 3 processos `yarn dev:server`
  do `api-ibra` ficaram rodando ao mesmo tempo no ambiente local, nenhum
  deles de fato escutando a porta 3333 - o mesmo tipo de "respawn
  perdido do `ts-node-dev`" já registrado como causa de falso negativo na
  seção anterior. Resolvido matando os três e subindo um processo limpo
  antes de testar.

### Cancelamento de inscrição em torneio - não testado, feature não existe

Pedido original também incluía testar cancelamento de torneio. Não dá
pra testar **no aplicativo** porque **não existe** - o atleta pode se
inscrever (com ou sem pagamento) mas não tem nenhuma tela/botão pra
cancelar depois. O único cancelamento de torneio que existe é
`DeleteSubscriptionUseCase` no `api-ibra` (staff-only, usado pelo
`admin-web-amip`), e ele **não toca a AbacatePay de jeito nenhum** - só
apaga a `Subscription` do nosso banco, deixando um checkout/cobrança de
torneio pago ou pendente ÓRFÃO no painel deles (mesma classe de bug que
acabou de ser corrigida pra matrícula/mensalidade, só que pra torneio
ainda nem tem o mecanismo de "cancelar a Charge + excluir o checkout"
implementado). **Decisão do usuário (2026-11-11): deixar pendente por
enquanto**, só documentado aqui - nada a construir ainda, nem admin nem
self-service.

## Repositórios relacionados

- **Backend**: `../api-ibra` — ver o `CLAUDE.md` próprio dele. Autenticação voltada pro atleta (`ensurePlayerAuthenticated`) e o módulo de notificações que este app deve consumir vivem lá.
- **Painel admin**: `../admin-web-amip` — painel Next.js só pra equipe, sem relação com os usuários deste app (atletas).
