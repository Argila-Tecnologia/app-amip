import { useCallback, useRef, useState } from 'react';

import { TextInput } from 'react-native';

import { Controller, useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import Toast from 'react-native-toast-message';

import { AxiosError } from 'axios';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useTheme } from 'styled-components/native';

import { api } from '@services/api';

import { useAuth } from '@hooks/auth';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  EditPasswordContainer,
  EditPasswordContent,
  EditPasswordFooterContainer,
  EditPasswordFormContainer,
} from './styles';

const editPasswordValidationSchema = zod
  .object({
    old_password: zod.string(),
    password: zod.string(),
    password_confirmation: zod.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'A confirmação da senha não confere',
    path: ['confirm_password'],
  });

type IEditPasswordFormSubmitData = zod.infer<
  typeof editPasswordValidationSchema
>;

export function EditPasswordScreen() {
  const [loadingEditPassword, setIsLoadingEditPassword] = useState(false);

  const { updatePlayerProfile } = useAuth();

  const theme = useTheme();

  const oldPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEditPasswordFormSubmitData>({
    resolver: zodResolver(editPasswordValidationSchema),
  });

  // FUNCTIONS
  const handleEditPassword = useCallback(
    async ({
      old_password,
      password,
      password_confirmation,
    }: IEditPasswordFormSubmitData) => {
      try {
        setIsLoadingEditPassword(true);

        const response = await api.patch('players/password', {
          old_password,
          password,
          password_confirmation,
        });

        if (response.status === 200) {
          await updatePlayerProfile(response.data);

          reset();

          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Senha atualizada com sucesso!',
          });
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
                  'Informações incorretas, por favor verifique e tente novamente!',
              });

              return;
            }

            if (error.response.status === 401) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2: 'Não foi possível atualizar a senha!',
              });

              return;
            }
          }
        }
      } finally {
        setIsLoadingEditPassword(false);
      }
    },
    [updatePlayerProfile, reset],
  );
  // END FUNCTIONS

  return (
    <KeyboardAwareScrollView>
      <EditPasswordContainer>
        <Header title="Atualizar senha" />

        <EditPasswordContent>
          <EditPasswordFormContainer>
            <Controller
              control={control}
              name="old_password"
              render={({ field: { value, onChange } }) => (
                <Input
                  ref={oldPasswordRef}
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  placeholder="Senha atual"
                  placeholderTextColor={theme.colors['gray-color-400']}
                  secureTextFieldEntry
                  returnKeyType="next"
                  error={errors.old_password?.message}
                  value={value}
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
                  autoCorrect={false}
                  icon="lock"
                  placeholder="Nova senha"
                  placeholderTextColor={theme.colors['gray-color-400']}
                  secureTextFieldEntry
                  returnKeyType="next"
                  error={errors.password?.message}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                  }}
                  onSubmitEditing={() => {
                    passwordConfirmRef.current?.focus();
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirmation"
              render={({ field: { value, onChange } }) => (
                <Input
                  ref={passwordConfirmRef}
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  placeholder="Confirme a nova senha"
                  placeholderTextColor={theme.colors['gray-color-400']}
                  secureTextFieldEntry
                  returnKeyType="send"
                  error={errors.password_confirmation?.message}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                  }}
                  onSubmitEditing={handleSubmit(handleEditPassword)}
                />
              )}
            />
          </EditPasswordFormContainer>
        </EditPasswordContent>

        <EditPasswordFooterContainer>
          <Button
            loading={loadingEditPassword}
            onPress={handleSubmit(handleEditPassword)}
          >
            Atualizar senha
          </Button>
        </EditPasswordFooterContainer>
      </EditPasswordContainer>
    </KeyboardAwareScrollView>
  );
}
