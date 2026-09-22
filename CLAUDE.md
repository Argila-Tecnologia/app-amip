# CLAUDE.md

Este arquivo fornece orientação ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão geral do projeto

`app-amip` é o aplicativo mobile dos atletas da AMIP: Expo SDK 55 / React Native 0.83 / React 19.2. É a contraparte cliente dos endpoints voltados pra atletas do `api-ibra` (rotas `ensurePlayerAuthenticated`: `/players`, `/authenticate_player`, `/notifications`, etc). O painel administrativo da equipe é um repositório separado (`admin-web-amip`) e não tem relação com este app.

Em migração do Expo SDK 52 (5 versões major atrás na época, motivada por prazos de toolchain do Google Play/App Store): os saltos 52→53→54→55 já foram feitos, um de cada vez (56→57 ainda pendentes, cada um numa sessão própria — ver o histórico de commits do próprio app pras notas salto a salto, ex: New Architecture virou obrigatória no 55, `@expo/vector-icons` precisa virar dependência direta antes do 56).

Bundle identifier (as duas plataformas): `br.com.argilatecnologia.amiptm`. Versão atual: `1.0.0` (build/versionCode `1`) — app em estágio inicial.

## ⚠️ Trabalho em andamento: login via Google (2026-09-21, ler primeiro)

Feature em implementação, **nada commitado ainda neste repo** (`git status`
mostra tudo modificado). Contexto completo pra retomar sem perder nada:

**O que já está pronto e funcionando**:
- Backend (`api-ibra`) 100% pronto, **commitado localmente mas sem `git
  push`** (commit `fcfd5b2` lá) - `POST /authenticate_player/google`,
  vínculo automático por e-mail, criação de conta sem phone/birthday
  (campos viraram opcionais), token verificado via `google-auth-library`.
- `@react-native-google-signin/google-signin` instalado e configurado
  (`App.tsx`: `GoogleSignin.configure({ webClientId })` no topo, fora do
  componente). Plugin adicionado em `app.json` automaticamente pelo
  `expo install` (Android só - iOS fica pra depois, decisão do usuário).
- `src/hooks/auth.tsx`: novo método `signInWithGoogle(id_token)`, devolve
  `{ is_new_player }` pra decidir se leva o atleta pro app normal ou pra
  `editProfileInformationScreen` (conta nova sem telefone/nascimento).
- `src/screens/SignIn/index.tsx` + `styles.ts`: botão oficial
  `GoogleSigninButton` (cor `Light`, contrasta com o fundo navy) + lógica
  completa de sign-in/cancelamento/erro. Layout revisado a pedido do
  usuário (2026-09-21): logo reduzida (`RFValue(331)`→`RFValue(230)`),
  ordem reorganizada pra ficar lógica - formulário+senha → "Esqueceu a
  senha?" (fica junto do login por senha) → divisor "ou" → botão Google →
  "Criar conta!" (call-to-action geral, por último).
- `src/dtos/player-dto.ts`: `phone`/`birthday` opcionais, `google_id`
  novo - e os 2 bugs reais que isso destampou e já foram corrigidos:
  `EditProfileInformation` (`format(new Date(undefined))` quebrava a tela
  de completar perfil) e `Subscription` (`setValue` com `undefined`).

**Achado crítico, guardar pra qualquer troubleshooting futuro de login
Google**: erro `DEVELOPER_ERROR` (code 10) do
`@react-native-google-signin/google-signin` = o SHA-1 cadastrado no
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
(já preenchido no `.env` dos dois repos).

**Status do teste end-to-end**: bloqueado até 2026-09-21 pelo
`DEVELOPER_ERROR` acima (só o Client ID de produção existia). Usuário
acabou de criar o segundo Client ID Android (debug) - **próximo passo é
testar de novo** (não sei ainda se funcionou, sessão foi interrompida
por limite de contexto antes de confirmar).

