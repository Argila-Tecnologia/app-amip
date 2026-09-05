import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { NewsScreen } from '@screens/News';
import { ChampionshipsScreen } from '@screens/Championships';
import { MuseumsScreen } from '@screens/Museum';
import { Platform } from 'react-native';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppBottomTabs() {
  const theme = useTheme();

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
          height: Platform.OS === 'android' ? 86 : 96,
          borderTopWidth: 0,
          paddingTop: Platform.OS === 'android' ? 20 : 15,
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
