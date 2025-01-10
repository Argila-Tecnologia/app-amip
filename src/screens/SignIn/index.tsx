import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { z as zod } from 'zod';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useMutation } from '@tanstack/react-query';

import logoImage from '../../assets/logo-AMIP.png';

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
  Title,
} from './styles';

const signInValidationSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

type IFormDataSubmit = zod.infer<typeof signInValidationSchema>;

export function SignInScreen() {
  // const navigation = useNavigation();

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
      console.log(email, password);
    },
    [],
  );
  // END FUNCTION

  return (
    <KeyboardAwareScrollView>
      <SignInContainer>
        <LogoImage source={logoImage} />

        <Title>Acesse sua conta.</Title>

        <FormContainer>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={emailRef}
                autoCapitalize="none"
                value={value}
                error={errors.email?.message}
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
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                }}
                error={errors.password?.message}
              />
            )}
          />

          <Button activeOpacity={0.7} onPress={handleSubmit(handleFormSubmit)}>
            Entrar
          </Button>
        </FormContainer>

        <ForgotPasswordContent>
          <ForgotPasswordButton>
            <ForgotPasswordText>Esqueceu a senha?</ForgotPasswordText>
          </ForgotPasswordButton>
        </ForgotPasswordContent>

        <Footer>
          <FooterCreateAccountButton>
            <FooterCreateAccountButtonText>
              Criar conta!
            </FooterCreateAccountButtonText>
          </FooterCreateAccountButton>
        </Footer>
      </SignInContainer>
    </KeyboardAwareScrollView>
  );
}
