import { View } from 'react-native';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { useTheme } from 'styled-components/native';

// import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export function Routes() {
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
        <AuthRoutes />
      </NavigationContainer>
    </View>
  );
}
