import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from '@screens/SignIn';

import { SignUpScreen } from '@screens/SignUp';

import { ContactScreen } from '@screens/Contact';

import { ForgotPasswordScreen } from '@screens/ForgotPassword';

import { DetailsNewsScreen } from '@screens/News/DetailNews';

import { AppBottomTabs } from './app.bottom.tabs.routes';

import { DetailsChampionshipScreen } from '@screens/Championships/DetailsChampionship';

import { ProfileScreen } from '@screens/Profile';
import { EditProfileInformationScreen } from '@screens/Profile/EditProfileInformation';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="appBottomTabs"
    >
      {/* AUTH ROUTES */}
      <Screen name="signInScreen" component={SignInScreen} />
      <Screen name="signUpScreen" component={SignUpScreen} />

      <Screen name="forgotPasswordScreen" component={ForgotPasswordScreen} />

      <Screen name="appBottomTabs" component={AppBottomTabs} />

      <Screen name="detailsNewsScreen" component={DetailsNewsScreen} />

      <Screen
        name="detailsChampionshipsScreen"
        component={DetailsChampionshipScreen}
      />

      <Screen name="profileScreen" component={ProfileScreen} />
      <Screen
        name="editProfileInformationScreen"
        component={EditProfileInformationScreen}
      />

      <Screen name="contactScreen" component={ContactScreen} />
    </Navigator>
  );
}
