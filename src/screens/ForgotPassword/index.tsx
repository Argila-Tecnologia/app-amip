import { useCallback, useState } from 'react';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  email: zod.string().email(),
});

type IFormSubmitData = zod.infer<typeof forgotPasswordValidationSchema>;

export function ForgotPasswordScreen() {
  const [loading, setIsLoading] = useState(false);

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormSubmitData>({
    resolver: zodResolver(forgotPasswordValidationSchema),
  });

  // FUNCTION
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
          if (error.response) {
            if (error.response.status === 400) {
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
              'Ops! Não conseguimos enviar o e-mail. Veja se seu e-mail está correto!',
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  // END FUNCTION

  return (
    <KeyboardAwareScrollView>
      <ForgotPasswordContainer>
        <Header title="Esqueci minha senha" />

        <ForgotPasswordContent>
          <ForgotPasswordInfo>
            <ForgotPasswordInfoTitle>Esqueceu a senha?</ForgotPasswordInfoTitle>

            <ForgotPasswordInfoText>
              Informe o e-mail cadastrado e te enviaremos um e-mail de
              recuperação
            </ForgotPasswordInfoText>
          </ForgotPasswordInfo>

          <ForgotPasswordForm>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="E-mail"
                  placeholderTextColor={theme.COLORS['gray-color-400']}
                  editable={!loading}
                  keyboardType="email-address"
                  returnKeyType="done"
                  error={errors.email?.message}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                  }}
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
    </KeyboardAwareScrollView>
  );
}
