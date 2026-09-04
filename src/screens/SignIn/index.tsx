import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useTheme } from 'styled-components/native';

import { z as zod } from 'zod';

import Toast from 'react-native-toast-message';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useAuth } from '@hooks/auth';

import logoImage from '../../assets/AMIP_LOGO.png';

import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  Footer,
  FooterCreateAccountButton,
  FooterCreateAccountButtonText,
  ForgotPasswordButton,
  ForgotPasswordContent,
  ForgotPasswordText,
  FormContainer,
  LogoImage,
  SignInContainer,
} from './styles';

const signInValidationSchema = zod.object({
  email: zod.string().email().min(1),
  password: zod.string().min(1),
});

type IFormDataSubmit = zod.infer<typeof signInValidationSchema>;

export function SignInScreen() {
  const [loadingSignIn, setIsLoadingSignIn] = useState(false);

  const navigation = useNavigation();
  const { signIn } = useAuth();
  const theme = useTheme();

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
  // END FUNCTION

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.COLORS['blue-dark-color'] }}
    >
      <SignInContainer>
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
