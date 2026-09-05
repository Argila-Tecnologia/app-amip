import {
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  useFonts,
} from '@expo-google-fonts/roboto-slab';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { KeyboardProvider } from 'react-native-keyboard-controller';

import { QueryClientProvider } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';

import { queryClient } from './src/services/react-query';

import { toastConfig } from '@config/toast-config';

import { Routes } from '@routes/index';

import { Loading } from '@components/Loading';
import { AppProvider } from '@hooks/index';
import { ThemeModeProvider } from '@hooks/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
  });

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        ThemeModeProvider substitui o antigo ThemeProvider (styled-components)
        com tema fixo - agora ele decide se o tema ativo é claro ou escuro
        (persistido, escuro por padrão) e já cuida do ThemeProvider e da
        StatusBar internamente, já que os dois precisam mudar junto com o
        tema. Ver src/hooks/theme.tsx.
      */}
      <ThemeModeProvider>
        <SafeAreaProvider style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* KeyboardProvider é exigido pelo react-native-keyboard-controller
                (usado pelo KeyboardAwareScrollView nas telas de formulário) -
                precisa envolver a raiz do app pra funcionar em qualquer tela. */}
            <KeyboardProvider>
              <AppProvider>
                {!fontsLoaded ? <Loading /> : <Routes />}

                <Toast config={toastConfig} />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  );
}
