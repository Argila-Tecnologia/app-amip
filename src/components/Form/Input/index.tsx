import { forwardRef, useCallback, useState } from 'react';

import { TextInputProps, TextInput } from 'react-native';

import { useTheme } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';

import {
  Wrapper,
  Container,
  TextInputField,
  SecureButton,
  Icon,
  ErrorText,
} from './styles';

interface IInputProps extends TextInputProps {
  icon?: keyof typeof Feather.glyphMap;
  secureTextFieldEntry?: boolean;
  error?: string | null;
}

export const Input = forwardRef<TextInput, IInputProps>(
  ({ icon, secureTextFieldEntry = false, error = null, ...rest }, ref) => {
    const [isSecureText, setIsSecureText] = useState(secureTextFieldEntry);

    const theme = useTheme();

    // FUNCTIONS
    const toggleSecureText = useCallback(() => {
      setIsSecureText((oldState) => !oldState);
    }, []);
    // END FUNCTIONS

    return (
      <Wrapper>
        <Container isErrored={!!error}>
          {/*
            Nenhum dos dois usos de Icon (prefixo, olho de senha) tinha
            "color" definido antes - ficavam pretos só pelo padrão do
            próprio Feather, sem acompanhar tema nenhum.
          */}
          {icon && (
            <Icon
              name={icon}
              size={24}
              color={theme.COLORS['text-secondary']}
            />
          )}

          <TextInputField
            ref={ref}
            keyboardAppearance="dark"
            placeholderTextColor={theme.COLORS['text-secondary']}
            secureTextEntry={isSecureText}
            {...rest}
          />

          {secureTextFieldEntry && (
            <SecureButton onPress={toggleSecureText}>
              <Icon
                name={isSecureText ? 'eye' : 'eye-off'}
                size={20}
                color={theme.COLORS['text-secondary']}
              />
            </SecureButton>
          )}
        </Container>

        {!!error && <ErrorText>{error}</ErrorText>}
      </Wrapper>
    );
  },
);
