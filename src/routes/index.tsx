import { View } from 'react-native';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { useTheme } from 'styled-components/native';

import { AppRoutes } from './app.routes';
import { Loading } from '@components/Loading';

export function Routes() {
  const { isLoadingUserStorageData } = useAuth();

  const themeStyledComponents = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = themeStyledComponents.COLORS['gray-color-300'];

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeStyledComponents.COLORS['gray-color-300'],
      }}
    >
      <NavigationContainer theme={theme}>
        <AppRoutes />
      </NavigationContainer>
    </View>
  );
}
