import { useCallback, useRef, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Controller, useForm } from 'react-hook-form';

import Toast from 'react-native-toast-message';

import DatePicker from 'react-native-date-picker';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { format } from 'date-fns';

import { AxiosError } from 'axios';

import { useAuth } from '@hooks/auth';

import { api } from '@services/api';

import { genderData } from '@utils/gender-data';
import { gripData } from '@utils/grip-data';
import { handData } from '@utils/hand-data';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { InputMask } from '@components/Form/InputMask';
import { SelectPicker } from '@components/Form/SelectPicker';
import { Button } from '@components/Form/Button';

import {
  FooterContainer,
  FormContainer,
  MemberActionButton,
  SignUpContainer,
  SignUpContent,
  SignUpSelectPickerContainer,
  SubscriptionCategoryActionButtonText,
} from './styles';

const signUpValidationSchema = zod.object({
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  birthday: zod.string(),
  phone: zod.string(),
  gender: zod.string(),
  grip: zod.string(),
  dominant_hand: zod.string(),
  rubber: zod.string(),
  wood: zod.string(),
  main_title_of_career: zod.string(),
  ranking: zod.string(),
  rating: zod.string(),
  is_player_club: zod.boolean(),
});

type IFormDataSubmit = zod.infer<typeof signUpValidationSchema>;

export function SignUpScreen() {
  const [loadingCreateAccount, setIsLoadingCreateAccount] = useState(false);
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>(new Date());
  const [dateBirthday, setDateBirthday] = useState('');

  const [memberClub, setMemberClub] = useState(false);

  const { signIn } = useAuth();
  const theme = useTheme();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const birthdayRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const genderRef = useRef<TextInput>(null);
  const rubberRef = useRef<TextInput>(null);
  const woodRef = useRef<TextInput>(null);
  const mainTitleOfCareerRef = useRef<TextInput>(null);
  const rankingRef = useRef<TextInput>(null);
  const ratingRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormDataSubmit>({
    resolver: zodResolver(signUpValidationSchema),
  });
  // END FORM

  // FUNCTIONS
  const handleSelectedBirthday = useCallback(
    (date: Date) => {
      setIsOpenDatePicker(false);

      setSelectedBirthday(date);

      const dateFormat = format(date, 'dd/MM/yyyy');
      setDateBirthday(dateFormat);
      setValue('birthday', dateFormat);
    },
    [setValue],
  );

  const handleFormSubmit = useCallback(
    async ({
      name,
      email,
      password,
      phone,
      gender,
      grip,
      dominant_hand,
      rubber,
      wood,
      main_title_of_career,
      ranking,
      rating,
      is_player_club,
    }: IFormDataSubmit) => {
      try {
        setIsLoadingCreateAccount(true);

        const data = {
          name,
          email,
          password,
          birthday: selectedBirthday,
          phone,
          gender,
          grip,
          dominant_hand,
          rubber,
          wood,
          main_title_of_career,
          ranking,
          rating,
          is_player_club,
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

  const handleSelectedIsMember = useCallback(() => {
    setMemberClub((oldState) => !oldState);
  }, []);
  // END FUNCTIONS

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SignUpContainer>
          <Header title="Crie sua conta" />

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
                  render={() => (
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
                    onSubmitEditing={() => {
                      genderRef.current?.focus();
                    }}
                  />
                )}
              />

              <SignUpSelectPickerContainer>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { value, onChange } }) => (
                    <SelectPicker
                      items={genderData()}
                      placeholder="Informe o gênero"
                      error={errors.gender?.message}
                      value={value}
                      onValueChange={(text) => {
                        onChange(text);
                      }}
                    />
                  )}
                />
              </SignUpSelectPickerContainer>

              <SignUpSelectPickerContainer>
                <Controller
                  control={control}
                  name="grip"
                  render={({ field: { value, onChange } }) => (
                    <SelectPicker
                      items={gripData()}
                      placeholder="Empunhadura"
                      error={errors.grip?.message}
                      value={value}
                      onValueChange={(text) => {
                        onChange(text);
                      }}
                    />
                  )}
                />
              </SignUpSelectPickerContainer>

              <SignUpSelectPickerContainer>
                <Controller
                  control={control}
                  name="dominant_hand"
                  render={({ field: { value, onChange } }) => (
                    <SelectPicker
                      items={handData()}
                      placeholder="Informe a mão dominante"
                      error={errors.dominant_hand?.message}
                      value={value}
                      onValueChange={(text) => {
                        onChange(text);
                      }}
                    />
                  )}
                />
              </SignUpSelectPickerContainer>

              <Controller
                control={control}
                name="rubber"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={rubberRef}
                    autoCapitalize="none"
                    placeholder="Informe a borracha"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    editable={!loadingCreateAccount}
                    value={value}
                    returnKeyType="next"
                    error={errors.rubber?.message}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onSubmitEditing={() => {
                      woodRef.current?.focus();
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="wood"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={woodRef}
                    autoCapitalize="none"
                    placeholder="Informe o principal título da carreira"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    editable={!loadingCreateAccount}
                    value={value}
                    returnKeyType="next"
                    error={errors.wood?.message}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onSubmitEditing={() => {
                      mainTitleOfCareerRef.current?.focus();
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="ranking"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={rankingRef}
                    autoCapitalize="none"
                    placeholder="Informe o ranking"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    editable={!loadingCreateAccount}
                    value={value}
                    returnKeyType="next"
                    error={errors.ranking?.message}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onSubmitEditing={() => {
                      ratingRef.current?.focus();
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="rating"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={ratingRef}
                    autoCapitalize="none"
                    placeholder="Informe o nome"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    editable={!loadingCreateAccount}
                    value={value}
                    returnKeyType="next"
                    error={errors.rating?.message}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                  />
                )}
              />

              <MemberActionButton onPress={() => handleSelectedIsMember()}>
                <Feather
                  name={memberClub ? 'check-square' : 'square'}
                  size={25}
                  color={
                    memberClub
                      ? theme.COLORS['green-color']
                      : theme.COLORS['gray-color']
                  }
                />

                <SubscriptionCategoryActionButtonText>
                  Você é sócio da AMIP?
                </SubscriptionCategoryActionButtonText>
              </MemberActionButton>
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
            date={selectedBirthday}
            onConfirm={(date) => {
              handleSelectedBirthday(date);
            }}
            onCancel={() => {
              setIsOpenDatePicker(false);
            }}
          />
        </SignUpContainer>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
