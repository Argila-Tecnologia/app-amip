import { useCallback, useRef, useState } from 'react';

import { Pressable, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

// Só name/email/password/phone/birthday são obrigatórios de verdade no
// POST /players do backend (ver players.routes.ts) - os campos de perfil
// esportivo abaixo são opcionais lá, então precisam ser opcionais aqui
// também. Antes, marcá-los como obrigatórios bloqueava o cadastro por
// completo pra qualquer atleta que não preenchesse TODOS eles (ex: quem
// ainda não tem madeira/borracha definida), sem nenhum aviso visível.
const signUpValidationSchema = zod.object({
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  birthday: zod.string(),
  phone: zod.string(),
  gender: zod.string().optional(),
  grip: zod.string().optional(),
  dominant_hand: zod.string().optional(),
  rubber: zod.string().optional(),
  wood: zod.string().optional(),
  main_title_of_career: zod.string().optional(),
  ranking: zod.string().optional(),
  rating: zod.string().optional(),
  is_player_club: zod.boolean(),
});

type IFormDataSubmit = zod.infer<typeof signUpValidationSchema>;

export function SignUpScreen() {
  const [loadingCreateAccount, setIsLoadingCreateAccount] = useState(false);
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>(new Date());
  const [dateBirthday, setDateBirthday] = useState('');

  const { signIn } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

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
    // is_player_club é boolean obrigatório no schema - sem esse default,
    // ele começa como "undefined" e a validação falha nele sempre, mesmo
    // que o usuário nunca precise mexer no checkbox (não é sócio).
    defaultValues: {
      is_player_club: false,
    },
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

          // Antes o cadastro terminava aqui, sem toast nem navegação - o
          // atleta ficava na própria tela de SignUp sem nenhum sinal de
          // que tinha dado certo (só percebia olhando o banco/API
          // diretamente). Decisão confirmada com o usuário: mostrar
          // sucesso e levar pra tela principal (abas públicas), já
          // autenticado - reset() em vez de navigate() porque, diferente
          // de um simples "voltar", não faz sentido deixar o botão
          // "voltar" do device retornar pra tela de cadastro depois de
          // já ter criado a conta.
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Cadastro realizado com sucesso! Bem-vindo(a).',
          });

          navigation.reset({
            index: 0,
            routes: [{ name: 'appBottomTabs' }],
          });
        }
      } catch (error) {
        // Antes não existia nenhum log aqui - qualquer erro (rede, 400,
        // 500 etc.) só virava um toast genérico, sem deixar rastro nenhum
        // pra investigar depois. Ajuda a diagnosticar via Metro/logcat.
        console.error('[SignUp] Falha ao cadastrar atleta:', error);

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
      } finally {
        // Antes isso nunca era chamado - depois de qualquer tentativa
        // (sucesso ou erro), o botão "Criar conta" e todos os campos
        // ficavam desabilitados pra sempre (editable={!loadingCreateAccount}
        // em cada Input), já que loadingCreateAccount nunca voltava a false.
        setIsLoadingCreateAccount(false);
      }
    },
    [selectedBirthday, signIn, navigation],
  );

  // END FUNCTIONS

  return (
    <KeyboardAwareScrollView>
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

            {/*
              Antes esse checkbox só mexia num useState local ("memberClub"),
              sem nenhuma ligação com o react-hook-form - como o schema exige
              "is_player_club" como boolean obrigatório, o valor ficava
              sempre "undefined" pro zodResolver, a validação nunca passava,
              e o cadastro nunca era enviado (silenciosamente, sem nenhum
              erro visível). Agora o valor mora no próprio formulário.
            */}
            <Controller
              control={control}
              name="is_player_club"
              render={({ field: { value, onChange } }) => (
                <MemberActionButton onPress={() => onChange(!value)}>
                  <Feather
                    name={value ? 'check-square' : 'square'}
                    size={25}
                    color={
                      value
                        ? theme.COLORS['green-color']
                        : theme.COLORS['gray-color']
                    }
                  />

                  <SubscriptionCategoryActionButtonText>
                    Você é sócio da AMIP?
                  </SubscriptionCategoryActionButtonText>
                </MemberActionButton>
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
  );
}
