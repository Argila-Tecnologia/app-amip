import { useCallback, useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, useForm } from 'react-hook-form';
import { useTheme } from 'styled-components/native';

import Toast from 'react-native-toast-message';
import { AxiosError } from 'axios';

import { api } from '@services/api';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  ForgotPasswordContainer,
  ForgotPasswordContent,
  ForgotPasswordFooter,
  ForgotPasswordForm,
  ForgotPasswordInfo,
  ForgotPasswordInfoText,
  ForgotPasswordInfoTitle,
} from './styles';

const forgotPasswordValidationSchema = zod.object({
  email: zod.string().email('E-mail inválido'),
});

type IFormSubmitData = zod.infer<typeof forgotPasswordValidationSchema>;

export function ForgotPasswordScreen() {
  const [loading, setIsLoading] = useState(false);
  const theme = useTheme();

  const inputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormSubmitData>({
    resolver: zodResolver(forgotPasswordValidationSchema),
  });

  const handleForgotPassword = useCallback(
    async ({ email }: IFormSubmitData) => {
      try {
        setIsLoading(true);

        const response = await api.post('/password_players/forgot', { email });

        if (response.status === 204) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'E-mail enviado com sucesso!',
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.response?.status;

          if (status === 400) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Equipe AMIP',
              text2: 'Ops! E-mail incorreto!',
            });
            return;
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Recuperar senha',
          text2:
            'Não conseguimos enviar o e-mail. Verifique e tente novamente.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ForgotPasswordContainer>
          <Header title="Esqueci minha senha" />

          <ForgotPasswordContent>
            <ForgotPasswordInfo>
              <ForgotPasswordInfoTitle>
                Esqueceu a senha?
              </ForgotPasswordInfoTitle>

              <ForgotPasswordInfoText>
                Informe o e-mail cadastrado e enviaremos um link de recuperação.
              </ForgotPasswordInfoText>
            </ForgotPasswordInfo>

            <ForgotPasswordForm>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={inputRef}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    placeholder="E-mail"
                    placeholderTextColor={theme.COLORS['gray-color-400']}
                    editable={!loading}
                    returnKeyType="done"
                    error={errors.email?.message}
                    value={value}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(handleForgotPassword)}
                  />
                )}
              />
            </ForgotPasswordForm>
          </ForgotPasswordContent>

          <ForgotPasswordFooter>
            <Button
              loading={loading}
              onPress={handleSubmit(handleForgotPassword)}
            >
              Enviar
            </Button>
          </ForgotPasswordFooter>
        </ForgotPasswordContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
