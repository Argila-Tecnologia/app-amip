import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { NewsScreen } from '@screens/News';
import { ChampionshipsScreen } from '@screens/Championships';
import { MuseumsScreen } from '@screens/Museum';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppBottomTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Navigator
      initialRouteName="newsScreen"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.COLORS['green-light-color'],
        // Era 'gray-color-300' (cinza bem claro) - ficava sutil sobre o
        // fundo branco fixo de antes, mas quase invisível de tão claro
        // sobre o fundo escuro do tema dark. text-secondary é o token
        // pensado exatamente pra "conteúdo secundário/inativo".
        tabBarInactiveTintColor: theme.COLORS['text-secondary'],
        tabBarStyle: {
          // Não tinha backgroundColor nenhum antes - funcionava por
          // acidente porque branco é o padrão da própria lib de bottom
          // tabs, mas isso não muda de tema nenhum. Adicionado
          // explicitamente pra acompanhar claro/escuro.
          backgroundColor: theme.COLORS.surface,
          // No Android edge-to-edge (SDK 57+), o conteúdo desenha por baixo
          // da barra de sistema. Em navegação por 3 botões essa barra ocupa
          // uma faixa maior que em gestos, então somamos insets.bottom na
          // altura (a faixa extra cobre a barra do sistema) e replicamos o
          // mesmo valor em paddingBottom (mantém ícone/label acima dela,
          // sem espremer o conteúdo original de 64px). iOS mantido como
          // antes (96 já parecia dimensionado pro home indicator) até
          // confirmarmos se também precisa de ajuste.
          height: Platform.OS === 'android' ? 64 + insets.bottom : 96,
          borderTopWidth: 0,
          paddingTop: Platform.OS === 'android' ? 14 : 15,
          paddingBottom: Platform.OS === 'android' ? insets.bottom : 0,
        },
      }}
    >
      <Screen
        name="newsScreen"
        options={{
          title: 'Notícias',
          tabBarIcon: ({ color }) => (
            <Feather name="file-text" size={30} color={color} />
          ),
        }}
        component={NewsScreen}
      />

      <Screen
        name="championshipsScreen"
        component={ChampionshipsScreen}
        options={{
          title: 'Campeonatos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trophy" size={30} color={color} />
          ),
        }}
      />

      <Screen
        name="museumsScreen"
        component={MuseumsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bank" size={30} color={color} />
          ),
        }}
      />
    </Navigator>
  );
}
