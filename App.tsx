import { StatusBar } from 'react-native';

import {
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  useFonts,
} from '@expo-google-fonts/roboto-slab';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { QueryClientProvider } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';

import { ThemeProvider } from 'styled-components/native';

import theme from './src/themes';

import { queryClient } from './src/services/react-query';

import { toastConfig } from '@config/toast-config';

import { Routes } from '@routes/index';

import { Loading } from '@components/Loading';
import { AppProvider } from '@hooks/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppProvider>
              {!fontsLoaded ? <Loading /> : <Routes />}

              <Toast config={toastConfig} />
            </AppProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
