import { forwardRef, useCallback, useState } from 'react';

import { TextInputProps, TextInput } from 'react-native';

import { useTheme } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';

import { Container, TextInputField, SecureButton, Icon } from './styles';

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
      <Container isErrored={!!error}>
        {icon && <Icon name={icon} size={24} />}

        <TextInputField
          ref={ref}
          keyboardAppearance="dark"
          placeholderTextColor={theme.COLORS['black-color-100']}
          secureTextEntry={isSecureText}
          {...rest}
        />

        {secureTextFieldEntry && (
          <SecureButton onPress={toggleSecureText}>
            <Icon name={isSecureText ? 'eye' : 'eye-off'} size={20} />
          </SecureButton>
        )}
      </Container>
    );
  },
);
