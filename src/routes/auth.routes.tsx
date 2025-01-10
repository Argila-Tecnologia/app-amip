import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from '@screens/SignIn';
import { SignUpScreen } from '@screens/SignUp';

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="signInScreen" component={SignInScreen} />
      <Screen name="signUpScreen" component={SignUpScreen} />
    </Navigator>
  );
}
