import { useCallback, useRef, useState } from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

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
  email: zod.string().email('E-mail inválido'),
  password: zod.string().min(1, 'Informe a senha'),
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

  const handleDeleteProfile = useCallback(
    async ({ email, password }: IDeleteProfileFormSubmitData) => {
      try {
        setIsLoadingDeleteSubmit(true);

        const response = await api.delete('/players', {
          data: { email, password },
        });

        if (response.status === 204) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Conta removida com sucesso!',
          });

          navigation.navigate('appBottomTabs', {
            screen: 'newsScreen',
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.response?.status;

          if (status === 401) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Equipe AMIP',
              text2: 'Verifique seu e-mail e senha.',
            });
            return;
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Equipe AMIP',
          text2: 'Não foi possível remover a conta.',
        });
      } finally {
        setIsLoadingDeleteSubmit(false);
      }
    },
    [navigation],
  );

  return (
    <DeleteProfileContainer>
      <Header title="Remover conta" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
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
                    onChangeText={onChange}
                    onSubmitEditing={() => passwordRef.current?.focus()}
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
                    secureTextEntry
                    returnKeyType="done"
                    error={errors.password?.message}
                    value={value}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(handleDeleteProfile)}
                  />
                )}
              />

              <DeleteProfileButtonContainer>
                <Button
                  style={{
                    backgroundColor: theme.COLORS['red-color'],
                  }}
                  loading={loadingDeleteSubmit}
                  onPress={handleSubmit(handleDeleteProfile)}
                >
                  Remover conta
                </Button>
              </DeleteProfileButtonContainer>
            </EditProfileForm>
          </DeleteProfileContent>
        </ScrollView>
      </KeyboardAvoidingView>
    </DeleteProfileContainer>
  );
}
