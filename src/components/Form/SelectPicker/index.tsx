import { useMemo } from 'react';

import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

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

  const selectPickerTypeColor = theme.COLORS['gray-color-100'];

  const chevronIconSelectPicker = useMemo(() => {
    return (
      <Feather
        name="chevron-down"
        size={25}
        color={theme.COLORS['gray-color-400']}
      />
    );
  }, [theme.COLORS]);

  return (
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
          color: theme.COLORS['gray-color-400'],
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
          color: theme.COLORS['black-color'],

          paddingVertical: 10,
          paddingHorizontal: 23,

          borderWidth: 2,
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
          color: theme.COLORS['black-color'],

          paddingVertical: 10,
          paddingHorizontal: 23,

          borderWidth: 2,
          borderColor: error
            ? theme.COLORS['red-color']
            : theme.COLORS['black-color'],
          borderRadius: 8,

          paddingRight: 30, // to ensure the text is never behind the icon

          backgroundColor: selectPickerTypeColor,
        },
      }}
      {...rest}
    />
  );
}
