import { useCallback, useEffect, useRef, useState } from 'react';

import { TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { z as zod } from 'zod';

import Toast from 'react-native-toast-message';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { useAuth } from '@hooks/auth';

import logoImage from '../../assets/AMIP_LOGO.png';

import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  DividerContainer,
  DividerLine,
  DividerText,
  Footer,
  FooterCreateAccountButton,
  FooterCreateAccountButtonText,
  ForgotPasswordButton,
  ForgotPasswordContent,
  ForgotPasswordText,
  FormContainer,
  GoogleSignInContainer,
  LogoImage,
  SignInBackButton,
  SignInContainer,
} from './styles';

const signInValidationSchema = zod.object({
  email: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório')
    .email('E-mail inválido'),
  password: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
});

type IFormDataSubmit = zod.infer<typeof signInValidationSchema>;

export function SignInScreen() {
  const [loadingSignIn, setIsLoadingSignIn] = useState(false);
  const [loadingGoogleSignIn, setIsLoadingGoogleSignIn] = useState(false);
  // Sinaliza que, assim que "player" for atualizado no contexto (ver
  // useEffect abaixo), deve navegar pra completar o perfil - não dá pra
  // navegar direto na sequência do handleGoogleSignIn porque
  // "editProfileInformationScreen" só é registrada no Navigator quando
  // "player.id" existe (ver app.routes.tsx), e o setPlayer() do
  // signInWithGoogle ainda não teve efeito no re-render nesse ponto.
  const [redirectToCompleteProfile, setRedirectToCompleteProfile] =
    useState(false);

  const navigation = useNavigation();
  const { signIn, signInWithGoogle, player } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormDataSubmit>({
    resolver: zodResolver(signInValidationSchema),
  });

  // FORM
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  // END FORM

  // FUNCTION

  const handleFormSubmit = useCallback(
    async ({ email, password }: IFormDataSubmit) => {
      try {
        setIsLoadingSignIn(true);

        await signIn({ email, password });

        // Antes o login terminava aqui, sem toast nem navegação - o
        // atleta ficava na própria tela de SignIn sem nenhum sinal de que
        // tinha entrado (mesmo bug do SignUp, corrigido antes). Mesmo
        // padrão de lá: toast de sucesso + reset() pra appBottomTabs (não
        // navigate(), pra não deixar o botão "voltar" retornar pra tela
        // de login depois de já estar autenticado).
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Login realizado com sucesso!',
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'appBottomTabs' }],
        });
      } catch (error) {
        console.log('🚀 ~ error:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Credencial inválida',
          text2: 'Verifique as informações e tente novamente.',
        });
      } finally {
        // Antes isso nunca era chamado - depois de qualquer tentativa
        // (sucesso ou erro), o botão "Entrar" e os campos ficavam
        // desabilitados pra sempre (mesmo bug do SignUp, mesma correção).
        setIsLoadingSignIn(false);
      }
    },
    [signIn, navigation],
  );

  useEffect(() => {
    if (redirectToCompleteProfile && player.id) {
      setRedirectToCompleteProfile(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'editProfileInformationScreen' }],
      });
    }
  }, [redirectToCompleteProfile, player.id, navigation]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsLoadingGoogleSignIn(true);

      // Play Services é a base que o SDK do Google usa no Android - sem
      // isso instalado/atualizado no aparelho, o signIn() falha.
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        // Atleta cancelou o seletor de conta do Google - não é erro,
        // só não faz nada (sem toast, mesmo padrão de um "voltar" comum).
        return;
      }

      const { idToken } = response.data;

      if (!idToken) {
        throw new Error('Google não devolveu um ID token.');
      }

      const { is_new_player } = await signInWithGoogle(idToken);

      if (is_new_player) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Bem-vindo(a) à AMIP!',
          text2: 'Complete seu cadastro pra continuar.',
        });

        setRedirectToCompleteProfile(true);
      } else {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Login realizado com sucesso!',
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'appBottomTabs' }],
        });
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);

      // SIGN_IN_CANCELLED/IN_PROGRESS não são erros de verdade (o atleta
      // desistiu, ou já tem um login em andamento) - só os outros casos
      // (Play Services ausente, backend rejeitou o token etc.) mostram
      // toast de erro.
      if (
        isErrorWithCode(error) &&
        (error.code === statusCodes.SIGN_IN_CANCELLED ||
          error.code === statusCodes.IN_PROGRESS)
      ) {
        return;
      }

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Não foi possível entrar com o Google',
        text2: 'Verifique sua conexão e tente novamente.',
      });
    } finally {
      setIsLoadingGoogleSignIn(false);
    }
  }, [signInWithGoogle, navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  // END FUNCTION

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.COLORS['blue-dark-color'] }}
    >
      <SignInContainer>
        {/*
          SignIn é a única tela empilhada sem navegação pra voltar - as
          outras usam <Header title="..."/>, mas aqui o título já estava
          comentado (decisão visual anterior: só a logo, sem barra de
          título). Por isso só a seta, posicionada sobre o próprio fundo
          navy, sem repetir a barra completa do Header.
        */}
        <SignInBackButton
          onPress={handleGoBack}
          style={{ top: insets.top + 8 }}
        >
          <Feather
            name="chevron-left"
            size={28}
            color={theme.COLORS['white-color']}
          />
        </SignInBackButton>

        <LogoImage source={logoImage} contentFit="contain" />

        {/* <Title>Acesse sua conta.</Title> */}

        <FormContainer>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={emailRef}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="E-mail"
                value={value}
                error={errors.email?.message}
                returnKeyType="next"
                onChangeText={(text) => {
                  onChange(text);
                }}
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={passwordRef}
                secureTextFieldEntry
                placeholder="Senha"
                value={value}
                error={errors.password?.message}
                returnKeyType="done"
                onChangeText={(text) => {
                  onChange(text);
                }}
                onSubmitEditing={handleSubmit(handleFormSubmit)}
              />
            )}
          />

          <Button
            activeOpacity={0.7}
            loading={loadingSignIn}
            onPress={handleSubmit(handleFormSubmit)}
          >
            Entrar
          </Button>
        </FormContainer>

        {/*
          "Esqueceu a senha?" é uma ação do login por SENHA - fica logo
          abaixo do formulário/botão Entrar, antes do divisor "ou", pra
          não parecer que pertence ao login com Google (decisão do
          usuário, 2026-09-21: reordenado pra cima, ficava confuso depois
          do botão do Google).
        */}
        <ForgotPasswordContent>
          {/*
            Esse botão não tinha nenhum onPress - a rota
            "forgotPasswordScreen" já existe e funciona (chegava a ser
            usada em outros lugares), só faltava ligar o botão a ela.
          */}
          <ForgotPasswordButton
            onPress={() => {
              navigation.navigate('forgotPasswordScreen');
            }}
          >
            <ForgotPasswordText>Esqueceu a senha?</ForgotPasswordText>
          </ForgotPasswordButton>
        </ForgotPasswordContent>

        <DividerContainer>
          <DividerLine />
          <DividerText>ou</DividerText>
          <DividerLine />
        </DividerContainer>

        <GoogleSignInContainer>
          {/*
            Componente nativo oficial do Google (não um botão nosso) - já
            segue as diretrizes de marca do Google automaticamente. "Light"
            (fundo branco) porque a tela é escura (navy) - precisa de
            contraste, o "Dark" é pensado pra fundos claros.
          */}
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            disabled={loadingGoogleSignIn}
            onPress={handleGoogleSignIn}
          />
        </GoogleSignInContainer>

        {/*
          "Criar conta!" fica por último, como call-to-action geral -
          faz sentido independente de qual método de login foi usado
          acima.
        */}
        <Footer>
          <FooterCreateAccountButton
            onPress={() => {
              navigation.navigate('signUpScreen');
            }}
          >
            <FooterCreateAccountButtonText>
              Criar conta!
            </FooterCreateAccountButtonText>
          </FooterCreateAccountButton>
        </Footer>
      </SignInContainer>
    </KeyboardAwareScrollView>
  );
}
