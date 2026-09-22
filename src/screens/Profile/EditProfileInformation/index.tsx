import { useCallback, useRef, useState } from 'react';

import { Pressable, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Controller, useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';

import { useQuery } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import DatePicker from 'react-native-date-picker';

import Toast from 'react-native-toast-message';

import { useTheme } from 'styled-components/native';

import { api } from '@services/api';

import { useAuth } from '@hooks/auth';

import { IPlayerDTO } from '@dtos/player-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { Input } from '@components/Form/Input';
import { InputMask } from '@components/Form/InputMask';
import { Button } from '@components/Form/Button';

import {
  EditProfileButtonContainer,
  EditProfileContainer,
  EditProfileContent,
  EditProfileForm,
  Label,
} from './styles';

const editProfileValidationSchema = zod.object({
  name: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
  email: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório')
    .email('E-mail inválido'),
  birthday: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
  phone: zod
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório'),
});

type IEditProfileFormSubmitData = zod.infer<typeof editProfileValidationSchema>;

export function EditProfileInformationScreen() {
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>(new Date());
  // const [dateBirthday, setDateBirthday] = useState('');
  const [loadingEditSubmit, setIsLoadingEditSubmit] = useState(false);
  // Contas criadas/vinculadas via login com Google travam o e-mail (ver
  // UpdatePlayerCompleteUseCase no backend, que rejeita a troca) - o campo
  // fica só-leitura aqui pra já dar o feedback certo antes de tentar salvar.
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  const { updatePlayerProfile } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const birthdayRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IEditProfileFormSubmitData>({
    resolver: zodResolver(editProfileValidationSchema),
  });

  // FUNCTIONS
  const handleSelectedBirthday = useCallback(
    (date: Date) => {
      setIsOpenDatePicker(false);

      setSelectedBirthday(date);

      const dateFormat = format(date, 'dd/MM/yyyy');
      // setDateBirthday(dateFormat);
      setValue('birthday', dateFormat);
    },
    [setValue],
  );

  const handleEditProfile = useCallback(
    async ({ name, email, birthday, phone }: IEditProfileFormSubmitData) => {
      try {
        setIsLoadingEditSubmit(true);

        // Pega a data no formato dd/MM/yyyy, porém sendo uma string
        const formattedDateBirthday = birthday.split('/');

        // Transforma a data no formato string em formato Date yyyy/MM/dd
        const dateBirthdayTypeDate = new Date(
          `${formattedDateBirthday[2]}-${formattedDateBirthday[1]}-${formattedDateBirthday[0]}`,
        );

        const editData = {
          name,
          email,
          phone,
          birthday: dateBirthdayTypeDate,
        };

        // "/players/me" é a autoatualização do próprio atleta (o "id" vem
        // do token, não é enviado aqui) - diferente de "/players/update/
        // basic" e "/players/update/complete", que são staff-only
        // (painel admin-web-amip). Essa tela chamava "PUT /players", uma
        // rota que nunca existiu no backend - toda tentativa de salvar
        // dava 404, e o interceptor global do axios (api.ts) deslogava o
        // atleta em qualquer erro não-401, mascarando o problema real
        // como se fosse a sessão que tivesse caído.
        const responsePlayerUpdate = await api.put('/players/me', editData);

        if (responsePlayerUpdate.status === 200) {
          await updatePlayerProfile(responsePlayerUpdate.data);

          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Informações atualizadas com sucesso!',
          });

          // navigation.navigate('TabNews', { screen: 'NewsScreen' });
          navigation.navigate('appBottomTabs', { screen: 'newsScreen' });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status === 404) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2: 'Ops! Não foi possível atualizar suas informações.',
              });
            } else if (error.response.status === 400) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2: 'Ops! Verifique se o e-mail informado já não está em uso.',
              });
            }

            return;
          }

          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Ops! Não foi possível atualizar suas informações.',
          });
        }
      } finally {
        setIsLoadingEditSubmit(false);
      }
    },
    [navigation, updatePlayerProfile],
  );
  // END FUNCTIONS

  const { isLoading: isLoadingEditProfile } = useQuery<IPlayerDTO | undefined>({
    queryKey: ['editProfile'],
    queryFn: async () => {
      const response = await api.get('/players/me');

      if (response.status === 200) {
        const responsePlayer = response.data as IPlayerDTO;

        setIsGoogleAccount(!!responsePlayer.google_id);

        setValue('name', responsePlayer.name);
        setValue('email', responsePlayer.email);
        setValue('phone', responsePlayer.phone ?? '');

        // `birthday` pode não existir (conta criada via login com Google,
        // que não fornece data de nascimento) - `format(new Date(undefined))`
        // lança RangeError ("Invalid time value") e quebraria essa tela
        // pra qualquer atleta nessa situação, exatamente quando ele tenta
        // completar o perfil. Sem valor, o campo só fica vazio, pro
        // atleta preencher (a validação do formulário já exige antes de
        // salvar).
        if (responsePlayer.birthday) {
          const dateFormatted = format(
            new Date(responsePlayer.birthday),
            'dd/MM/yyyy',
          );

          setValue('birthday', dateFormatted);
        }
        // setDateBirthday(dateFormatted);

        return responsePlayer;
      }
    },
  });

  return (
    <EditProfileContainer>
      <Header title="Atualizar perfil" />

      {isLoadingEditProfile ? (
        <Loading />
      ) : (
        <KeyboardAwareScrollView>
          <EditProfileContent>
            <EditProfileForm>
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={nameRef}
                    placeholder="Informe o nome"
                    placeholderTextColor={theme.COLORS['text-secondary']}
                    autoCorrect={false}
                    returnKeyType="next"
                    error={errors.name?.message}
                    value={value}
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
                    placeholder="Informe o e-mail"
                    placeholderTextColor={theme.COLORS['text-secondary']}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    editable={!isGoogleAccount}
                    style={isGoogleAccount ? { opacity: 0.5 } : undefined}
                    error={errors.email?.message}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                  />
                )}
              />

              {isGoogleAccount && (
                <Label>
                  E-mail vinculado à sua conta Google - não pode ser alterado.
                </Label>
              )}

              <Pressable
                onPress={() => {
                  setIsOpenDatePicker(true);
                }}
              >
                <Controller
                  control={control}
                  name="birthday"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={birthdayRef}
                      placeholder="Informe a data de nascimento"
                      placeholderTextColor={theme.COLORS['text-secondary']}
                      editable={false}
                      returnKeyType="next"
                      error={errors.birthday?.message}
                      value={value}
                      onChangeText={(value) => {
                        onChange(value);
                        // setDateBirthday(value);
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
                    placeholder="Ex.: DDD + Nº de telefone"
                    placeholderTextColor={theme.COLORS['text-secondary']}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    error={errors.phone?.message}
                    value={value}
                    onChangeText={(_, rawText) => {
                      onChange(rawText);
                    }}
                  />
                )}
              />

              <EditProfileButtonContainer>
                <Button
                  loading={loadingEditSubmit}
                  onPress={handleSubmit(handleEditProfile)}
                >
                  Atualizar
                </Button>
              </EditProfileButtonContainer>
            </EditProfileForm>
          </EditProfileContent>
        </KeyboardAwareScrollView>
      )}

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
    </EditProfileContainer>
  );
}
