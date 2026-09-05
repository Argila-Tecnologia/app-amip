import { useMemo } from 'react';

import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { Wrapper, ErrorText } from './styles';

interface IItems {
  label: string;
  value: string;
}

interface ISelectPickerProps extends PickerSelectProps {
  items: IItems[];
  placeholder: string;
  value?: string;
  error?: string | null;
}

export function SelectPicker({
  items,
  placeholder,
  value,
  error = null,
  ...rest
}: ISelectPickerProps) {
  const theme = useTheme();

  // surface (não background): mesmo raciocínio do Form/Input - a caixa do
  // picker precisa de uma camada visual diferente da tela por trás dela.
  const selectPickerTypeColor = theme.COLORS.surface;

  const chevronIconSelectPicker = useMemo(() => {
    return (
      <Feather
        name="chevron-down"
        size={25}
        color={theme.COLORS['text-secondary']}
      />
    );
  }, [theme.COLORS]);

  return (
    <Wrapper>
      <RNPickerSelect
        items={items}
        placeholder={{
          label: placeholder,
          value: '',
        }}
        useNativeAndroidPickerStyle={false}
        value={value}
        Icon={() => chevronIconSelectPicker}
        darkTheme
        style={{
          placeholder: {
            color: theme.COLORS['text-secondary'],
          },
          iconContainer: {
            top: 17,
            right: 10,
          },
          inputIOS: {
            width: '100%',
            height: 60,

            fontFamily: theme.FONT_FAMILY.REGULAR,
            fontSize: theme.FONT_SIZE.LG,
            color: theme.COLORS.text,

            paddingVertical: 10,
            paddingHorizontal: 23,

            borderWidth: 2,
            // Mantido 'black-color' fixo de propósito (decisão do usuário,
            // 2026-09-05): usar o token 'border' deixava essa borda visível
            // demais no tema escuro, mas mudava a aparência no claro (preto
            // -> cinza claro) - preferiu manter fidelidade visual no claro
            // e aceitar que a borda fica com contraste baixo no escuro.
            borderColor: error
              ? theme.COLORS['red-color']
              : theme.COLORS['black-color'],
            borderRadius: 8,

            paddingRight: 30, // to ensure the text is never behind the icon

            backgroundColor: selectPickerTypeColor,
          },
          inputAndroid: {
            width: '100%',
            height: 60,

            fontFamily: theme.FONT_FAMILY.REGULAR,
            fontSize: theme.FONT_SIZE.LG,
            color: theme.COLORS.text,

            paddingVertical: 10,
            paddingHorizontal: 23,

            borderWidth: 2,
            borderColor: error
              ? theme.COLORS['red-color']
              : theme.COLORS.border,
            borderRadius: 8,

            paddingRight: 30, // to ensure the text is never behind the icon

            backgroundColor: selectPickerTypeColor,
          },
        }}
        {...rest}
      />

      {!!error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
