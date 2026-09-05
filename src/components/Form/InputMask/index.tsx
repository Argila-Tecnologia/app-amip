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
  ...rest
}: IInputMaskProps) {
  const theme = useTheme();

  return (
    <InputContainer>
      {label && <InputLabel>{label}</InputLabel>}

      <InputContent style={contentStyle} isError={!!error}>
        <TextInputField
          keyboardAppearance="dark"
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
