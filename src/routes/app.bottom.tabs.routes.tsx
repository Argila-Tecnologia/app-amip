import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { NewsScreen } from '@screens/News';
import { ChampionshipsScreen } from '@screens/Championships';
import { MuseumsScreen } from '@screens/Museum';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppBottomTabs() {
  const theme = useTheme();

  return (
    <Navigator
      initialRouteName="newsScreen"
      screenOptions={{
        tabBarActiveTintColor: theme.COLORS['green-light-color'],
        tabBarInactiveTintColor: theme.COLORS['gray-color-300'],
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 50,
        },
        tabBarLabelStyle: {
          fontSize: 15,
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
