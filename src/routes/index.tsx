import { useEffect, useRef } from 'react';

import { View } from 'react-native';

import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { useTheme } from 'styled-components/native';

import { AppRoutes } from './app.routes';

// Mesma lista de telas privadas registrada condicionalmente em
// app.routes.tsx - mantida aqui também porque este arquivo não tem acesso
// direto a essa lista (é usada só pra decidir se um redirecionamento de
// segurança é necessário, não pra registrar rotas).
const PRIVATE_SCREEN_NAMES = [
  'profileScreen',
  'editProfileInformationScreen',
  'editPasswordScreen',
  'deleteProfileScreen',
];

export function Routes() {
  const { player } = useAuth();
  const navigationRef =
    useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  const themeStyledComponents = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = themeStyledComponents.COLORS['gray-color-100'];

  // Antes existia um "if (!player.id) return <Loading />" aqui (comentado
  // fora, nunca chegou a rodar) - isso travaria o app INTEIRO atrás de
  // login, inclusive Notícias/Campeonatos/Museu, que são propositalmente
  // públicos. O controle de acesso certo é por tela, não pelo app todo:
  // app.routes.tsx já deixa de registrar as telas privadas quando
  // "player.id" está vazio. O que falta cobrir aqui é o caso de a sessão
  // cair ENQUANTO o atleta já está numa dessas telas (token+refresh
  // falharam, ver src/services/api.ts) - nesse momento a tela deixa de
  // existir no Navigator, mas o React Navigation não garante sozinho que
  // a pilha reaja; então, quando "player.id" fica vazio, conferimos se a
  // rota atual era uma das privadas e, se for, saímos de lá em silêncio
  // (sem toast/alerta - decisão confirmada) direto pra appBottomTabs.
  useEffect(() => {
    if (player.id) {
      return;
    }

    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRouteName && PRIVATE_SCREEN_NAMES.includes(currentRouteName)) {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'appBottomTabs' }],
      });
    }
  }, [player.id]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeStyledComponents.COLORS['gray-color-100'],
      }}
    >
      <NavigationContainer ref={navigationRef} theme={theme}>
        <AppRoutes />
      </NavigationContainer>
    </View>
  );
}
