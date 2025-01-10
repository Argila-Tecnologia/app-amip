import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from '@screens/SignIn';

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="signInScreen" component={SignInScreen} />
    </Navigator>
  );
}
