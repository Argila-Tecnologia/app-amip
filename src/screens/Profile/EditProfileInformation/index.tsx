import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

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
  const [selectedBirthday, setSelectedBirthday] = useState(new Date());
  const [loadingEditSubmit, setIsLoadingEditSubmit] = useState(false);
  const [playerId, setPlayerId] = useState('');

  const { updatePlayerProfile } = useAuth();

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

  // ✅ DATA PICKER
  const handleSelectedBirthday = useCallback(
    (date: Date) => {
      setIsOpenDatePicker(false);
      setSelectedBirthday(date);

      const formatted = format(date, 'dd/MM/yyyy');
      setValue('birthday', formatted);
    },
    [setValue],
  );

  // ✅ SUBMIT
  const handleEditProfile = useCallback(
    async ({ name, email, birthday, phone }: IEditProfileFormSubmitData) => {
      try {
        setIsLoadingEditSubmit(true);

        const [day, month, year] = birthday.split('/');

        const parsedDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
        );

        const response = await api.put('/players', {
          id: playerId,
          name,
          email,
          phone,
          birthday: parsedDate,
        });

        if (response.status === 200) {
          await updatePlayerProfile(response.data);

          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Informações atualizadas com sucesso!',
          });

          navigation.navigate('appBottomTabs', {
            screen: 'newsScreen',
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Equipe AMIP',
              text2: 'Erro ao atualizar informações.',
            });
            return;
          }

          if (error.response?.status === 400) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Equipe AMIP',
              text2: 'Credenciais inválidas.',
            });
            return;
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Erro inesperado ao atualizar.',
        });
      } finally {
        setIsLoadingEditSubmit(false);
      }
    },
    [playerId, navigation, updatePlayerProfile],
  );

  // ✅ QUERY (CORRIGIDO)
  const { data: player, isLoading } = useQuery<IPlayerDTO>({
    queryKey: ['editProfile'],
    queryFn: async () => {
      const response = await api.get('/players/me');
      return response.data;
    },
  });

  useEffect(() => {
    if (player) {
      setPlayerId(player.id);

      setValue('name', player.name);
      setValue('email', player.email);
      setValue('phone', player.phone);

      const formattedDate = format(new Date(player.birthday), 'dd/MM/yyyy');

      setValue('birthday', formattedDate);
    }
  }, [player, setValue]);

  return (
    <EditProfileContainer>
      <Header title="Atualizar perfil" />

      {isLoading ? (
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
                    placeholder="Nome"
                    value={value}
                    error={errors.name?.message}
                    onChangeText={onChange}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={emailRef}
                    placeholder="E-mail"
                    value={value}
                    error={errors.email?.message}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />

              <Pressable onPress={() => setIsOpenDatePicker(true)}>
                <View pointerEvents="none">
                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field: { value } }) => (
                      <Input
                        ref={birthdayRef}
                        placeholder="Data de nascimento"
                        value={value}
                        error={errors.birthday?.message}
                        editable={false}
                      />
                    )}
                  />
                </View>
              </Pressable>

              <Controller
                control={control}
                name="phone"
                render={({ field: { value, onChange } }) => (
                  <InputMask
                    placeholder="Telefone"
                    value={value}
                    error={errors.phone?.message}
                    onChangeText={onChange}
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

      {/* DATE PICKER */}
      <DatePicker
        modal
        open={openDatePicker}
        mode="date"
        locale="pt-BR"
        date={selectedBirthday}
        onConfirm={handleSelectedBirthday}
        onCancel={() => setIsOpenDatePicker(false)}
      />
    </EditProfileContainer>
  );
}
