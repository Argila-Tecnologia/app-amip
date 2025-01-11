import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from '@screens/SignIn';
import { SignUpScreen } from '@screens/SignUp';
import { ContactScreen } from '@screens/Contact';
import { ForgotPasswordScreen } from '@screens/ForgotPassword';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="contactScreen"
    >
      {/* AUTH ROUTES */}
      <Screen name="signInScreen" component={SignInScreen} />
      <Screen name="signUpScreen" component={SignUpScreen} />

      <Screen name="forgotPasswordScreen" component={ForgotPasswordScreen} />

      <Screen name="contactScreen" component={ContactScreen} />
    </Navigator>
  );
}
