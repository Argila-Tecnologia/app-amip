import React from 'react';

import { TouchableOpacityProps, ActivityIndicator } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components';

import { Container, ButtonText, Icon } from './styles';

interface IButtonProps extends TouchableOpacityProps {
  children: string;
  loading?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}

export function Button({
  children,
  loading = false,
  icon,
  ...rest
}: IButtonProps) {
  const theme = useTheme();

  return (
    <Container loading={loading} {...rest}>
      {icon && (
        <Icon name={icon} size={24} color={theme.colors['blue-dark-color']} />
      )}
      {loading ? (
        <ActivityIndicator size={25} color={theme.colors['black-color']} />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </Container>
  );
}
