import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Controller, useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { useTheme } from 'styled-components/native';

import { api } from '@services/api';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  DeleteProfileButtonContainer,
  DeleteProfileContainer,
  DeleteProfileContent,
  EditProfileForm,
} from './styles';

const deleteProfileValidationSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

type IDeleteProfileFormSubmitData = zod.infer<
  typeof deleteProfileValidationSchema
>;

export function DeleteProfileScreen() {
  const [loadingDeleteSubmit, setIsLoadingDeleteSubmit] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IDeleteProfileFormSubmitData>({
    resolver: zodResolver(deleteProfileValidationSchema),
  });

  // FUNCTIONS

  const handleEditProfile = useCallback(
    async ({ email, password }: IDeleteProfileFormSubmitData) => {
      try {
        setIsLoadingDeleteSubmit(true);

        const responseRemoveAccount = await api.delete('/players', {
          data: { email, password },
        });

        if (responseRemoveAccount.status === 204) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Conta removida com sucesso!',
          });

          // navigation.navigate('TabNews', { screen: 'NewsScreen' });
          navigation.navigate('appBottomTabs', { screen: 'newsScreen' });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status === 401) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2: 'Ops! Verifique seu e-mail e senha e tente novamente.',
              });
            }

            return;
          }

          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Ops! Não foi possível remover suas informações.',
          });
        }
      } finally {
        setIsLoadingDeleteSubmit(false);
      }
    },
    [navigation],
  );
  // END FUNCTIONS

  return (
    <DeleteProfileContainer>
      <Header title="Remover conta" />

      <KeyboardAwareScrollView>
        <DeleteProfileContent>
          <EditProfileForm>
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

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  ref={passwordRef}
                  placeholder="Informe a senha"
                  placeholderTextColor={theme.COLORS['gray-color-400']}
                  autoCorrect={false}
                  returnKeyType="next"
                  error={errors.password?.message}
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

            <DeleteProfileButtonContainer>
              <Button
                style={{ backgroundColor: theme.COLORS['red-color'] }}
                loading={loadingDeleteSubmit}
                onPress={handleSubmit(handleEditProfile)}
              >
                Remover conta
              </Button>
            </DeleteProfileButtonContainer>
          </EditProfileForm>
        </DeleteProfileContent>
      </KeyboardAwareScrollView>
    </DeleteProfileContainer>
  );
}
