import { View } from 'react-native';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { useTheme } from 'styled-components/native';

import { AppRoutes } from './app.routes';
import { Loading } from '@components/Loading';

export function Routes() {
  const { isLoadingStorageData } = useAuth();

  const themeStyledComponents = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = themeStyledComponents.COLORS['blue-dark-color'];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeStyledComponents.COLORS['blue-dark-color'],
      }}
    >
      <NavigationContainer theme={theme}>
        {isLoadingStorageData ? <Loading /> : <AppRoutes />}
      </NavigationContainer>
    </View>
  );
}
