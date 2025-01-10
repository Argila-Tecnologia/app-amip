import { useCallback, useRef, useState } from 'react';

import { Pressable, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { z as zod } from 'zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import Toast from 'react-native-toast-message';

import DatePicker from 'react-native-date-picker';

import { useTheme } from 'styled-components/native';

import { format } from 'date-fns';

import { AxiosError } from 'axios';

import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@hooks/auth';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  SignUpContainer,
  SignUpContent,
  BoxButton,
  BoxActionButton,
  BoxActionButtonText,
} from './styles';
import { InputMask } from '@components/InputMask';

const signUpValidationSchema = zod.object({
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  birthday: zod.string(),
  phone: zod.string(),
});

type IFormDataSubmit = zod.infer<typeof signUpValidationSchema>;

export function SignUpScreen() {
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>();
  const [dateBirthday, setDateBirthday] = useState('');

  const { signIn } = useAuth();
  const theme = useTheme();

  const navigation = useNavigation();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const birthdayRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormDataSubmit>();
  // END FORM

  // FUNCTIONS
  const handleSelectedBirthday = useCallback((date: Date) => {
    setIsOpenDatePicker(false);

    setSelectedBirthday(date);

    const dateFormat = format(date, 'dd/MM/yyyy');
    setDateBirthday(dateFormat);

    // console.log(date);
  }, []);

  const handleFormSubmit = useCallback(
    ({ name, email, password, birthday, phone }: IFormDataSubmit) => {},
    [],
  );
  // END FUNCTIONS

  return (
    <KeyboardAwareScrollView>
      <SignUpContainer>
        <Header title="Crie sua conta" />

        <SignUpContent>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={nameRef}
                autoCapitalize="none"
                placeholder="Informe o nome"
                placeholderTextColor={theme.colors['gray-color-400']}
                value={value}
                returnKeyType="next"
                onChangeText={(text) => {
                  onChange(text);
                }}
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={emailRef}
                autoCapitalize="none"
                placeholder="Informe o e-mail"
                placeholderTextColor={theme.colors['gray-color-400']}
                value={value}
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
                autoCapitalize="none"
                placeholder="Informe a senha"
                placeholderTextColor={theme.colors['gray-color-400']}
                secureTextFieldEntry
                value={value}
                returnKeyType="next"
                onChangeText={(text) => {
                  onChange(text);
                }}
              />
            )}
          />

          <Pressable
            onPress={() => {
              setIsOpenDatePicker(true);
            }}
          >
            <Input
              ref={birthdayRef}
              placeholder="Informe a data de nascimento"
              placeholderTextColor={theme.colors['gray-color-400']}
              onChangeText={(value) => setDateBirthday(value)}
              value={dateBirthday}
              editable={false}
              style={{ color: theme.COLORS['black-color'] }}
              returnKeyType="next"
              onSubmitEditing={() => {
                phoneRef.current?.focus();
              }}
            />
          </Pressable>

          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange } }) => (
              <InputMask
                mask="(99)99999-9999"
                autoCapitalize="none"
                placeholder="Ex.: DDD + Nº de telefone"
                placeholderTextColor={theme.colors['gray-color-400']}
                value={value}
                returnKeyType="next"
                onChangeText={(_, rawText) => {
                  onChange(rawText);
                }}
              />
            )}
          />

          <Button activeOpacity={0.7} onPress={handleSubmit(handleFormSubmit)}>
            Criar conta
          </Button>
        </SignUpContent>
      </SignUpContainer>
    </KeyboardAwareScrollView>
  );
}
