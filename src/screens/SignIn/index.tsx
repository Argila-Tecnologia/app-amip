import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Controller, useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useTheme } from 'styled-components/native';

import logoImage from '../../assets/logo-AMIP.png';

import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import { FormContainer, LogoImage, SignInContainer, Title } from './styles';

const signInValidationSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

type IFormDataSubmit = zod.infer<typeof signInValidationSchema>;

export function SignInScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // FORM
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  // END FORM

  return (
    <KeyboardAwareScrollView>
      <SignInContainer>
        <LogoImage source={logoImage} />

        <Title>Acesse sua conta.</Title>

        <FormContainer>
          <Controller control={control} name="email" render={() => <Input />} />
          <Controller
            control={control}
            name="password"
            render={() => <Input secureTextFieldEntry />}
          />
        </FormContainer>
      </SignInContainer>
    </KeyboardAwareScrollView>
  );
}
