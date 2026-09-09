import { useCallback, useState } from 'react';

import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

import { MaskedTextInputProps } from 'react-native-mask-text';

import { useTheme } from 'styled-components/native';

import {
  InputContainer,
  InputLabel,
  InputContent,
  TextInputField,
  ErrorText,
} from './styles';

interface IInputMaskProps extends MaskedTextInputProps {
  label?: string;
  contentStyle?: NonNullable<unknown>;
  error?: string | null;
}

export function InputMask({
  label,
  contentStyle = {},
  error = null,
  onFocus,
  onBlur,
  ...rest
}: IInputMaskProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Restaura o destaque visual de foco (perdido na migração pro tema - ver
  // comentário em styles.ts) chamando também o onFocus/onBlur que o
  // chamador eventualmente passe, em vez de simplesmente sobrescrever.
  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return (
    <InputContainer>
      {label && <InputLabel>{label}</InputLabel>}

      <InputContent style={contentStyle} isError={!!error} isFocused={isFocused}>
        <TextInputField
          keyboardAppearance="dark"
          onFocus={handleFocus}
          onBlur={handleBlur}
          /*
            Era 'gray-color-200' (#ECECEC, quase branco) - já ficava com
            contraste bem baixo no tema claro (esse é um dos poucos casos
            em que a migração muda um pouco a aparência no claro, de
            propósito: no escuro, um cinza quase-branco fixo apareceria
            MUITO mais forte que o pretendido pra um texto de placeholder,
            então troquei pelo token certo semanticamente em vez de manter
            o valor antigo igual nos dois temas).
          */
          placeholderTextColor={theme.COLORS['text-secondary']}
          {...rest}
        />
      </InputContent>

      {!!error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
}
