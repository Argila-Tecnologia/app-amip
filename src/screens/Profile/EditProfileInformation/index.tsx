import { useCallback, useRef, useState } from 'react';

import { Pressable, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
} from './styles';

const editProfileValidationSchema = zod.object({
  name: zod.string().min(1),
  email: zod.string().email(),
  birthday: zod.string().min(1),
  phone: zod.string().min(1),
});

type IEditProfileFormSubmitData = zod.infer<typeof editProfileValidationSchema>;

export function EditProfileInformationScreen() {
  const [openDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<Date>(new Date());
  // const [dateBirthday, setDateBirthday] = useState('');
  const [loadingEditSubmit, setIsLoadingEditSubmit] = useState(false);
  const [playerId, setPlayerId] = useState('');

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
          id: playerId,
          name,
          email,
          phone,
          birthday: dateBirthdayTypeDate,
        };

        const responsePlayerUpdate = await api.put('/players', editData);

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
                text2: 'Ops! Credenciais incorretas.',
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
    [playerId, navigation, updatePlayerProfile],
  );
  // END FUNCTIONS

  const { isLoading: isLoadingEditProfile } = useQuery<IPlayerDTO | undefined>({
    queryKey: ['editProfile'],
    queryFn: async () => {
      const response = await api.get('/players/me');

      if (response.status === 200) {
        const responsePlayer = response.data as IPlayerDTO;

        setPlayerId(responsePlayer.id);

        setValue('name', responsePlayer.name);
        setValue('email', responsePlayer.email);
        setValue('phone', responsePlayer.phone);

        const dateFormatted = format(
          new Date(responsePlayer.birthday),
          'dd/MM/yyyy',
        );

        setValue('birthday', dateFormatted);
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
                    placeholderTextColor={theme.COLORS['gray-color-400']}
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
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    error={errors.email?.message}
                    value={value}
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
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={birthdayRef}
                      style={{ color: '#000' }}
                      placeholder="Informe a data de nascimento"
                      placeholderTextColor={theme.COLORS['gray-color-400']}
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
                    placeholder="Ex.: DDD + Nº de telefone"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    error={errors.phone?.message}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
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
