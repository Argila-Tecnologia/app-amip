import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@hooks/auth';

import { SignInScreen } from '@screens/SignIn';

import { SignUpScreen } from '@screens/SignUp';

import { ContactScreen } from '@screens/Contact';

import { ForgotPasswordScreen } from '@screens/ForgotPassword';

import { DetailsNewsScreen } from '@screens/News/DetailNews';

import { AppBottomTabs } from './app.bottom.tabs.routes';

import { DetailsChampionshipScreen } from '@screens/Championships/DetailsChampionship';

import { ProfileScreen } from '@screens/Profile';
import { EditProfileInformationScreen } from '@screens/Profile/EditProfileInformation';
import { EditPasswordScreen } from '@screens/Profile/EditPassword';
import { DeleteProfileScreen } from '@screens/Profile/DeleteProfile';

import { SubscriptionScreen } from '@screens/Subscription';
import { DetailsMuseumScreen } from '@screens/Museum/DetailsMuseum';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  // Controle de acesso por login: em vez de cada tela privada checar
  // "estou logado?" sozinha, ela simplesmente não é registrada no
  // Navigator enquanto "player.id" estiver vazio - navegar pra ela nesse
  // estado nem é possível, porque a rota não existe. É o padrão oficial
  // do React Navigation pra fluxos de autenticação (ver
  // https://reactnavigation.org/docs/auth-flow/). Quando a sessão cai NO
  // MEIO do uso de uma dessas telas (token+refresh falharam, ver
  // src/services/api.ts), quem tira o usuário de lá é o efeito em
  // routes/index.tsx (esse componente só decide QUAIS rotas existem, não
  // reage a mudanças de estado enquanto já está montado numa delas).
  const { player } = useAuth();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="appBottomTabs"
    >
      <Screen name="appBottomTabs" component={AppBottomTabs} />

      <Screen name="detailsNewsScreen" component={DetailsNewsScreen} />

      <Screen
        name="detailsChampionshipsScreen"
        component={DetailsChampionshipScreen}
      />

      <Screen name="detailsMuseumScreen" component={DetailsMuseumScreen} />

      {/* AUTH ROUTES */}
      <Screen name="signInScreen" component={SignInScreen} />
      <Screen name="signUpScreen" component={SignUpScreen} />

      <Screen name="forgotPasswordScreen" component={ForgotPasswordScreen} />

      <Screen name="contactScreen" component={ContactScreen} />

      {/*
        Inscrição em campeonato continua pública de propósito (backend e
        Subscription já suportam inscrição anônima, player_id opcional -
        decisão confirmada, não fica atrás do login).
      */}
      <Screen name="subscriptionScreen" component={SubscriptionScreen} />

      {/* TELAS PRIVADAS - só existem enquanto autenticado */}
      {player.id ? (
        <>
          <Screen name="profileScreen" component={ProfileScreen} />
          <Screen
            name="editProfileInformationScreen"
            component={EditProfileInformationScreen}
          />
          <Screen name="editPasswordScreen" component={EditPasswordScreen} />
          <Screen name="deleteProfileScreen" component={DeleteProfileScreen} />
        </>
      ) : null}
    </Navigator>
  );
}
