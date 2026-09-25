import { useCallback, useRef, useState } from 'react';

import { Pressable, Switch, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Controller, useForm } from 'react-hook-form';

import Toast from 'react-native-toast-message';

import DatePicker from 'react-native-date-picker';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { differenceInYears, format } from 'date-fns';

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
  MinorToggleLabel,
  MinorToggleRow,
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
const signUpValidationSchema = zod
  .object({
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
    // Menor de idade - mesma regra do admin-web-amip/api-ibra (ver
    // IsMinor no backend): não é uma coluna própria, é calculado a partir
    // de "birthday" sempre que o atleta escolhe a data no DatePicker (ver
    // handleSelectedBirthday). Controla só a exibição condicional dos
    // campos de pai/mãe/responsável/colégio abaixo.
    is_minor: zod.boolean().default(false),
    father_name: zod.string().optional(),
    father_phone: zod.string().optional(),
    mother_name: zod.string().optional(),
    mother_phone: zod.string().optional(),
    responsible_name: zod.string().optional(),
    responsible_phone: zod.string().optional(),
    school_name: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_minor) {
      return;
    }

    // Mesma regra do admin-web-amip/api-ibra: precisa do nome E do
    // telefone de pelo menos um entre pai, mãe ou responsável - não basta
    // ter só um dos dois, precisa ser o par completo da mesma pessoa. O
    // par do responsável só é obrigatório se nem o do pai nem o da mãe
    // tiverem sido preenchidos por completo. A API também valida essa
    // regra no backend.
    const hasGuardianContact = Boolean(
      (data.father_name && data.father_phone) ||
        (data.mother_name && data.mother_phone) ||
        (data.responsible_name && data.responsible_phone),
    );

    if (!hasGuardianContact) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message:
          'Informe o nome e o telefone de pelo menos um: pai, mãe ou responsável.',
        path: ['responsible_phone'],
      });
    }
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
  const fatherNameRef = useRef<TextInput>(null);
  const fatherPhoneRef = useRef<TextInput>(null);
  const motherNameRef = useRef<TextInput>(null);
  const motherPhoneRef = useRef<TextInput>(null);
  const responsibleNameRef = useRef<TextInput>(null);
  const responsiblePhoneRef = useRef<TextInput>(null);
  const schoolNameRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormDataSubmit>({
    resolver: zodResolver(signUpValidationSchema),
    // is_player_club é boolean obrigatório no schema - sem esse default,
    // ele começa como "undefined" e a validação falha nele sempre, mesmo
    // que o usuário nunca precise mexer no checkbox (não é sócio).
    defaultValues: {
      is_player_club: false,
      is_minor: false,
    },
  });

  // Controla a exibição condicional dos campos de pai/mãe/responsável e
  // colégio - só aparecem quando "is_minor" está ligado (ver
  // handleSelectedBirthday).
  const isMinorField = watch('is_minor');
  // END FORM

  // FUNCTIONS
  const handleSelectedBirthday = useCallback(
    (date: Date) => {
      setIsOpenDatePicker(false);

      setSelectedBirthday(date);

      const dateFormat = format(date, 'dd/MM/yyyy');
      setDateBirthday(dateFormat);
      setValue('birthday', dateFormat);

      // Mesma regra do admin-web-amip/api-ibra (ver IsMinor no backend) -
      // recalcula sempre que o atleta escolhe/troca a data de nascimento.
      // differenceInYears já trata corretamente quem ainda não fez
      // aniversário este ano (trunca em vez de arredondar).
      setValue('is_minor', differenceInYears(new Date(), date) < 18);
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
      is_minor,
      father_name,
      father_phone,
      mother_name,
      mother_phone,
      responsible_name,
      responsible_phone,
      school_name,
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
          // Os campos de pai/mãe/responsável/colégio só fazem sentido
          // quando o atleta é menor de idade - se "is_minor" acabou
          // ficando desligado (ex: corrigiu a data de nascimento depois
          // de preencher), manda tudo undefined em vez do que sobrou
          // digitado (evita enviar dado "órfão"). "is_minor" em si nunca é
          // enviado - a API não conhece essa chave e rejeitaria a
          // requisição com 400 (mesmo motivo do admin-web-amip).
          father_name: is_minor ? father_name : undefined,
          father_phone: is_minor ? father_phone : undefined,
          mother_name: is_minor ? mother_name : undefined,
          mother_phone: is_minor ? mother_phone : undefined,
          responsible_name: is_minor ? responsible_name : undefined,
          responsible_phone: is_minor ? responsible_phone : undefined,
          school_name: is_minor ? school_name : undefined,
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
              // A validação do Zod acima já bloqueia esse caso antes de
              // chegar aqui na imensa maioria das vezes - esse fallback
              // existe só pra não mostrar a mensagem genérica de "já
              // cadastrado" (enganosa) se, por algum motivo, a API
              // rejeitar por essa regra específica.
              const message = error.response.data?.message as
                | string
                | undefined;

              if (message?.includes('full contact')) {
                Toast.show({
                  type: 'error',
                  position: 'bottom',
                  text1: 'Equipe AMIP',
                  text2:
                    'Informe o nome e o telefone de pelo menos um: pai, mãe ou responsável.',
                });
                return;
              }

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
    // Mesmo motivo do ForgotPassword: sem isso, rolar até o fim do
    // formulário revela o fundo do KeyboardAwareScrollView (que não tem
    // cor própria) embaixo do SignUpContainer, sempre claro mesmo no
    // tema escuro.
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.COLORS.background }}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                    style={{ color: theme.COLORS.text }}
                    placeholder="Informe a data de nascimento"
                    placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                  placeholder="Informe o rating"
                  placeholderTextColor={theme.COLORS['text-secondary']}
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
                        : theme.COLORS['text-secondary']
                    }
                  />

                  <SubscriptionCategoryActionButtonText>
                    Você é sócio da AMIP?
                  </SubscriptionCategoryActionButtonText>
                </MemberActionButton>
              )}
            />

            {/*
              MENOR DE IDADE - somente leitura de propósito (disabled):
              quem decide o valor é handleSelectedBirthday, que recalcula a
              idade toda vez que o atleta escolhe a data de nascimento no
              DatePicker, nunca um toque direto aqui. Liga/desliga a
              exibição dos campos de pai/mãe/responsável e colégio logo
              abaixo. A obrigatoriedade de pelo menos um par completo de
              nome+telefone de contato é validada no .superRefine() do
              schema Zod lá em cima, e de novo no backend (API) -
              "is_minor" em si não é enviado, só controla o formulário.
            */}
            <MinorToggleRow>
              <MinorToggleLabel>
                Menor de idade? (automático pela data de nascimento)
              </MinorToggleLabel>
              <Controller
                control={control}
                name="is_minor"
                render={({ field: { value } }) => (
                  <Switch
                    value={value}
                    disabled
                    trackColor={{
                      false: theme.COLORS['gray-color-300'],
                      true: theme.COLORS['green-color'],
                    }}
                    thumbColor={theme.COLORS['white-color']}
                  />
                )}
              />
            </MinorToggleRow>

            {/*
              Campos de pai/mãe/responsável e colégio, só visíveis quando
              "Menor de idade?" está ligado.
            */}
            {isMinorField && (
              <>
                <Controller
                  control={control}
                  name="father_name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={fatherNameRef}
                      autoCapitalize="none"
                      placeholder="Nome do pai"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      value={value}
                      returnKeyType="next"
                      error={errors.father_name?.message}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      onSubmitEditing={() => {
                        fatherPhoneRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="father_phone"
                  render={({ field: { value, onChange } }) => (
                    <InputMask
                      mask="(99)99999-9999"
                      autoCapitalize="none"
                      placeholder="Telefone do pai"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      keyboardType="numeric"
                      value={value}
                      returnKeyType="next"
                      error={errors.father_phone?.message}
                      onChangeText={(_, rawText) => {
                        onChange(rawText);
                      }}
                      onSubmitEditing={() => {
                        motherNameRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="mother_name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={motherNameRef}
                      autoCapitalize="none"
                      placeholder="Nome da mãe"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      value={value}
                      returnKeyType="next"
                      error={errors.mother_name?.message}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      onSubmitEditing={() => {
                        motherPhoneRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="mother_phone"
                  render={({ field: { value, onChange } }) => (
                    <InputMask
                      mask="(99)99999-9999"
                      autoCapitalize="none"
                      placeholder="Telefone da mãe"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      keyboardType="numeric"
                      value={value}
                      returnKeyType="next"
                      error={errors.mother_phone?.message}
                      onChangeText={(_, rawText) => {
                        onChange(rawText);
                      }}
                      onSubmitEditing={() => {
                        responsibleNameRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="responsible_name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={responsibleNameRef}
                      autoCapitalize="none"
                      placeholder="Nome do responsável (se não for pai/mãe)"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      value={value}
                      returnKeyType="next"
                      error={errors.responsible_name?.message}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      onSubmitEditing={() => {
                        responsiblePhoneRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="responsible_phone"
                  render={({ field: { value, onChange } }) => (
                    <InputMask
                      mask="(99)99999-9999"
                      autoCapitalize="none"
                      placeholder="Telefone do responsável"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      keyboardType="numeric"
                      value={value}
                      returnKeyType="next"
                      error={errors.responsible_phone?.message}
                      onChangeText={(_, rawText) => {
                        onChange(rawText);
                      }}
                      onSubmitEditing={() => {
                        schoolNameRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="school_name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={schoolNameRef}
                      autoCapitalize="none"
                      placeholder="Colégio onde estuda"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={!loadingCreateAccount}
                      value={value}
                      returnKeyType="done"
                      error={errors.school_name?.message}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                    />
                  )}
                />
              </>
            )}
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
