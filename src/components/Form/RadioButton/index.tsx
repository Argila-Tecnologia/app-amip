import React from 'react';
import { Container, RadioGroupButton, RadioFill, Title } from './styles';

import { TouchableOpacityProps } from 'react-native';

interface IItems {
  label: string;
  value: string;
}

type IRadioButtonProps = TouchableOpacityProps & {
  items: IItems[];
  checkedValue: string;
  onChange: () => void;
};

export function RadioButton({
  items,
  checkedValue,
  onChange,
  ...rest
}: IRadioButtonProps) {
  return (
    <Container>
      {items.map((item) => {
        const active = checkedValue === item.value;
        return (
          <>
            <RadioGroupButton
              key={item.value}
              onPress={() => {
                onChange();
              }}
              {...rest}
            >
              <RadioFill />
            </RadioGroupButton>
            <Title>{item.label}</Title>
          </>
        );
      })}
    </Container>
  );
}
