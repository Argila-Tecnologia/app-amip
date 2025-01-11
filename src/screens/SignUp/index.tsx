import { useCallback, useRef, useState } from 'react';

import { Pressable, TextInput } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Controller, useForm } from 'react-hook-form';

import Toast from 'react-native-toast-message';

import DatePicker from 'react-native-date-picker';

import { useTheme } from 'styled-components/native';

import { format } from 'date-fns';

import { AxiosError } from 'axios';

import { useAuth } from '@hooks/auth';

import { api } from '@services/api';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';
import { InputMask } from '@components/Form/InputMask';

import {
  FooterContainer,
  FormContainer,
  SignUpContainer,
  SignUpContent,
} from './styles';

const signUpValidationSchema = zod.object({
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  birthday: zod.string(),
  phone: zod.string(),
});

type IFormDataSubmit = zod.infer<typeof signUpValidationSchema>;

export function SignUpScreen() {
  const [loadingCreateAccount, setIsLoadingCreateAccount] = useState(false);
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>();
  const [dateBirthday, setDateBirthday] = useState('');

  const { signIn } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 10;

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
  } = useForm<IFormDataSubmit>({
    resolver: zodResolver(signUpValidationSchema),
  });
  // END FORM

  // FUNCTIONS
  const handleSelectedBirthday = useCallback((date: Date) => {
    setIsOpenDatePicker(false);

    setSelectedBirthday(date);

    const dateFormat = format(date, 'dd/MM/yyyy');
    setDateBirthday(dateFormat);
  }, []);

  const handleFormSubmit = useCallback(
    async ({ name, email, password, phone }: IFormDataSubmit) => {
      try {
        setIsLoadingCreateAccount(true);

        const data = {
          name,
          email,
          password,
          birthday: selectedBirthday,
          phone,
        };

        const response = await api.post('/players', data);

        if (response.status === 201) {
          await signIn({ email, password });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status === 400) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2:
                  'Já identificamos um cadastro com esse dados. Por favor, faça o login ou solicite a recuperação de senha!',
              });
              return;
            }
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Ops! Não foi possível realizar seu cadastro!',
        });
      }
    },
    [selectedBirthday, signIn],
  );
  // END FUNCTIONS

  return (
    <KeyboardAwareScrollView>
      <SignUpContainer>
        <Header style={{ paddingTop }} title="Crie sua conta" />

        <SignUpContent>
          <FormContainer>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  ref={nameRef}
                  autoCapitalize="none"
                  placeholder="Informe o nome"
                  placeholderTextColor={theme.COLORS['gray-color-400']}
                  editable={!loadingCreateAccount}
                  value={value}
                  returnKeyType="next"
                  error={errors.name?.message}
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
                  placeholderTextColor={theme.COLORS['gray-color-400']}
                  editable={!loadingCreateAccount}
                  keyboardType="email-address"
                  value={value}
                  returnKeyType="next"
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
                  autoCapitalize="none"
                  placeholder="Informe a senha"
                  placeholderTextColor={theme.COLORS['gray-color-400']}
                  editable={!loadingCreateAccount}
                  secureTextFieldEntry
                  value={value}
                  returnKeyType="next"
                  error={errors.password?.message}
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
              <Controller
                control={control}
                name="birthday"
                render={({ field: { onChange } }) => (
                  <Input
                    ref={birthdayRef}
                    style={{ color: theme.COLORS['black-color'] }}
                    placeholder="Informe a data de nascimento"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    editable={false}
                    value={dateBirthday}
                    returnKeyType="next"
                    error={errors.birthday?.message}
                    onChangeText={(value) => {
                      onChange(value);
                      setDateBirthday(value);
                    }}
                    onSubmitEditing={() => {
                      phoneRef.current?.focus();
                    }}
                  />
                )}
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
                  placeholderTextColor={theme.COLORS['gray-color-400']}
                  editable={!loadingCreateAccount}
                  keyboardType="numeric"
                  value={value}
                  returnKeyType="next"
                  error={errors.phone?.message}
                  onChangeText={(_, rawText) => {
                    onChange(rawText);
                  }}
                />
              )}
            />
          </FormContainer>

          <FooterContainer>
            <Button
              activeOpacity={0.7}
              loading={loadingCreateAccount}
              onPress={handleSubmit(handleFormSubmit)}
            >
              Criar conta
            </Button>
          </FooterContainer>
        </SignUpContent>

        {/* MODALS */}
        <DatePicker
          modal
          open={openDatePicker}
          title="Data de nascimento"
          mode="date"
          locale="pt"
          date={new Date()}
          onConfirm={(date) => {
            handleSelectedBirthday(date);
          }}
          onCancel={() => {
            setIsOpenDatePicker(false);
          }}
        />
      </SignUpContainer>
    </KeyboardAwareScrollView>
  );
}