**Pra retomar numa sessão nova**: perguntar se o login com conta Google
real já funcionou depois do Client ID de debug. Se sim, seguir pra
commitar (api-ibra já tem o commit pronto sem push; app-amip precisa de
um commit novo) - confirmar com o usuário antes de qualquer `git push`,
como sempre. Se ainda não, os logs úteis pra depurar ficam em
`adb logcat -d --pid=$(adb shell pidof br.com.argilatecnologia.amiptm) |
grep ReactNativeJS` (é onde o erro real aparece, não no terminal do
Metro). Emulador/Metro/backend local podem ter caído entre sessões -
checar antes de assumir que estão de pé (ver seção de setup local no
`CLAUDE.md` do `api-ibra` sobre o Postgres, mesma fricção se aplica
aqui).

## Comandos

- `npm start` — `expo start --dev-client` (nota: `expo-dev-client` não está listado atualmente no `package.json`/`node_modules` apesar do script referenciá-lo — conferir isso antes de depender do fluxo de dev client localmente).
- Build EAS: `eas build --profile preview --platform android` (distribuição interna) ou `--profile production`. Só esses dois profiles existem no `eas.json`; não há profile `development`.
- Os diretórios nativos `android/` e `ios/` são versionados no repositório (o projeto passou por `expo prebuild`, ou é gerenciado com os diretórios nativos commitados) — ter isso em mente antes de adicionar qualquer config plugin do Expo que exija um prebuild novo, já que pode ser preciso reconciliar com customizações nativas existentes.

Variáveis de ambiente (`react-native-dotenv`, injetadas via `.env` localmente e via blocos `env` do `eas.json` nos builds): `API_URL` (aponta pro backend de produção, `https://api.amiptdm.com`, tanto no profile `preview` quanto no `production` — não há URL de staging separada) e `WHATSAPP_PHONE_NUMBER`.

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

- `src/services/api.ts`: uma única instância `axios`, `baseURL: API_URL`. Tem um interceptor de resposta que, em `401`, tenta `POST /authenticate_player/refresh_token` e desloga o usuário se isso também falhar.
- `src/hooks/auth.tsx`: `AuthProvider` — `signIn` (`POST /authenticate_player/session`), `signOut`, `loadData` (`GET /players/me`), `updatePlayerProfile`. É o lugar natural pra futuramente conectar o registro de device token (enviar o push token pro backend logo após um `signIn`/`loadData` bem-sucedido).
- `src/storage/auth-token-storage.ts`: persiste `{ token, refresh_token }` no `AsyncStorage` sob a chave `AUTH_TOKEN_STORAGE`. Não existe nenhum conceito de device/push token em lugar nenhum do app ainda.
- **Controle de acesso por login**: `src/routes/app.routes.tsx` só registra `profileScreen`/`editProfileInformationScreen`/`editPasswordScreen`/`deleteProfileScreen` quando `player.id` é verdadeiro — o padrão oficial do React Navigation pra fluxos de autenticação (https://reactnavigation.org/docs/auth-flow/), então navegar pra elas deslogado não é só bloqueado, a rota nem existe. `News`/`Championships`/`Museum`/`Contact`/`Subscription` continuam registradas incondicionalmente (públicas de propósito, incluindo inscrição anônima em campeonato com `player_id: null`). `src/routes/index.tsx` guarda uma `navigationRef` e reseta pra `appBottomTabs` (sem toast) se a sessão cair enquanto a rota atual é uma das quatro telas protegidas — `app.routes.tsx` só decide quais rotas existem, não o que acontece se você já estiver dentro de uma quando ela desaparece.

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

## Repositórios relacionados

- **Backend**: `../api-ibra` — ver o `CLAUDE.md` próprio dele. Autenticação voltada pro atleta (`ensurePlayerAuthenticated`) e o módulo de notificações que este app deve consumir vivem lá.
- **Painel admin**: `../admin-web-amip` — painel Next.js só pra equipe, sem relação com os usuários deste app (atletas).
